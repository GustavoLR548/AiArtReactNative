import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

import PromptField from "../components/CustomFields/PromptField";
import NumSampleSlider from "../components/CustomFields/NumSampleSlider";
import ImagesList from "../components/List/ImagesList";
import { AspectRatio, textToImage } from "../api/MonsterAPI";
import AspectRatioPicker from "../components/CustomFields/AspectRatioPicker";
import { ThemePalette } from "../theme/palette";

interface TextToImageProps {
  colors?: ThemePalette;
}

const TextToImage = ({ colors }: TextToImageProps) => {
  const styles = createStyles(colors);
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
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>Text to Image</Text>
          <Text style={styles.description}>
            Turn your ideas into unique AI artworks using a prompt and generation
            settings.
          </Text>
        </View>

        <View style={styles.card}>
          <PromptField
            text={prompt}
            setText={setPrompt}
            inputMaxLength={180}
            colors={colors}
          />
        </View>

        <View style={styles.card}>
          <AspectRatioPicker
            value={aspectRatio}
            onValueChange={setAspectRatio}
            colors={colors}
          />
        </View>

        <View style={styles.card}>
          <NumSampleSlider
            numSamples={numSamples}
            setNumSamples={setNumSamples}
            colors={colors}
          />
        </View>

        <View style={styles.actionRow}>
          {loading ? (
            <ActivityIndicator size="large" color={colors?.primary ?? "#111827"} />
          ) : (
            <Pressable style={styles.primaryButton} onPress={generateImage}>
              <Text style={styles.primaryButtonText}>Generate</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.resultsCard}>
          <Text style={styles.cardTitle}>Results</Text>
          <ImagesList imagesList={generatedImages} colors={colors} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors?: ThemePalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors?.background ?? "#f8fafc",
    },
    content: {
      padding: 16,
      paddingBottom: 28,
      gap: 12,
    },
    heroCard: {
      backgroundColor: colors?.surface ?? "#ffffff",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors?.border ?? "#e5e7eb",
      padding: 16,
    },
    title: {
      color: colors?.text ?? "#111827",
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 6,
    },
    description: {
      color: colors?.mutedText ?? "#4b5563",
      fontSize: 14,
      lineHeight: 20,
    },
    card: {
      backgroundColor: colors?.surface ?? "#ffffff",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors?.border ?? "#e5e7eb",
      padding: 14,
    },
    actionRow: {
      minHeight: 44,
      justifyContent: "center",
    },
    primaryButton: {
      backgroundColor: colors?.primary ?? "#111827",
      borderRadius: 10,
      alignItems: "center",
      paddingVertical: 12,
    },
    primaryButtonText: {
      color: colors?.onPrimary ?? "#ffffff",
      fontSize: 15,
      fontWeight: "600",
    },
    resultsCard: {
      backgroundColor: colors?.surface ?? "#ffffff",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors?.border ?? "#e5e7eb",
      padding: 14,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors?.text ?? "#111827",
      marginBottom: 10,
    },
  });

export default TextToImage;
