import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, StyleSheet, Image } from "react-native";
import { ReactNode } from "react";
import { ThemePalette } from "../../theme/palette";
interface TouchableImageDisplayProps {
  imageUri: string;
  onImagePressed: () => void;
  placeholder?: ReactNode;
  colors?: ThemePalette;
}

const TouchableImageDisplay = ({
  imageUri,
  onImagePressed,
  placeholder,
  colors,
}: TouchableImageDisplayProps) => {
  const styles = createStyles(colors);

  const fallbackPlaceholder = (
    <Text style={styles.imagePlaceholder}>No image provided</Text>
  );

  return (
    <TouchableOpacity style={styles.imageContainer} onPress={onImagePressed}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.selectedImage} />
      ) : (
        placeholder ?? fallbackPlaceholder
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors?: ThemePalette) =>
  StyleSheet.create({
    imageContainer: {
      width: "100%",
      height: 200,
      borderWidth: 1,
      borderColor: colors?.border ?? "#d1d5db",
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors?.inputBackground ?? "#f9fafb",
      overflow: "hidden",
    },
    selectedImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    imagePlaceholder: {
      fontSize: 14,
      color: colors?.mutedText ?? "#6b7280",
    },
  });

export default TouchableImageDisplay;
