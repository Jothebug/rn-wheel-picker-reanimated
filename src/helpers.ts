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

function isObject(value: any) {
  return value !== null && typeof value === 'object';
}

const isNil = (value: any) => {
  return value === undefined || value === null;
};

function isEmpty(objectName: any) {
  return Object.keys(objectName).length === 0;
}

type UsePresenterProps = {
  itemHeight: number;
  data: WheelPickerItemProps<WheelPickerItemValue>[];
  initialValue: InitialValueProps<WheelPickerItemValue> | any;
};

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

const getCurrentIndex = ({
  initialValue,
  data,
}: Omit<UsePresenterProps, 'itemHeight'>): number | undefined => {
  if (isNil(initialValue) || (isObject(initialValue) && isEmpty(initialValue)))
    return undefined;

  if (isObject(initialValue) && !isEmpty(initialValue)) {
    return data.findIndex((item) => item.value === initialValue.value);
  } else {
    return data.findIndex((item) => item.value === initialValue);
  }
};

const usePresenter = ({
  data,
  itemHeight,
  initialValue,
}: UsePresenterProps) => {
  const currentIndex = getCurrentIndex({ initialValue, data });

  const middleIndex = getMiddleIndex(itemHeight, data.length);
  const getItemAtOffset = (offset: number): ItemAtOffset => {
    const index = middleIndex(offset);
    const value = data[index]?.value ?? 0;
    return { value, index };
  };

  return { getItemAtOffset, currentIndex };
};

export {
  ITEM_HEIGHT,
  isAndroid,
  ReanimatedPressable,
  ReanimatedText,
  ReanimatedFlatList,
  usePresenter,
};
