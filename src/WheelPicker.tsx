import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {
  type WheelPickerItemProps,
  type WheelPickerItemValue,
  type WheelPickerProps,
} from './types';
import WheelPickerItem from './WheelPickerItem';
import {
  getCurrentIndex,
  isAndroid,
  ITEM_HEIGHT,
  ReanimatedFlatList,
  usePresenter,
} from './helpers';

const WheelPicker = ({
  name,
  data = [],
  initialValue,
  numberOfVisibleRows = 5, // it should be odd number 3-5-7-9
  itemHeight = ITEM_HEIGHT,
  activeColor,
  inactiveColor,
  onChange,
  hasSeparator = true,
  ...rest
}: WheelPickerProps) => {
  const scrollViewRef = useRef<Animated.ScrollView>();
  const offsetY = useSharedValue(0);
  const shouldSkipNextOnChange = useRef(false);

  const listHeight = useMemo(
    () => itemHeight * numberOfVisibleRows,
    [itemHeight, numberOfVisibleRows]
  );

  const currentIndex = useMemo(
    () => getCurrentIndex(initialValue, data),
    [data, initialValue]
  );
  const prevIndex = useRef(currentIndex);
  const { getItemAtOffset } = usePresenter({ data, itemHeight });

  const scrollHandler = useAnimatedScrollHandler((e) => {
    offsetY.value = e.contentOffset.y / itemHeight;
  });

  const halfVisible = useMemo(
    () => (numberOfVisibleRows - 1) / 2,
    [numberOfVisibleRows]
  );

  const keyExtractor = useCallback(
    (item: WheelPickerItemProps<WheelPickerItemValue>, index: number) =>
      `${item}-${index}`,
    []
  );

  useEffect(() => {
    if (currentIndex !== undefined) {
      shouldSkipNextOnChange.current = true;
      scrollToIndex(currentIndex, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onChange = useCallback(
    (value: WheelPickerItemValue, index: number) => {
      if (!shouldSkipNextOnChange.current) {
        onChange?.({ name, value, index });
      }
    },
    [name, onChange]
  );

  const onScrollBeginDrag = useCallback(() => {
    shouldSkipNextOnChange.current = false;
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { value, index } = getItemAtOffset(
        event.nativeEvent.contentOffset.y
      );
      _onChange(value, index);
    },
    [_onChange, getItemAtOffset]
  );

  const onMomentumScrollEndAndroid = useCallback(
    (index: number) => {
      if (isAndroid && index && prevIndex.current !== index) {
        prevIndex.current = index;
        const value = data[index]?.value ?? 0;
        _onChange(value, index);
      }
    },
    [_onChange, data]
  );

  const scrollToOffset = useCallback(
    (index: number, animated: boolean) => {
      //@ts-expect-error
      scrollViewRef.current?.scrollToOffset({
        offset: index * itemHeight,
        animated,
      });
    },
    [itemHeight]
  );

  const scrollToIndex = useCallback(
    (index: number, animated: boolean) => {
      onMomentumScrollEndAndroid(index);
      setTimeout(() => scrollToOffset(index, animated), 100);
    },
    [onMomentumScrollEndAndroid, scrollToOffset]
  );

  const onSelectItem = useCallback(
    (index: number) => {
      shouldSkipNextOnChange.current = false;
      scrollToIndex(index, true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight]
  );

  const offsets = useMemo(
    () => data.map((_, i) => i * itemHeight),
    [data, itemHeight]
  );

  const renderItem = useCallback(
    ({
      item,
      index,
    }: ListRenderItemInfo<WheelPickerItemProps<WheelPickerItemValue>>) => {
      return (
        <WheelPickerItem
          {...item}
          key={index}
          index={index}
          height={itemHeight}
          offsetY={offsetY}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          onSelectItem={onSelectItem}
          halfVisible={halfVisible}
        />
      );
    },
    [activeColor, halfVisible, inactiveColor, itemHeight, offsetY, onSelectItem]
  );

  const contentContainerStyle = useMemo(
    () => ({
      paddingVertical: itemHeight * halfVisible,
    }),
    [halfVisible, itemHeight]
  );

  const renderSeparator = useMemo(() => {
    if (!hasSeparator) return;

    return (
      <View style={styles.separatorContainer}>
        <View style={[styles.separatorStyle, { height: itemHeight / 1.5 }]} />
      </View>
    );
  }, [hasSeparator, itemHeight]);

  const androidFlatListProps = useMemo(
    () => ({
      updateCellsBatchingPeriod: 50,
      maxToRenderPerBatch: 20,
      initialNumToRender: 20,
      decelerationRate: 'fast',
    }),
    []
  );

  return (
    <View style={rest.style}>
      {renderSeparator}
      <View style={[styles.flatListContainer, { height: listHeight }]}>
        <ReanimatedFlatList
          {...(isAndroid && { androidFlatListProps })}
          {...rest.flatListProps}
          data={data}
          keyExtractor={keyExtractor}
          onScroll={scrollHandler}
          onMomentumScrollEnd={onMomentumScrollEnd}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={onScrollBeginDrag}
          // @ts-ignore
          ref={scrollViewRef}
          snapToOffsets={offsets}
          getItemLayout={getItemLayout}
          renderItem={renderItem}
          initialScrollIndex={currentIndex}
          contentContainerStyle={contentContainerStyle}
        />
      </View>
    </View>
  );
};

export default memo(WheelPicker);
const styles = StyleSheet.create({
  flatListContainer: {
    justifyContent: 'center',
  },
  separatorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },
  separatorStyle: {
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});
