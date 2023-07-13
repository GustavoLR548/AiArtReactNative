import { View, Text, StyleSheet, Modal } from "react-native";
import TouchableImageDisplay from "../ImageDisplay/TouchableImageDisplay";
import Show from "../Util/Show";
import { useState } from "react";
import ImageView from "react-native-image-viewing";
import { ImageSource } from "react-native-image-viewing/dist/@types";

interface ImagesListProps {
  imagesList: string[];
}

const ImagesList = ({ imagesList }: ImagesListProps) => {
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
          onImagePressed={() => imagePressedHandler(index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    height: "100%",

    paddingLeft: 35,
    paddingRight: 35,
    paddingBottom: 65,
  },
  title: {
    textAlign: "center",
  },
});

export default ImagesList;
