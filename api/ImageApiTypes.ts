export enum AspectRatio {
  Square = "square",
  Landscape = "landscape",
  Portrait = "portrait",
}

export type ImageApiProvider = "gemini" | "stability";

export interface ImageApiHandler {
  textToImage(
    prompt: string,
    numSamples: number,
    aspectRatio: AspectRatio
  ): Promise<string[]>;

  imageToImage(
    prompt: string,
    initialImage: string,
    samples: number,
    aspectRatio: AspectRatio,
    strength?: number
  ): Promise<string[]>;

  imageEditing(
    prompt: string,
    initialImage: string,
    samples: number,
    aspectRatio: AspectRatio,
    strength?: number
  ): Promise<string[]>;
}
