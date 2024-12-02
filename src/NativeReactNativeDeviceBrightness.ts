import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Get the current screen brightness level.
   * @returns A promise resolving to the current brightness level (0.0 to 1.0)
   */
  getBrightness(): Promise<number>;

  /**
   * Set the screen brightness level.
   * @param brightness - Brightness level (0.0 to 1.0)
   * @returns A promise that resolves when the operation completes
   */
  setBrightness(brightness: number): Promise<number>;

  /**
   * Reset the screen brightness to the system default level.
   * @returns A promise that resolves when the operation completes
   */
  resetBrightness(): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ReactNativeDeviceBrightness');
