/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert,
  Text
} from 'react-native';
import { AppearanceProvider, Appearance } from 'react-native-appearance';


import { Login } from './containers/Login';
import { Meeting } from './containers/Meeting';
import { createMeetingRequest } from './utils/Api';
import { getSDKEventEmitter, MobileSDKEvent, NativeFunction } from './utils/Bridge';
import styles from './Style';
import LoginPage from "./components/LoginPage";

import { AuthProvider } from './providers/AuthProvider';
import { MessagingProvider } from './providers/ChatMessagesProvider';
import { UserPermissionProvider } from './providers/UserPermissionProvider';
import { IdentifyProvider } from './providers/IdentityProvider';
import Channels from './components/Channels';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isInMeeting: false,
      isLoading: false,
      meetingTitle: '',
      selfAttendeeId: '',
      currentRoute: 'login',
    }
  }

  componentDidMount() {
    Appearance.set({ colorScheme: 'light' });
    this.onMeetingStartSubscription = getSDKEventEmitter().addListener(MobileSDKEvent.OnMeetingStart, () => {
      this.setState({ currentRoute: 'meeting', isInMeeting: true, isLoading: false });
    });

    this.onMeetingEndSubscription = getSDKEventEmitter().addListener(MobileSDKEvent.OnMeetingEnd, () => {
      this.setState({ isInMeeting: false, isLoading: false });
    });

    this.onErrorSubscription = getSDKEventEmitter().addListener(MobileSDKEvent.OnError, (message) => {
      Alert.alert("SDK Error", message);
    });
  }

  componentWillUnmount() {
    if (this.onMeetingEndSubscription) {
      this.onMeetingEndSubscription.remove();
    }
    if (this.onMeetingStartSubscription) {
      this.onMeetingStartSubscription.remove();
    }
    if (this.onErrorSubscription) {
      this.onErrorSubscription.remove();
    }
  }

  initializeMeetingSession = (meetingName, userName) => {
    this.setState({
      isLoading: true,
    })

    createMeetingRequest(meetingName, userName).then(meetingResponse => {
      this.setState({
        meetingTitle: meetingName,
        selfAttendeeId: meetingResponse.JoinInfo.Attendee.Attendee.AttendeeId
      })
      NativeFunction.startMeeting(meetingResponse.JoinInfo.Meeting.Meeting, meetingResponse.JoinInfo.Attendee.Attendee);
      console.log(meetingResponse, 'meetingResponse');
    }).catch(error => {
      Alert.alert("Unable to find meeting", `There was an issue finding that meeting. The meeting may have already ended, or your authorization may have expired.\n ${error}`);
      this.setState({ isLoading: false });
    });
  };

  updateCurrentRoute = (route) => this.setState({currentRoute: route})

  renderRoute() {
    const {currentRoute} = this.state;
    if (currentRoute === 'login') return <LoginPage updateCurrentRoute={this.updateCurrentRoute} />;
    if (currentRoute === 'meetingCreate') return <Login isLoading={this.state.isLoading} onSubmit={(meetingName, userName) => this.initializeMeetingSession(meetingName, userName)} />;
    if (currentRoute === 'meeting') return <Meeting meetingTitle={this.state.meetingTitle} selfAttendeeId={this.state.selfAttendeeId} updateCurrentRoute={this.updateCurrentRoute} />;
  }

  render() {
    return (
        <AppearanceProvider>
          <StatusBar />
          <SafeAreaView style={{flex: 1, backgroundColor: '#EEE'}}>
            {/*<AuthProvider>*/}
            {/*  <IdentifyProvider>*/}
            {/*    <MessagingProvider>*/}
            {/*      <UserPermissionProvider>*/}
            {/*        <Channels />*/}
            {/*      </UserPermissionProvider>*/}
            {/*    </MessagingProvider>*/}
            {/*  </IdentifyProvider>*/}
            {/*</AuthProvider>*/}
            { this.renderRoute() }
          </SafeAreaView>
        </AppearanceProvider>
    );
  }
}
export default App;
