import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import { AspectRatio } from "./ImageApiTypes";

const STABILITY_API_ENDPOINT =
  "https://api.stability.ai/v2beta/stable-image/generate/sd3";
const STABILITY_MODEL = "sd3.5-flash";

const expoExtra =
  Constants.expoConfig?.extra ??
  (Constants.manifest as { extra?: Record<string, string> } | null)?.extra ??
  (Constants.manifest2 as { extra?: Record<string, string> } | null)?.extra;

const STABILITY_API_KEY =
  expoExtra?.EXPO_PUBLIC_STABILITY_API_KEY ??
  process.env.EXPO_PUBLIC_STABILITY_API_KEY ??
  "STABILITY_API_KEY_HERE";

const FALLBACK_TIMEOUT = 120000;
const CIRCUIT_BREAKER_FAILURES = 3;
const CIRCUIT_BREAKER_COOLDOWN_MS = 30000;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

type CircuitState = "closed" | "open" | "half-open";
let circuitState: CircuitState = "closed";
let circuitFailures = 0;
let circuitNextAttemptAt = 0;

const ensureApiKey = () => {
  if (!STABILITY_API_KEY || STABILITY_API_KEY === "STABILITY_API_KEY_HERE") {
    throw new Error(
      "Stability API key not configured. Set EXPO_PUBLIC_STABILITY_API_KEY or update api/StabilityAPI.ts."
    );
  }
};

const getAspectRatioValue = (aspectRatio: AspectRatio) => {
  switch (aspectRatio) {
    case AspectRatio.Landscape:
      return "16:9";
    case AspectRatio.Portrait:
      return "9:16";
    default:
      return "1:1";
  }
};

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> => {
  return await new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

const getCircuitBreakerError = () => {
  const secondsRemaining = Math.max(
    1,
    Math.ceil((circuitNextAttemptAt - Date.now()) / 1000)
  );

  return new Error(
    `Stability AI is temporarily unavailable. Try again in ${secondsRemaining} seconds.`
  );
};

const guardCircuitBreaker = () => {
  if (circuitState === "open") {
    if (Date.now() >= circuitNextAttemptAt) {
      circuitState = "half-open";
      return;
    }
    throw getCircuitBreakerError();
  }
};

const recordCircuitSuccess = () => {
  circuitState = "closed";
  circuitFailures = 0;
  circuitNextAttemptAt = 0;
};

const recordCircuitFailure = () => {
  circuitFailures += 1;

  if (circuitFailures >= CIRCUIT_BREAKER_FAILURES) {
    circuitState = "open";
    circuitNextAttemptAt = Date.now() + CIRCUIT_BREAKER_COOLDOWN_MS;
  }
};

const dataUriToTempFile = async (imageUri: string) => {
  const dataUriMatch = imageUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!dataUriMatch) {
    return imageUri;
  }

  const mimeType = dataUriMatch[1];
  const base64 = dataUriMatch[2];
  const extension = mimeType.includes("png") ? "png" : "jpg";
  const tempFileUri = `${FileSystem.cacheDirectory}stability-input-${Date.now()}.${extension}`;

  await FileSystem.writeAsStringAsync(tempFileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return tempFileUri;
};

const normalizeFileUri = async (imageUri: string) => {
  const resolved = await dataUriToTempFile(imageUri);

  if (resolved.startsWith("file://")) {
    return resolved;
  }

  if (resolved.startsWith("/")) {
    return `file://${resolved}`;
  }

  return resolved;
};

const assertImageWithinSizeLimit = async (imageUri: string) => {
  const fileUri = await normalizeFileUri(imageUri);
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) {
    throw new Error("Input image not found. Please choose another image.");
  }

  if (fileInfo.size && fileInfo.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Input image is too large. Please use an image smaller than 10MB.");
  }

  return fileUri;
};

const sanitizeStabilityError = (status: number, bodyText: string) => {
  const normalizedBody = bodyText.toLowerCase();

  if (status === 401 || status === 403) {
    return new Error("Stability API key is invalid or unauthorized.");
  }

  if (
    status === 429 ||
    normalizedBody.includes("quota") ||
    normalizedBody.includes("rate")
  ) {
    return new Error("Stability AI is temporarily busy. Please try again in a moment.");
  }

  if (status === 400) {
    return new Error("Invalid image generation request. Please review your prompt and input image.");
  }

  return new Error("Image generation failed. Please try again.");
};

const callStabilityImageModel = async (
  prompt: string,
  aspectRatio: AspectRatio,
  imageUri?: string,
  strength: number = 0.75
) => {
  guardCircuitBreaker();
  ensureApiKey();

  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("model", STABILITY_MODEL);
  formData.append("output_format", "png");

  if (imageUri) {
    const fileUri = await assertImageWithinSizeLimit(imageUri);
    formData.append("mode", "image-to-image");
    formData.append("strength", String(strength));
    formData.append(
      "image",
      {
        uri: fileUri,
        name: "input.png",
        type: "image/png",
      } as never
    );
  } else {
    formData.append("aspect_ratio", getAspectRatioValue(aspectRatio));
  }

  try {
    const response = await withTimeout(
      fetch(STABILITY_API_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: "application/json",
        },
        body: formData,
      }),
      FALLBACK_TIMEOUT,
      "Stability image generation timed out."
    );

    const bodyText = await response.text();

    if (!response.ok) {
      console.error("Stability API error:", bodyText);
      throw sanitizeStabilityError(response.status, bodyText);
    }

    const parsed = JSON.parse(bodyText) as { image?: string };

    if (!parsed.image) {
      throw new Error("Image generation failed. Please try again.");
    }

    recordCircuitSuccess();
    return [`data:image/png;base64,${parsed.image}`];
  } catch (error) {
    recordCircuitFailure();

    if (error instanceof Error) {
      console.error("Stability API error:", error.message);
      throw error;
    }

    console.error("Stability API error:", error);
    throw new Error("Image generation failed. Please try again.");
  }
};

export const textToImage = async (
  prompt: string,
  numSamples: number,
  aspectRatio: AspectRatio
) => {
  const images: string[] = [];

  for (let sampleIndex = 0; sampleIndex < numSamples; sampleIndex += 1) {
    const samplePrompt = `${prompt}\nVariation ${sampleIndex + 1}.`;
    const generated = await callStabilityImageModel(samplePrompt, aspectRatio);

    if (generated.length > 0) {
      images.push(generated[0]);
    }
  }

  return images;
};

export const imageToImage = async (
  prompt: string,
  initialImage: string,
  samples: number,
  aspectRatio: AspectRatio,
  strength: number = 0.75
) => {
  const images: string[] = [];

  for (let sampleIndex = 0; sampleIndex < samples; sampleIndex += 1) {
    const composedPrompt = `${prompt}\nTransform strength: ${strength}. Variation ${
      sampleIndex + 1
    }.`;

    const generated = await callStabilityImageModel(
      composedPrompt,
      aspectRatio,
      initialImage,
      strength
    );

    if (generated.length > 0) {
      images.push(generated[0]);
    }
  }

  return images;
};

export const imageEditing = async (
  prompt: string,
  initialImage: string,
  samples: number,
  aspectRatio: AspectRatio,
  strength: number = 0.75
) => {
  const editingPrompt = `Inpainting/Outpainting request: ${prompt}`;
  return imageToImage(editingPrompt, initialImage, samples, aspectRatio, strength);
};
