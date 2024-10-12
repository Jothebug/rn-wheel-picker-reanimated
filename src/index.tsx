import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'rn-wheel-picker-reanimated' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const RnWheelPickerReanimatedModule = isTurboModuleEnabled
  ? require('./NativeRnWheelPickerReanimated').default
  : NativeModules.RnWheelPickerReanimated;

const RnWheelPickerReanimated = RnWheelPickerReanimatedModule
  ? RnWheelPickerReanimatedModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return RnWheelPickerReanimated.multiply(a, b);
}
