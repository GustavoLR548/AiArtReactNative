import Slider from "@react-native-community/slider";
import { View, Text, StyleSheet } from "react-native";
import { ThemePalette } from "../../theme/palette";

interface NumSampleSliderProps {
  numSamples: number;
  setNumSamples: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  colors?: ThemePalette;
}

const NumSampleSlider = ({
  numSamples,
  setNumSamples,
  minValue = 1,
  maxValue = 4,
  step = 1,
  colors,
}: NumSampleSliderProps) => {
  const styles = createStyles(colors);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Number of samples:</Text>
      <Slider
        style={styles.slider}
        minimumTrackTintColor={colors?.primary ?? "#111827"}
        maximumTrackTintColor={colors?.border ?? "#d1d5db"}
        thumbTintColor={colors?.primary ?? "#111827"}
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

const createStyles = (colors?: ThemePalette) =>
  StyleSheet.create({
    field: {
      marginVertical: 2,
    },
    label: {
      color: colors?.text ?? "#111827",
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 8,
    },
    slider: {
      width: "100%",
    },
    sliderValue: {
      color: colors?.mutedText ?? "#4b5563",
      fontSize: 14,
      marginTop: 4,
      textAlign: "center",
    },
  });

export default NumSampleSlider;
