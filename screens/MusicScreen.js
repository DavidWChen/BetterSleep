import React from 'react';
import { ScrollView, Text, View, StyleSheet, Button, TouchableHighlight, Image } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Constants, FileSystem, Video, Audio, Asset, Permissions } from 'expo';

import { _subscribe } from '../GyroInstance';



class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_RECORD_BUTTON = new Icon(require('../assets/images/record_button.png'), 70, 119);
const ICON_RECORDING = new Icon(require('../assets/images/record_icon.png'), 20, 14);

const ICON_PLAY_BUTTON = new Icon(require('../assets/images/play_button.png'), 34, 51);
const ICON_PAUSE_BUTTON = new Icon(require('../assets/images/pause_button.png'), 34, 51);
const ICON_STOP_BUTTON = new Icon(require('../assets/images/stop_button.png'), 22, 22);
const BACKGROUND_COLOR = '#FFF8ED';

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.soundtrack = null;
    this.state = {
      volume: 1.0,
      isPlaying: false,
      isRecording: false,
      haveRecordingPermissions: false,
      isLoading: false,
    }
    this.recordingSettings = {
       android: {
        extension: '.mp3',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEGLAYER3,
        // sampleRate: 16000,
        // numberOfChannels: 1,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_LOW,
        outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
        sampleRate: 16000,
        numberOfChannels: 1,
        //sampleRate: 16000,
        //numberOfChannels: 1,
        bitRate: 128000,
        bitRateStrategy: Audio.RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_CONSTANT,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
    }
  };
  static navigationOptions = {
    title: 'Music',
  };

  playSoundtrack = async () => {
    this.soundtrack = new Audio.Sound();
    try {
      await this.soundtrack.loadAsync(require('../assets/music/TakeMe.mp3'), { isPlaying: false }, true)
      await this.soundtrack.setIsMutedAsync(false);
      await this.soundtrack.setVolumeAsync(0.5);
      //await soundtrack.playAsync();
    } catch (err) {
      alert(err.message)
    }
  };

  _onPlayPausePressed = () => {
    if (this.soundtrack != null) {
      console.log("soundtrack is NOT null");
      if (this.state.isPlaying) {
        this.soundtrack.pauseAsync();
        this.setState({ isPlaying: false })
      } else {
        this.soundtrack.playAsync();
        this.setState({ isPlaying: true })
      }
    }
    else {
      console.log("soundtrack is null");
    }
  };

  _onStopPressed = () => {
    if (this.soundtrack != null) {
      console.log("stop sound");
      this.soundtrack.stopAsync();
      this.setState({ isPlaying: false })
    }
    else {
      console.log("sound null")
    }
  };

  _onVolumeSliderValueChange = () => {
    if (this.soundtrack != null) {
      this.setState({
        volume: (global.volume / 100)
      })

      this.soundtrack.setVolumeAsync(this.state.volume);
    }
  };

  _onRecordPressed = () => {
    console.log ("pressed record");
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
      console.log ("its recording");
    } else {
      this._stopPlaybackAndBeginRecording();
      console.log ("its not recording");
    }
  };

  _updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  async _stopPlaybackAndBeginRecording() {
    console.log ("in _stopPlaybackAndBeginRecording");
    this.setState({
      isLoading: true,
    });
  
    // if (this.recording !== null) {
    //   this.recording.setOnRecordingStatusUpdate(null);
    //   this.recording = null;
    // }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  }
  async _sendAudioAsync(uri) {
    // CHNAGE THIS !!!!
    let apiUrl = 'http://10.19.189.116:3000';
    // 

    // Note:
    // Uncomment this if you want to experiment with local server
    //
    // if (Constants.isDevice) {
    //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
    // } else {
    //   apiUrl = `http://localhost:3000/upload`
    // }

    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    console.log({ uri })
    let formData = new FormData();
    formData.append('file', {
      uri,
      name: `recording.${fileType}`,
      type: `audio/${fileType}`,
    }, `recording.${fileType}`);

    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    console.log("fetching result");
    //console.log({options})
    return fetch(apiUrl, options);
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    console.log ("finsihed recording")
    console.log(`FILE INFO:`,info);
    // const { sound, status } = await this.recording.createNewLoadedSound(
    //   {
    //     isLooping: true,
    //     isMuted: this.state.muted,
    //     volume: this.state.volume,
    //     rate: this.state.rate,
    //     shouldCorrectPitch: this.state.shouldCorrectPitch,
    //   },
    //   this._updateScreenForSoundStatus
    // );
    let sendresult;
    try {
      sendresult = await this._sendAudioAsync(info.uri);
      console.log( sendresult["_bodyText"], 'start_app', sendresult["_bodyText"] === 'start_app');
      console.log(typeof "start_app");
      // console.lof"start_app"
      if (sendresult["_bodyText"] === '"start_app"') {
        console.log("starting");
        _subscribe();
        this._onPlayPausePressed(); 
      }
  } catch({ message }) {
    console.log({ message });
  } finally {
    
    this.setState({
      isLoading: false,
    });
  }
    
  }



  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    });

    setInterval(() => this._onVolumeSliderValueChange(), 500);
    this.playSoundtrack();
    this._askForPermissions();
  }

    _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === 'granted',
    });
  };


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

        <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={this._onRecordPressed}
              disabled={this.state.isLoading}>
              <Image style={styles.image} source={ICON_RECORD_BUTTON.module} />
        </TouchableHighlight>
        <View style={styles.recordingDataContainer}>
              <View />
              <Text >
                {this.state.isRecording ? 'LIVE' : ''}
              </Text>
              <View >
                <Image
                  style={[styles.image, { opacity: this.state.isRecording ? 1.0 : 0.0 }]}
                  source={ICON_RECORDING.module}
                />
              </View>
              <View />
          </View>
      </ScrollView>
    );
  }




}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
    image: {
    backgroundColor: BACKGROUND_COLOR,
  },
});
