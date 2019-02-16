import React from 'react';
import { ScrollView, Text, View, StyleSheet, Button, TouchableHighlight, Image} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Constants, Video, Audio, Asset } from 'expo';
clientId = "PmFCVf89FiVPeprYiXRHNA==";
clientKey = "fKJaIZYiS4cYYCEg8wVSX4XM0UanJ1WuopDLDWjw-C7uv3h_LJZVlHkuHyuYZrtycu_vf-5z1oAvaaRThXHkxg=="
class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_PLAY_BUTTON = new Icon(require('../assets/images/play_button.png'), 34, 51);
const ICON_PAUSE_BUTTON = new Icon(require('../assets/images/pause_button.png'), 34, 51);
const ICON_STOP_BUTTON = new Icon(require('../assets/images/stop_button.png'), 22, 22);
const BACKGROUND_COLOR = '#FFF8ED';

export default class LinksScreen extends React.Component {
   constructor(props) {
    super(props);
    this.soundtrack = null;
    this.state = {
      volume: 1.0, 
      isPlaying: false,
    }
  };
  static navigationOptions = {
    title: 'Music',
  };

  playSoundtrack = async() => {
    this.soundtrack = new Audio.Sound();
    try {
      await this.soundtrack.loadAsync(require('../assets/music/TakeMe.mp3'), {isPlaying: false}, true)
      await this.soundtrack.setIsMutedAsync(false);
      await this.soundtrack.setVolumeAsync(0.5);
      //await soundtrack.playAsync();
    } catch (err) {
      console.log(err);
    }
  };

  _onPlayPausePressed = () => {
    if (this.soundtrack != null) {
      console.log ("soundtrack is NOT null");
      if (this.state.isPlaying) {
        this.soundtrack.pauseAsync();
        this.setState({isPlaying: false})
      } else {
        this.soundtrack.playAsync();
        this.setState({isPlaying: true})
      }
    }
    else {
      console.log ("soundtrack is null");
    }
  };

  _onStopPressed = () => {
    if (this.soundtrack != null) {
      console.log("stop sound");
      this.soundtrack.stopAsync();
      this.setState({isPlaying: false})
    }
    else {
      console.log("sound null")
    }
  };

  _onVolumeSliderValueChange = value => {
    if (this.soundtrack != null) {
      this.soundtrack.setVolumeAsync(value);
    }
  };

  componentDidMount() {
     Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
      this.playSoundtrack();
  }

  var request = require('request');
  _houndifyRequest = () => {
    var houndRequest = {
        ClientID: clientId,
        RequestID: '{request-id-that-matches-headers}',
        DeviceID: '8333687f040f3d88',
        ClientVersion: '1.0',
        RequestID: uuid.v1(),
        SessionID: uuid.v1(),
        TimeZone: 'America/New_York',
        TimeStamp: {timestamp-that-matches-headers},
        Language: 'en_US'
    };

    request({
        url: 'https://api.houndify.com/v1/audio',
        headers: {
            'Hound-Request-Authentication': {clientId},
            'Hound-Client-Authentication': {clientKey},
            'Hound-Request-Info': JSON.stringify(houndRequest).
        },
        json: true
    }, function (err, resp, body) {
        //body will contain the JSON response
        console.log(body);
    });
  }
  render() {

    return (

      <ScrollView style={styles.container}>
         <View style={styles.playStopContainer}>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onPlayPausePressed}
               >
                <Image
                  style={styles.image}
                  source={this.state.isPlaying ? ICON_PAUSE_BUTTON.module : ICON_PLAY_BUTTON.module}
                />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onStopPressed}
                >
                <Image style={styles.image} source={ICON_STOP_BUTTON.module} />
              </TouchableHighlight>
            </View>

      </ScrollView>
    );
  }
}

var uuid = require('node-uuid');
var crypto = require('crypto');

function generateAuthHeaders (clientId, clientKey, userId, requestId) {

    if (!clientId || !clientKey) {
        throw new Error('Must provide a Client ID and a Client Key');
    }
    
    // Generate a unique UserId and RequestId.
    userId = userId || uuid.v1();

    // keep track of this requestId, you will need it for the RequestInfo Object
    requestId = requestId || uuid.v1();

    var requestData = userId + ';' + requestId;

    // keep track of this timestamp, you will need it for the RequestInfo Object
    var timestamp = Math.floor(Date.now() / 1000),  

        unescapeBase64Url = function (key) {
            return key.replace(/-/g, '+').replace(/_/g, '/');
        },

        escapeBase64Url = function (key) {
            return key.replace(/\+/g, '-').replace(/\//g, '_');
        },

        signKey = function (clientKey, message) {
            var key = new Buffer(unescapeBase64Url(clientKey), 'base64');
            var hash = crypto.createHmac('sha256', key).update(message).digest('base64');
            return escapeBase64Url(hash);

        },

        encodedData = signKey(clientKey, requestData + timestamp),
        headers = {
            'Hound-Request-Authentication': requestData,
            'Hound-Client-Authentication': clientId + ';' + timestamp + ';' + encodedData
        };

    return headers;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
