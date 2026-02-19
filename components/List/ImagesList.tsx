import { View, Text, StyleSheet, Modal } from "react-native";
import TouchableImageDisplay from "../ImageDisplay/TouchableImageDisplay";
import { useState } from "react";
import ImageView from "react-native-image-viewing";
import { ImageSource } from "react-native-image-viewing/dist/@types";
import { ThemePalette } from "../../theme/palette";

interface ImagesListProps {
  imagesList: string[];
  colors?: ThemePalette;
}

const ImagesList = ({ imagesList, colors }: ImagesListProps) => {
  const styles = createStyles(colors);
  const [showModal, setShowModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const getUriArray = () => {
    let array: ImageSource[] = [];
    imagesList.forEach((value) => array.push({ uri: value }));

    return array;
  };

  const imagePressedHandler = (index: number) => {
    setShowModal(true);
    setImageIndex(index);
  };

  return (
    <View style={styles.container}>
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <ImageView
          images={getUriArray()}
          imageIndex={imageIndex}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        ></ImageView>
      </Modal>
      <Text style={styles.title}>Images generated:</Text>
      {imagesList.map((value, index) => (
        <TouchableImageDisplay
          imageUri={value}
          key={index}
          colors={colors}
          onImagePressed={() => imagePressedHandler(index)}
        />
      ))}
    </View>
  );
};

const createStyles = (colors?: ThemePalette) =>
  StyleSheet.create({
    container: {
      gap: 10,
      width: "100%",
      paddingBottom: 8,
    },
    title: {
      textAlign: "left",
      color: colors?.text ?? "#111827",
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 2,
    },
  });

export default ImagesList;
