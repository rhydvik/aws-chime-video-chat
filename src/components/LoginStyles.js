import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'red'
    },
    logoBox: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        paddingHorizontal: 30,
    },
    logo: {
        width: 325,
        height: 55,
        marginVertical: 20,
    },
    inputBox: {
        padding: 20,
        // flex: 1,
    },
    inputContainer: {
        height: 85,
        paddingBottom: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    inputContainerStyle: {
        height: 85,
        backgroundColor: '#fff',
        padding: 10,
    },
    apnLogoSection: {
        display: 'flex',
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
    },
});
