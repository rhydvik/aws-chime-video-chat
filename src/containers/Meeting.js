/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

import React from 'react';
import {View, Text, FlatList, Alert, SafeAreaView, Linking} from 'react-native';
import styles from '../Style';
import { NativeFunction, getSDKEventEmitter, MobileSDKEvent, MeetingError } from '../utils/Bridge';
import { RNVideoRenderView } from '../components/RNVideoRenderView';
import { MuteButton } from '../components/MuteButton';
import { CameraButton } from '../components/CameraButton';
import { HangOffButton } from '../components/HangOffButton';
import { AttendeeItem } from '../components/AttendeeItem';
import {Button} from "react-native-elements";
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Chat from "../components/Chat";

// Maps attendee Id to attendee Name
const attendeeNameMap = {};


export class Meeting extends React.Component {
  constructor() {
    super();
    this.state = {
      attendees: [],
      videoTiles: [],
      mutedAttendee: [],
      selfVideoEnabled: false,
      meetingTitle: '',
      screenShareTile: null
    };
  }

  componentDidMount() {
    /**
     * Attendee Join and Leave handler
     */
    this.onAttendeesJoinSubscription = getSDKEventEmitter().addListener(MobileSDKEvent.OnAttendeesJoin, ({ attendeeId, externalUserId }) => {
      if (!(attendeeId in attendeeNameMap)) {
        // The externalUserId will be a format such as c19587e7#Alice
        attendeeNameMap[attendeeId] = externalUserId.split("#")[1];
      }
      this.setState((oldState) => ({
        ...oldState,
        attendees: oldState.attendees.concat([attendeeId])
      }));
    });

    this.onAttendeesLeaveSubscription = getSDKEventEmitter().addListener(MobileSDKEvent.OnAttendeesLeave, ({ attendeeId }) => {
      this.setState((oldState) => ({
        ...oldState,
        attendees: oldState.attendees.filter((attendeeToCompare => attendeeId != attendeeToCompare))
      }));
    });

    /**
     * Attendee Mute & Unmute handler
     */
    this.onAttendeesMuteSubscription = getSDKEventEmitter().addListener(MobileSDKEvent.OnAttendeesMute, attendeeId => {
      this.setState((oldState) => ({
        ...oldState,
        mutedAttendee: oldState.mutedAttendee.concat([attendeeId])
      }));
    });

    this.onAttendeesUnmuteSubscription = getSDKEventEmitter().addListener(MobileSDKEvent.OnAttendeesUnmute, attendeeId => {
      this.setState((oldState) => ({
        ...oldState,
        mutedAttendee: oldState.mutedAttendee.filter((attendeeToCompare => attendeeId != attendeeToCompare))
      }));
    });

    /**
     * Video tile Add & Remove Handler
     */
    this.onAddVideoTileSubscription = getSDKEventEmitter().addListener(MobileSDKEvent.OnAddVideoTile, (tileState) => {
      if (tileState.isScreenShare) {
        this.setState(oldState => ({
          ...oldState,
          screenShareTile: tileState.tileId
        }));
      } else {
        this.setState(oldState => ({
          ...oldState,
          videoTiles: [...oldState.videoTiles, tileState.tileId],
          selfVideoEnabled: tileState.isLocal ? true : oldState.selfVideoEnabled
        }));
      }
    });

    this.onRemoveVideoTileSubscription = getSDKEventEmitter().addListener(MobileSDKEvent.OnRemoveVideoTile, (tileState) => {
      if (tileState.isScreenShare) {
        this.setState(oldState => ({
          ...oldState,
          screenShareTile: null
        }));
      } else {
        this.setState(oldState => ({
          ...oldState,
          videoTiles: oldState.videoTiles.filter(tileIdToCompare => tileIdToCompare != tileState.tileId),
          selfVideoEnabled: tileState.isLocal ? false : oldState.selfVideoEnabled
        }));
      }

    });

    /**
     * General Error handler
     */
    this.onErrorSubscription = getSDKEventEmitter().addListener(MobileSDKEvent.OnError, (errorType) => {
      switch(errorType) {
        case MeetingError.OnMaximumConcurrentVideoReached:
          Alert.alert("Failed to enable video", "maximum number of concurrent videos reached!");
          break;
        default:
          Alert.alert("Error", errorType);
          break;
      }
    });
  }

  componentWillUnmount() {
    if (this.onAttendeesJoinSubscription) {
      this.onAttendeesJoinSubscription.remove();
    }
    if (this.onAttendeesLeaveSubscription) {
      this.onAttendeesLeaveSubscription.remove();
    }
    if (this.onAttendeesMuteSubscription) {
      this.onAttendeesMuteSubscription.remove();
    }
    if (this.onAttendeesUnmuteSubscription) {
      this.onAttendeesUnmuteSubscription.remove();
    }
    if (this.onAddVideoTileSubscription) {
      this.onAddVideoTileSubscription.remove();
    }
    if (this.onRemoveVideoTileSubscription) {
      this.onRemoveVideoTileSubscription.remove();
    }
    if (this.onErrorSubscription) {
      this.onErrorSubscription.remove();
    }
  }

  render() {
    const currentMuted = this.state.mutedAttendee.includes(this.props.selfAttendeeId);
    return (
        <SafeAreaView style={{flex: 1}}>
          <ScrollableTabView>
            <View tabLabel="Video" style={{flex: 1}}>
          <View style={{flex: 1}}>
          {this.state.videoTiles.length > 0 ? this.state.videoTiles.map(tileId =>
              <RNVideoRenderView style={styles.video} key={tileId} tileId={tileId} />
          ) : <Text style={styles.subtitle}>No one is sharing video at this moment</Text>
          }
          </View>
          <View style={{position: 'absolute', flex: 1, top: 0, bottom: 0, left: 0, right: 0}}>
            <View style={{flex: 1}} >
              <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 40}}>
                <Text style={styles.title}>{this.props.meetingTitle}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20}}>

                <Button
                    type="outline"
                    title="DONATE"
                    titleStyle={{color: 'white'}}
                    buttonStyle={{borderColor: 'white'}}
                    containerStyle={{marginRight: 20,
                      marginLeft: 20,
                      width: '40%',
                      borderColor: 'white',
                      }}
                    onPress={() => Linking.openURL('https://clickandpledge.com/').catch((err) => console.error('An error occurred', err))}
                />
                <Button
                    type="outline"
                    title="SHARE LINK"
                    titleStyle={{color: 'white'}}
                    buttonStyle={{borderColor: 'white'}}
                    containerStyle={{marginRight: 20, marginLeft: 20, width: '40%'}} />
              </View>
            <View>
            <View style={styles.buttonContainer}>
                 <MuteButton muted={currentMuted} onPress={() => NativeFunction.setMute(!currentMuted) }/>
                 <CameraButton disabled={this.state.selfVideoEnabled} onPress={() =>  NativeFunction.setCameraOn(!this.state.selfVideoEnabled)}/>
                 <HangOffButton onPress={() => {
                   NativeFunction.stopMeeting()
                   this.props.updateCurrentRoute('login')
                 }} />
               </View>
            </View>
          </View>
          </View>
            <View tabLabel="Chat" style={{flex: 1}}>
              <Chat />
            </View>
          </ScrollableTabView>
        </SafeAreaView>
      // <View style={[styles.container, { justifyContent: 'flex-start' }]}>
      //   <Text style={styles.title}>{this.props.meetingTitle}</Text>

      //   <Text style={styles.title}>Video</Text>
      //   <View style={styles.videoContainer}>
      //     {
      //       this.state.videoTiles.length > 0 ? this.state.videoTiles.map(tileId =>
      //         <RNVideoRenderView style={styles.video} key={tileId} tileId={tileId} />
      //       ) : <Text style={styles.subtitle}>No one is sharing video at this moment</Text>
      //     }
      //   </View>
      //   {
      //     !!this.state.screenShareTile &&
      //     <React.Fragment>
      //       <Text style={styles.title}>Screen Share</Text>
      //       <View style={styles.videoContainer}>
      //         <RNVideoRenderView style={styles.screenShare} key={this.state.screenShareTile} tileId={this.state.screenShareTile} />
      //       </View>
      //     </React.Fragment>
      //   }
      //   <Text style={styles.title}>Attendee</Text>
      //   <FlatList
      //     style={styles.attendeeList}
      //     data={this.state.attendees}
      //     renderItem={({ item }) => <AttendeeItem attendeeName={attendeeNameMap[item] ? attendeeNameMap[item] : item} muted={this.state.mutedAttendee.includes(item)}/>}
      //     keyExtractor={(item) => item}
      //   />
      // </View>
    );
  }
}
