import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import TouchableImageDisplay from "../components/ImageDisplay/TouchableImageDisplay";
import PromptField from "../components/CustomFields/PromptField";
import NumSampleSlider from "../components/CustomFields/NumSampleSlider";
import ImagesList from "../components/List/ImagesList";
import AspectRatioPicker from "../components/CustomFields/AspectRatioPicker";
import { AspectRatio, imageToImage } from "../api/GeminiAPI";
import { ThemePalette } from "../theme/palette";

interface ImageToImageProps {
  colors?: ThemePalette;
}

const ImageToImage = ({ colors }: ImageToImageProps) => {
  const styles = createStyles(colors);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [numSamples, setNumSamples] = useState(1);
  const [text, setText] = React.useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    AspectRatio.Square
  );
  const [loading, setLoading] = useState(false);

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

  const generateImage = async () => {
    if (!text.trim()) {
      Alert.alert("Prompt required", "Please enter a prompt to continue.");
      return;
    }

    if (!selectedImage) {
      Alert.alert(
        "Image required",
        "Please upload a source image before generating."
      );
      return;
    }

    setLoading(true);
    const images = await imageToImage(
      text,
      selectedImage,
      numSamples,
      aspectRatio
    );
    setGeneratedImages(images ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>Image to Image</Text>
          <Text style={styles.description}>
            Upload a base image and generate new variations guided by your prompt.
          </Text>
        </View>

        <View style={styles.card}>
          <PromptField
            text={text}
            setText={setText}
            placeholderText="Describe how to transform the image..."
            inputMaxLength={180}
            colors={colors}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Source image</Text>
          <TouchableImageDisplay
            imageUri={selectedImage}
            onImagePressed={handleImagePicker}
            colors={colors}
            placeholder={
              <Text style={styles.uploadPlaceholder}>Tap to upload image</Text>
            }
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
            <ActivityIndicator
              size="large"
              color={colors?.primary ?? "#111827"}
            />
          ) : (
            <Pressable style={styles.primaryButton} onPress={generateImage}>
              <Text style={styles.primaryButtonText}>Generate image</Text>
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
    cardTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors?.text ?? "#111827",
      marginBottom: 10,
    },
    uploadPlaceholder: {
      color: colors?.mutedText ?? "#6b7280",
      fontSize: 14,
    },
    primaryButton: {
      backgroundColor: colors?.primary ?? "#111827",
      borderRadius: 10,
      alignItems: "center",
      paddingVertical: 12,
    },
    actionRow: {
      minHeight: 44,
      justifyContent: "center",
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
  });

export default ImageToImage;
