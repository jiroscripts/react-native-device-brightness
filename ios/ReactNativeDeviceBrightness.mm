#import "ReactNativeDeviceBrightness.h"
#import <UIKit/UIKit.h>

@implementation ReactNativeDeviceBrightness
RCT_EXPORT_MODULE()

// Get the current screen brightness (0.0 - 1.0)
RCT_EXPORT_METHOD(getBrightness:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            CGFloat brightness = [UIScreen mainScreen].brightness;
            resolve(@(brightness)); // Return the brightness as a number (0.0 - 1.0)
        });
    }
    @catch (NSException *exception) {
        reject(@"ERROR", @"Unable to get brightness", nil);
    }
}

// Set the screen brightness (0.0 - 1.0)
RCT_EXPORT_METHOD(setBrightness:(double)brightness
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            CGFloat constrainedBrightness = fminf(fmaxf(brightness, 0.0), 1.0);
            [UIScreen mainScreen].brightness = constrainedBrightness;

            resolve(@(constrainedBrightness)); // Return the actual brightness that was set
        });
    }
    @catch (NSException *exception) {
        reject(@"ERROR", @"Unable to set brightness", nil);
    }
}

// Reset the screen brightness to the default system brightness
RCT_EXPORT_METHOD(resetBrightness:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            // Reset to the default system brightness (using a system-level method)
            [[UIScreen mainScreen] setBrightness:0.5]; // Default system brightness is typically around 0.5
            resolve(@(0.5)); // Indicate that the reset was successful, assuming 0.5 is the default
        });
    }
    @catch (NSException *exception) {
        reject(@"ERROR", @"Unable to reset brightness", nil);
    }
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeReactNativeDeviceBrightnessSpecJSI>(params);
}
#endif

@end
