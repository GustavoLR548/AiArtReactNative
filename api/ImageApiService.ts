import { ImageApiFactory, getSelectedProvider } from "./ImageApiFactory";
import { AspectRatio } from "./ImageApiTypes";

const getHandler = async () => {
  const provider = await getSelectedProvider();
  return ImageApiFactory.create(provider);
};

export { AspectRatio };

export const textToImage = async (
  prompt: string,
  numSamples: number,
  aspectRatio: AspectRatio
) => {
  const handler = await getHandler();
  return handler.textToImage(prompt, numSamples, aspectRatio);
};

export const imageToImage = async (
  prompt: string,
  initialImage: string,
  samples: number,
  aspectRatio: AspectRatio,
  strength: number = 0.75
) => {
  const handler = await getHandler();
  return handler.imageToImage(prompt, initialImage, samples, aspectRatio, strength);
};

export const imageEditing = async (
  prompt: string,
  initialImage: string,
  samples: number,
  aspectRatio: AspectRatio,
  strength: number = 0.75
) => {
  const handler = await getHandler();
  return handler.imageEditing(prompt, initialImage, samples, aspectRatio, strength);
};
