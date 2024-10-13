import Animated from 'react-native-reanimated';
import type {
  InitialValueProps,
  ItemAtOffset,
  WheelPickerItemProps,
  WheelPickerItemValue,
} from './types';
import {
  FlatList,
  Platform,
  Pressable,
  Text,
  type FlatListProps,
} from 'react-native';

const ITEM_HEIGHT = 30;
const isAndroid = Platform.OS === 'android';
const ReanimatedPressable = Animated.createAnimatedComponent(Pressable);
const ReanimatedText = Animated.createAnimatedComponent(Text);
const ReanimatedFlatList =
  Animated.createAnimatedComponent<
    FlatListProps<WheelPickerItemProps<WheelPickerItemValue>>
  >(FlatList);

const getMiddleIndex = (itemHeight: number, listSize: number) => {
  const valueInRange = (value: number, min: number, max: number) => {
    if (value < min || value === -0) return min;
    if (value > max) return max;
    return value;
  };
  const _middleIndex = (offset: number) => {
    const calculatedIndex = Math.round(offset / itemHeight);
    return valueInRange(calculatedIndex, 0, listSize - 1);
  };
  return _middleIndex;
};

const usePresenter = ({
  data,
  itemHeight,
}: {
  data: WheelPickerItemProps<WheelPickerItemValue>[];
  itemHeight: number;
}) => {
  const middleIndex = getMiddleIndex(itemHeight, data.length);
  const getItemAtOffset = (offset: number): ItemAtOffset => {
    const index = middleIndex(offset);
    const value = data[index]?.value ?? 0;
    return { value, index };
  };
  return { getItemAtOffset };
};

function isObject(value: any) {
  return value !== null && typeof value === 'object';
}

const isNil = (value: any) => {
  return value === undefined || value === null;
};

function isEmpty(objectName: any) {
  return Object.keys(objectName).length === 0;
}

const getCurrentIndex = (
  _initialValue: InitialValueProps<WheelPickerItemValue> | any,
  data: WheelPickerItemProps<WheelPickerItemValue>[]
): number | undefined => {
  if (
    isNil(_initialValue) ||
    (isObject(_initialValue) && isEmpty(_initialValue))
  )
    return undefined;

  if (isObject(_initialValue) && !isEmpty(_initialValue)) {
    return data.findIndex((item) => item.value === _initialValue.value);
  } else {
    return data.findIndex((item) => item.value === _initialValue);
  }
};

export {
  getCurrentIndex,
  ITEM_HEIGHT,
  isAndroid,
  ReanimatedPressable,
  ReanimatedText,
  ReanimatedFlatList,
  usePresenter,
};
