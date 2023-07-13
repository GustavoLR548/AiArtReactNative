import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import PromptField from "../components/CustomFields/PromptField";
import NumSampleSlider from "../components/CustomFields/NumSampleSlider";
import ImagesList from "../components/List/ImagesList";
import { AspectRatio, textToImage } from "../api/MonsterAPI";
import AspectRatioPicker from "../components/CustomFields/AspectRatioPicker";

const TextToImage = () => {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [numSamples, setNumSamples] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    AspectRatio.Square
  );
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    let images: string[] = await textToImage(prompt, numSamples, aspectRatio);
    console.log(images);
    if (!images) {
      console.log("deu ruim");
    } else setGeneratedImages(images);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.scroll}>
      <PromptField text={prompt} setText={setPrompt} />
      <AspectRatioPicker value={aspectRatio} onValueChange={setAspectRatio} />
      <NumSampleSlider numSamples={numSamples} setNumSamples={setNumSamples} />
      <View>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button onPress={generateImage} title="Generate" />
        )}
      </View>
      <ImagesList imagesList={generatedImages} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    width: "100%",
    paddingTop: 45,
    paddingLeft: 35,
    paddingRight: 35,
    height: "100%",
  },
});

export default TextToImage;
