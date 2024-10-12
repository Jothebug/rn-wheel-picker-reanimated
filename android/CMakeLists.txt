cmake_minimum_required(VERSION 3.4.1)
project(RnWheelPickerReanimated)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 14)

add_library(rn-wheel-picker-reanimated            SHARED
            ../cpp/rn-wheel-picker-reanimated.cpp
            cpp-adapter.cpp
)

# Specifies a path to native header files.
include_directories(
            ../cpp
)
