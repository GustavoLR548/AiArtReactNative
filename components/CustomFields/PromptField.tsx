import { View, Text, TextInput, StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/palette";

interface PromptFieldProps {
  text: string;
  placeholderText?: string;
  inputMaxLength?: number;
  setText: (text: string) => void;
  colors?: ThemePalette;
}

const PromptField = ({
  text,
  placeholderText = "Insert prompt here...",
  inputMaxLength = 100,
  setText,
  colors,
}: PromptFieldProps) => {
  const styles = createStyles(colors);

  return (
    <View>
      <Text style={styles.label}>Insert prompt</Text>
      <TextInput
        maxLength={inputMaxLength}
        multiline={true}
        placeholder={placeholderText}
        placeholderTextColor={colors?.mutedText ?? "#9ca3af"}
        style={styles.textInput}
        value={text}
        onChangeText={(text) => setText(text)}
      />
      <Text style={styles.smallLabel}>
        {text.length}/{inputMaxLength}
      </Text>
    </View>
  );
};

const createStyles = (colors?: ThemePalette) =>
  StyleSheet.create({
    label: {
      color: colors?.text ?? "#111827",
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 8,
    },
    smallLabel: {
      marginTop: 6,
      fontSize: 11,
      color: colors?.mutedText ?? "#6b7280",
      textAlign: "right",
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors?.border ?? "#d1d5db",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      minHeight: 96,
      textAlignVertical: "top",
      color: colors?.text ?? "#111827",
      backgroundColor: colors?.inputBackground ?? "#ffffff",
    },
  });

export default PromptField;
