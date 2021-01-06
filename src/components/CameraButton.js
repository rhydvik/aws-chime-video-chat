/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

import React from 'react'
import {TouchableOpacity, Image, View} from 'react-native'
import styles from '../Style';

let videoDisabledImg = require('../assets/video-disabled.png');
let videoImg = require('../assets/video.png');

export const CameraButton = ({disabled, onPress}) => {
  return (
      <View style={{
        marginRight: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 0.5,
      }}>
  <TouchableOpacity
    onPress={() => {
      onPress();
  }}>
    <Image
      style={styles.meetingButton}
      source={disabled ? videoDisabledImg : videoImg}
    />
  </TouchableOpacity>
      </View>
  )
}
