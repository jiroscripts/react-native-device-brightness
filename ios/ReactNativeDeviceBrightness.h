
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNReactNativeDeviceBrightnessSpec.h"

@interface ReactNativeDeviceBrightness : NSObject <NativeReactNativeDeviceBrightnessSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ReactNativeDeviceBrightness : NSObject <RCTBridgeModule>
#endif

@end
