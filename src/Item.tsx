import { memo } from 'react';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import type { WheelPickerItemProps, WheelPickerItemValue } from './types';
import { ReanimatedPressable, ReanimatedText } from './helpers';

interface InternalProps<T> extends WheelPickerItemProps<T> {
  index: number;
  offsetY: SharedValue<number>;
  onSelectItem: (index: number) => void;
  height: number;
  halfVisible: number;
  activeColor?: string;
  inactiveColor?: string;
  labelStyle?: Omit<TextStyle, 'color'>;
  itemStyle?: ViewStyle;
}

const Item = ({
  activeColor = '#000',
  inactiveColor = '#cacaca',
  label,
  index,
  height,
  offsetY,
  halfVisible,
  onSelectItem,
  labelStyle,
  itemStyle,
}: InternalProps<WheelPickerItemValue>) => {
  const animatedTextColor = useAnimatedStyle(
    () => ({
      color: interpolateColor(
        offsetY.value,
        [index - halfVisible - 1, index, index + halfVisible + 1],
        [inactiveColor, activeColor, inactiveColor]
      ),
    }),
    []
  );

  const y = useDerivedValue(
    () =>
      interpolate(
        offsetY.value,
        [index - halfVisible - 1, index, index + halfVisible + 1],
        [-1, 0, 1],
        Extrapolation.CLAMP
      ),
    []
  );

  const animatedContainer = useAnimatedStyle(
    () => ({
      transform: [
        { perspective: halfVisible * 100 },
        { rotateX: 90 * y.value + 'deg' },
        { scale: 1 - 0.1 * Math.abs(y.value) },
      ],
      opacity: 1 / (1 + Math.abs(y.value)),
    }),
    []
  );
  return (
    <ReanimatedPressable
      onPress={() => onSelectItem?.(index)}
      style={[styles.container, animatedContainer, { height }, itemStyle]}
    >
      <ReanimatedText style={[labelStyle, animatedTextColor]}>
        {label}
      </ReanimatedText>
    </ReanimatedPressable>
  );
};

export default memo(Item);
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
