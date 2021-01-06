import React, {useState, useEffect} from 'react';
import {View, Text, StatusBar, SafeAreaView, Image} from 'react-native';
import {Auth} from 'aws-amplify';

// import {TextField} from 'react-native-material-textfield';
import {Button, Input} from 'react-native-elements';

import styles from './LoginStyles';
import {listChannelMessages, listChannels, sendChannelMessage} from "../api/ChimeAPI";

import Config from '../../src/Config';

// type Props = {
//
// };

const LoginPage = ({updateCurrentRoute}) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={{flex: 1}}>
            <View style={styles.logoBox}>
            <Image
                source={{uri: 'https://clickandpledge.com/wp-content/uploads/2020/08/retina.png'}}
                style={{
                    height: 60,
                    width: 200,
                    resizeMode: 'contain',
                    backgroundColor: 'white'
                }}
                />
            </View>
            <View style={[styles.inputBox]}>
            <Input
                placeholder="Email"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputContainerStyle}
                // onChangeText={(text: string) => handleChange('email', text)}
                // error={get(errors, 'email.message')}
                message="Email is required"
                keyboardType="email-address"
                errorColor="rgb(213, 0, 0)"
                autoCapitalize="none"
                autoCompleteType="email"
            />

            <Input
                placeholder="Password"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputContainerStyle}
                // onChangeText={(text: string) => handleChange('password', text)}
                // error={get(errors, 'password.message')}
                autoCompleteType="password"
                // secureTextEntry={secureTextEntryOn}
                // renderRightAccessory={() => (
                // <IconButton
                // icon={secureTextEntryOn ? closedEye : eye}
                // onPress={() => setSecureTextEntry(!secureTextEntryOn)}
                // iconStyle={{height: 20}}
                // />
                // )}
                // onSubmitEditing={handleSubmit(onSubmit)}
                returnKeyType="send"
            />

            {/*<Button*/}
            {/*    title="SIGN IN"*/}
            {/*    disabled={false}*/}
            {/*    buttonStyle={{height: 40, zIndex: 9999}}*/}
            {/*    onPress={() => updateCurrentRoute('meetingCreate')}*/}
            {/*    // loading={isLoading}*/}
            {/*/>*/}
                <Button
                    title="LOG IN"
                    disabled={false}
                    buttonStyle={{height: 40, zIndex: 9999}}
                    loading={isLoading}
                    onPress={() => {
                        setIsLoading(true);
                        Auth.signIn({
                            username: 'vikram',
                            password: 'Test123!',
                        })
                            .then(async user => {
                                updateCurrentRoute('meetingCreate')
                                setIsLoading(false);
                            })
                            .catch(e => console.log(e))
                    }
                    }
                    // loading={isLoading}
                />

            </View>
            </View>
    )
};

export default LoginPage;
