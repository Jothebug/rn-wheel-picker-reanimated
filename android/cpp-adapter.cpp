#include <jni.h>
#include "rn-wheel-picker-reanimated.h"

extern "C"
JNIEXPORT jdouble JNICALL
Java_com_rnwheelpickerreanimated_RnWheelPickerReanimatedModule_nativeMultiply(JNIEnv *env, jclass type, jdouble a, jdouble b) {
    return rnwheelpickerreanimated::multiply(a, b);
}
