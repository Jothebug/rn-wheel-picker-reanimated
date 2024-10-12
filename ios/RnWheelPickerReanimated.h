#ifdef __cplusplus
#import "rn-wheel-picker-reanimated.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRnWheelPickerReanimatedSpec.h"

@interface RnWheelPickerReanimated : NSObject <NativeRnWheelPickerReanimatedSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RnWheelPickerReanimated : NSObject <RCTBridgeModule>
#endif

@end
