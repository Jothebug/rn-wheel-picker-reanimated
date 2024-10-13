import type { FlatListProps, TextStyle, ViewStyle } from 'react-native';

export type WheelPickerItemValue = number | string;
export interface WheelPickerItemProps<T> {
  label: string;
  value: T;
}
export type InitialValueProps<T> = { value: T } | T;

export interface WheelPickerProps<T = WheelPickerItemValue> {
  name?: string;
  data: WheelPickerItemProps<T>[];
  initialValue?: InitialValueProps<T>;
  itemHeight?: number;
  numberOfVisibleRows?: number;
  onChange?: ({ name, value, index }: OnChangeProps) => void;
  flatListProps?: Partial<FlatListProps<WheelPickerItemProps<T>>>;
  hasSeparator?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  labelStyle?: TextStyle;
  style?: Omit<ViewStyle, 'height'>;
}
export type OnChangeProps = {
  name?: string;
  index: number;
  value: WheelPickerItemValue;
};
export type ItemAtOffset = {
  index: number;
  value: WheelPickerItemValue;
};
