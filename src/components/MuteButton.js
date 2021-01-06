/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

import React from 'react'
import {TouchableOpacity, Image, View} from 'react-native'
import styles from '../Style';

let mutedImg = require('../assets/microphone-muted.png');
let normalImg = require('../assets/microphone.png');

export const MuteButton = ({muted, onPress}) => {
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
            source={muted ? mutedImg : normalImg}
          />
        </TouchableOpacity>
      </View>
  )
}
