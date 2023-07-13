import Slider from "@react-native-community/slider";
import { View, Text, StyleSheet } from "react-native";

interface NumSampleSliderProps {
  numSamples: number;
  setNumSamples: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

const NumSampleSlider = ({
  numSamples,
  setNumSamples,
  minValue = 1,
  maxValue = 4,
  step = 1,
}: NumSampleSliderProps) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Number of samples:</Text>
      <Slider
        style={styles.slider}
        minimumValue={minValue}
        maximumValue={maxValue}
        step={step}
        value={numSamples}
        onValueChange={(value: number) => setNumSamples(value)}
      />
      <Text style={styles.sliderValue}>{numSamples}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
  },
  sliderValue: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default NumSampleSlider;
