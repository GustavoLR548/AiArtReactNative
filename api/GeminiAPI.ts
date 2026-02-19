import { GoogleGenAI } from "@google/genai";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import { AspectRatio } from "./ImageApiTypes";

export { AspectRatio } from "./ImageApiTypes";

const NANO_BANANA_MODEL = "gemini-2.5-flash-image";
const expoExtra =
  Constants.expoConfig?.extra ??
  (Constants.manifest as { extra?: Record<string, string> } | null)?.extra ??
  (Constants.manifest2 as { extra?: Record<string, string> } | null)?.extra;

const GEMINI_API_KEY =
  expoExtra?.EXPO_PUBLIC_GEMINI_API_KEY ??
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ??
  "GEMINI_API_KEY_HERE";

const FALLBACK_TIMEOUT = 120000;
const CIRCUIT_BREAKER_FAILURES = 3;
const CIRCUIT_BREAKER_COOLDOWN_MS = 30000;

type CircuitState = "closed" | "open" | "half-open";
let circuitState: CircuitState = "closed";
let circuitFailures = 0;
let circuitNextAttemptAt = 0;

type GeminiPart = {
  text?: string;
  inlineData?: {
    mimeType?: string;
    data?: string;
  };
  inline_data?: {
    mime_type?: string;
    data?: string;
  };
};

const getAspectRatioHint = (aspectRatio: AspectRatio) => {
  switch (aspectRatio) {
    case AspectRatio.Landscape:
      return "Generate the output in a landscape composition (16:9).";
    case AspectRatio.Portrait:
      return "Generate the output in a portrait composition (9:16).";
    default:
      return "Generate the output in a square composition (1:1).";
  }
};

const ensureApiKey = () => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "GEMINI_API_KEY_HERE") {
    throw new Error(
      "Gemini API key not configured. Set EXPO_PUBLIC_GEMINI_API_KEY or update api/GeminiAPI.ts."
    );
  }
};

const getGenAiClient = () => {
  ensureApiKey();
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
};

const readImageAsBase64 = async (imageUri: string) => {
  if (!imageUri) {
    return null;
  }

  let normalizedUri = imageUri;
  if (!normalizedUri.startsWith("file://")) {
    normalizedUri = `file://${normalizedUri}`;
  }

  const base64 = await FileSystem.readAsStringAsync(normalizedUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const lowerUri = normalizedUri.toLowerCase();
  const mimeType = lowerUri.endsWith(".png") ? "image/png" : "image/jpeg";

  return { base64, mimeType };
};

const extractImageDataUris = (parts: GeminiPart[]) => {
  const images: string[] = [];

  for (const part of parts) {
    const camelCaseInline = part.inlineData;
    const snakeCaseInline = part.inline_data;
    const base64 = camelCaseInline?.data ?? snakeCaseInline?.data;
    const mimeType =
      camelCaseInline?.mimeType ?? snakeCaseInline?.mime_type ?? "image/png";

    if (base64) {
      images.push(`data:${mimeType};base64,${base64}`);
    }
  }

  return images;
};

const getCircuitBreakerError = () => {
  const secondsRemaining = Math.max(
    1,
    Math.ceil((circuitNextAttemptAt - Date.now()) / 1000)
  );
  return new Error(
    `Gemini is temporarily unavailable. Try again in ${secondsRemaining} seconds.`
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

const callGeminiImageModel = async (
  prompt: string,
  aspectRatio: AspectRatio,
  imageUri?: string
) => {
  guardCircuitBreaker();
  const ai = getGenAiClient();

  const parts: GeminiPart[] = [
    {
      text: `${prompt}\n\n${getAspectRatioHint(aspectRatio)}\nReturn an image as output.`,
    },
  ];

  if (imageUri) {
    const imageData = await readImageAsBase64(imageUri);

    if (imageData) {
      parts.push({
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.base64,
        },
      });
    }
  }

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: NANO_BANANA_MODEL,
        contents: [
          {
            role: "user",
            parts,
          },
        ],
        config: {
          temperature: 0.8,
        },
      }),
      FALLBACK_TIMEOUT,
      "Gemini image generation timed out."
    );

    const responseParts: GeminiPart[] =
      response.candidates?.[0]?.content?.parts ?? [];
    recordCircuitSuccess();
    return extractImageDataUris(responseParts);
  } catch (error) {
    recordCircuitFailure();
    if (error instanceof Error) {
      console.error("Gemini API error:", error.message);
      const lowerMessage = error.message.toLowerCase();
      if (
        lowerMessage.includes("resource_exhausted") ||
        lowerMessage.includes("quota") ||
        lowerMessage.includes("code\":429")
      ) {
        throw new Error(
          "Gemini is temporarily busy. Please try again in a moment."
        );
      }
      if (error.message.includes("INVALID ARGUMENT")) {
        throw new Error("Image generation failed. Please try again.");
      }
    } else {
      console.error("Gemini API error:", error);
    }
    throw error instanceof Error
      ? error
      : new Error("Image generation failed. Please try again.");
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
    const generated = await callGeminiImageModel(samplePrompt, aspectRatio);
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
    const generated = await callGeminiImageModel(
      composedPrompt,
      aspectRatio,
      initialImage
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
