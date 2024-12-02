import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package '@jiroscripts/react-native-device-brightness' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ReactNativeDeviceBrightnessModule = isTurboModuleEnabled
  ? require('./NativeReactNativeDeviceBrightness').default
  : NativeModules.ReactNativeDeviceBrightness;

const ReactNativeDeviceBrightness = ReactNativeDeviceBrightnessModule
  ? ReactNativeDeviceBrightnessModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function getBrightness(): Promise<number> {
  return ReactNativeDeviceBrightness.getBrightness();
}

export function setBrightness(brightness: number): Promise<number> {
  return ReactNativeDeviceBrightness.setBrightness(brightness);
}

export function resetBrightness(): Promise<number> {
  return ReactNativeDeviceBrightness.resetBrightness();
}
