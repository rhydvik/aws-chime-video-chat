/* @flow */
import React, {useState, useEffect} from 'react';
import {Auth} from "aws-amplify";
import {listChannelMessages, listChannels, sendChannelMessage} from "../api/ChimeAPI";
import Config from "../Config";
import {SafeAreaView, ScrollView, View, Text, FlatList} from "react-native";
import {Button, Input} from "react-native-elements";

// type Props = {
//
// };

const Chat = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({});
    const [channel, setChannel] = useState({});
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [forceReload, setForceReload] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        Auth.currentAuthenticatedUser()
            .then(user => {
                console.log(user, 'user')
                setUser(user);
                listChannels(Config.appInstanceArn, user.attributes.profile)
                    .then(res => {
                        console.log(res, 'channel res');
                        setChannel(res[0]);
                        listChannelMessages(res[0].ChannelArn, user.attributes.profile)
                            .then((messages) => {
                                console.log(messages);
                                setMessages(messages.Messages || []);
                                setIsLoading(false);
                                setInputText('');
                            })
                            .catch(e => console.log(e));
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => {
                console.log(err);
            });
    }, [forceReload]);

    const sendMessage = () => {
        sendChannelMessage(
            channel.ChannelArn,
            inputText,
            {
                userId: user.attributes.profile,
                username: user.username,
            }
        )
            .then((res) => {
                setForceReload(new Date());
            })
            .catch(error => console.log(error))
    }
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>

              <FlatList
                  data={messages} renderItem={({ item, index, separators }) => (
              <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#212121'}}>
                  <Text style={{fontSize: 22, color: 'black'}}>
                      {item.Sender.Name}
                  </Text>
                  <Text>
                      {item.Content}
                  </Text>
              </View>
              )} />
            </View>
            <View style={{height: 140}}>
              <Input placeholder="Enter Message" onChangeText={text => setInputText(text)} value={inputText} />
            <Button
                title="Send Message"
                disabled={false}
                buttonStyle={{height: 40, zIndex: 9999}}
                onPress={sendMessage}
                loading={isLoading}
            />
            </View>
        </SafeAreaView>
    );
};

export default Chat;
