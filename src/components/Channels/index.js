/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
// import {
//   Heading,
//   Grid,
//   Cell,
//   useNotificationDispatch
// } from 'amazon-chime-sdk-component-library-react';
// import { useTheme } from 'styled-components';
// import ChannelsWrapper from '../../containers/channels/ChannelsWrapper';
// import Messages from '../../containers/messages/Messages';
// import Input from '../../containers/input/Input';
// import './style.css';
import {
  useChatChannelState,
  useChatMessagingState
} from '../../providers/ChatMessagesProvider';
import { useAuthContext } from '../../providers/AuthProvider';
import {View, Text} from "react-native";

const Channels = () => {
  // const currentTheme = useTheme();

  const { member, userSignOut } = useAuthContext();
  const {
    messages,
    messagesRef,
    setMessages,
    onReceiveMessage
  } = useChatMessagingState();
  // const notificationDispatch = useNotificationDispatch();

  const {
    setChannelMessageToken,
    setChannelList,
    activeChannel,
    activeChannelRef,
    channelList,
    hasMembership
  } = useChatChannelState();

  // const handleUserNameCopyClick = _e => {
  //   // Create new element
  //   const el = document.createElement('textarea');
  //   // Set value (string to be copied)
  //   el.value = member.userId;
  //   // Set non-editable to avoid focus and move outside of view
  //   el.setAttribute('readonly', '');
  //   el.style = { position: 'absolute', left: '-9999px' };
  //   document.body.appendChild(el);
  //   // Select text inside element
  //   el.select();
  //   // Copy text to clipboard
  //   document.execCommand('copy');
  //   // Remove temporary element
  //   document.body.removeChild(el);
  //
  //   notificationDispatch({
  //     type: 0,
  //     payload: {
  //       message: 'UserId copied to clipboard!',
  //       severity: 'info',
  //       autoClose: true,
  //       autoCloseDelay: 1000
  //     }
  //   });
  // };

  console.log(channelList, 'chat screen');
  return (
    <View>
      <Text>Chat Screen</Text>
    </View>
  );
};

export default Channels;
