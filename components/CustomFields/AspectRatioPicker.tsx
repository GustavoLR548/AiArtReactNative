import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet, Text } from "react-native";
import { AspectRatio } from "../../api/MonsterAPI";
import { ThemePalette } from "../../theme/palette";

interface AspectRatioPickerProps {
  value: AspectRatio;
  onValueChange: (value: AspectRatio) => void;
  colors?: ThemePalette;
}

const AspectRatioPicker = ({
  value,
  onValueChange,
  colors,
}: AspectRatioPickerProps) => {
  const styles = createStyles(colors);

  return (
    <View>
      <Text style={styles.label}>Aspect Ratio:</Text>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor={colors?.text ?? "#111827"}
      >
        <Picker.Item label="Square" value={AspectRatio.Square} />
        <Picker.Item label="Landscape" value={AspectRatio.Landscape} />
        <Picker.Item label="Portrait" value={AspectRatio.Portrait} />
      </Picker>
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
    picker: {
      color: colors?.text ?? "#111827",
      backgroundColor: colors?.inputBackground ?? "#ffffff",
      borderRadius: 10,
    },
  });

export default AspectRatioPicker;
