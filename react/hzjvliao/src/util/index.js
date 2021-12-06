import React, { Component } from 'react'
import {
    Dimensions,
} from 'react-native';
export const screenW = Dimensions.get('window').width;
export const screenH = Dimensions.get('window').height;
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;

/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
export function isIphoneX() {
    return (
        Platform.OS === 'ios' &&
        ((screenH === X_HEIGHT && screenW === X_WIDTH) ||
            (screenH === X_WIDTH && screenW === X_HEIGHT))
    )
}

export const px2dp = (px) => screenW * px / 750;