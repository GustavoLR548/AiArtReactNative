import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, StyleSheet, Image } from "react-native";
import { ReactNode } from "react";
interface TouchableImageDisplayProps {
  imageUri: string;
  onImagePressed: () => void;
  placeholder?: ReactNode;
}

const TouchableImageDisplay = ({
  imageUri,
  onImagePressed,
  placeholder = <Text style={styles.imagePlaceholder}>No image provided</Text>,
}: TouchableImageDisplayProps) => {
  return (
    <TouchableOpacity style={styles.imageContainer} onPress={onImagePressed}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.selectedImage} />
      ) : (
        placeholder
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    fontSize: 16,
    color: "gray",
  },
});

export default TouchableImageDisplay;
