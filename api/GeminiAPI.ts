import axios from "axios";
import * as FileSystem from "expo-file-system";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";
const NANO_BANANA_MODEL = "gemini-2.0-flash-exp-image-generation";
const GEMINI_API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "GEMINI_API_KEY_HERE";

const FALLBACK_TIMEOUT = 120000;

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

export enum AspectRatio {
  Square = "square",
  Landscape = "landscape",
  Portrait = "portrait",
}

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

const callGeminiImageModel = async (
  prompt: string,
  aspectRatio: AspectRatio,
  imageUri?: string
) => {
  ensureApiKey();

  const parts: GeminiPart[] = [
    {
      text: `${prompt}\n\n${getAspectRatioHint(aspectRatio)}\nReturn an image as output.`,
    },
  ];

  if (imageUri) {
    const imageData = await readImageAsBase64(imageUri);

    if (imageData) {
      parts.push({
        inline_data: {
          mime_type: imageData.mimeType,
          data: imageData.base64,
        },
      });
    }
  }

  const endpoint = `${GEMINI_API_URL}/${NANO_BANANA_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await axios.post(
    endpoint,
    {
      contents: [
        {
          role: "user",
          parts,
        },
      ],
      generationConfig: {
        temperature: 0.8,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: FALLBACK_TIMEOUT,
    }
  );

  const responseParts: GeminiPart[] =
    response.data?.candidates?.[0]?.content?.parts ?? [];
  return extractImageDataUris(responseParts);
};

export const textToImage = async (
  prompt: string,
  numSamples: number,
  aspectRatio: AspectRatio
) => {
  const images: string[] = [];

  try {
    for (let sampleIndex = 0; sampleIndex < numSamples; sampleIndex += 1) {
      const samplePrompt = `${prompt}\nVariation ${sampleIndex + 1}.`;
      const generated = await callGeminiImageModel(samplePrompt, aspectRatio);
      if (generated.length > 0) {
        images.push(generated[0]);
      }
    }
  } catch (exc) {
    console.error("textToImage error:", exc);
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

  try {
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
  } catch (exc) {
    console.error("imageToImage error:", exc);
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
