import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet, Text } from "react-native";
import { AspectRatio } from "../../api/MonsterAPI";

interface AspectRatioPickerProps {
  value: AspectRatio;
  onValueChange: (value: AspectRatio) => void;
}

const AspectRatioPicker = ({
  value,
  onValueChange,
}: AspectRatioPickerProps) => {
  return (
    <View>
      <Text style={styles.label}>Aspect Ratio:</Text>
      <Picker selectedValue={value} onValueChange={onValueChange}>
        <Picker.Item label="Square" value={AspectRatio.Square} />
        <Picker.Item label="Landscape" value={AspectRatio.Landscape} />
        <Picker.Item label="Portrait" value={AspectRatio.Portrait} />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default AspectRatioPicker;
