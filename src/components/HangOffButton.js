/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

import React from 'react'
import {TouchableOpacity, Image, View} from 'react-native'
import styles from '../Style';

export const HangOffButton = ({onPress}) => {
  return (
      <View style={{
        marginRight: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 1,
      }}>
  <TouchableOpacity
    onPress={() => {
      onPress();
  }}>
    <Image
      style={styles.meetingButton}
      source={require('../assets/hang-off.png')}
    />
  </TouchableOpacity>
      </View>
  )
}
