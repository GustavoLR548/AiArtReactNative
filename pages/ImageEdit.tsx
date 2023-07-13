import React, { useState } from "react";
import { View, StyleSheet, Button, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import TouchableImageDisplay from "../components/ImageDisplay/TouchableImageDisplay";
import PromptField from "../components/CustomFields/PromptField";
import NumSampleSlider from "../components/CustomFields/NumSampleSlider";
import ImagesList from "../components/List/ImagesList";

const ImageEdit = () => {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [numSamples, setNumSamples] = useState(1);
  const [text, setText] = React.useState("Useless Text");

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const generateImage = () => {
    console.log("generate image");
  };

  return (
    <ScrollView style={styles.scroll}>
      <PromptField text={text} setText={setText} />
      <TouchableImageDisplay
        imageUri={selectedImage}
        onImagePressed={handleImagePicker}
      />
      <NumSampleSlider numSamples={numSamples} setNumSamples={setNumSamples} />
      <View>
        <Button onPress={generateImage} title="Generate image" />
      </View>
      <ImagesList imagesList={generatedImages} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    width: "100%",
    paddingTop: 35,
    paddingLeft: 35,
    paddingRight: 35,
    height: "100%",
  },
});

export default ImageEdit;
