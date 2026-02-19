import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ThemeMode, ThemePalette } from "../theme/palette";

interface OptionsProps {
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  colors: ThemePalette;
}

const modes: { label: string; value: ThemeMode; description: string }[] = [
  { label: "Light", value: "light", description: "Always use light interface" },
  { label: "Dark", value: "dark", description: "Always use dark interface" },
  { label: "System", value: "system", description: "Follow your device theme" },
];

const Options = ({ themeMode, onThemeModeChange, colors }: OptionsProps) => {
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>Options</Text>
          <Text style={styles.description}>
            Configure how the app looks and behaves.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Color options</Text>
          <Text style={styles.cardSubtitle}>Choose your preferred appearance.</Text>

          {modes.map((mode) => {
            const selected = themeMode === mode.value;

            return (
              <Pressable
                key={mode.value}
                style={[
                  styles.optionRow,
                  selected && styles.optionRowSelected,
                ]}
                onPress={() => onThemeModeChange(mode.value)}
              >
                <View>
                  <Text style={styles.optionLabel}>{mode.label}</Text>
                  <Text style={styles.optionDescription}>{mode.description}</Text>
                </View>
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected ? <View style={styles.radioInner} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 28,
      gap: 12,
    },
    heroCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 6,
    },
    description: {
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 20,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      gap: 10,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
    },
    cardSubtitle: {
      color: colors.mutedText,
      fontSize: 14,
      marginBottom: 4,
    },
    optionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.surface,
      gap: 12,
    },
    optionRowSelected: {
      borderColor: colors.primary,
    },
    optionLabel: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 2,
    },
    optionDescription: {
      color: colors.mutedText,
      fontSize: 13,
    },
    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuterSelected: {
      borderColor: colors.primary,
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
  });

export default Options;
