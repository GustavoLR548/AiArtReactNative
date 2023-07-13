import { View, Text, TextInput, StyleSheet } from "react-native";

interface PromptFieldProps {
  text: string;
  placeholderText?: string;
  inputMaxLength?: number;
  setText: (text: string) => void;
}

const PromptField = ({
  text,
  placeholderText = "Insert prompt here...",
  inputMaxLength = 100,
  setText,
}: PromptFieldProps) => {
  return (
    <View>
      <Text style={styles.label}>Insert prompt</Text>
      <TextInput
        maxLength={100}
        multiline={true}
        placeholder={placeholderText}
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

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  smallLabel: {
    fontSize: 10,
    color: "lightgrey",
    textAlign: "right",
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
  },
});

export default PromptField;
