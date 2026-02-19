import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ImageApiHandler, ImageApiProvider } from "./ImageApiTypes";
import * as GeminiAPI from "./GeminiAPI";
import * as StabilityAPI from "./StabilityApi";

const IMAGE_PROVIDER_STORAGE_KEY = "@aiart/image_provider";

class GeminiApiHandler implements ImageApiHandler {
  textToImage = GeminiAPI.textToImage;
  imageToImage = GeminiAPI.imageToImage;
  imageEditing = GeminiAPI.imageEditing;
}

class StabilityApiHandler implements ImageApiHandler {
  textToImage = StabilityAPI.textToImage;
  imageToImage = StabilityAPI.imageToImage;
  imageEditing = StabilityAPI.imageEditing;
}

export class ImageApiFactory {
  static create(provider: ImageApiProvider): ImageApiHandler {
    return provider === "stability"
      ? new StabilityApiHandler()
      : new GeminiApiHandler();
  }
}

export const getSelectedProvider = async (): Promise<ImageApiProvider> => {
  const stored = await AsyncStorage.getItem(IMAGE_PROVIDER_STORAGE_KEY);
  if (stored === "stability") {
    return "stability";
  }
  return "gemini";
};

export const setSelectedProvider = async (
  provider: ImageApiProvider
): Promise<void> => {
  await AsyncStorage.setItem(IMAGE_PROVIDER_STORAGE_KEY, provider);
};
