import React from 'react';
import { ScrollView, Text, View, StyleSheet, Button, TouchableHighlight, Image } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Constants, Video, Audio, Asset } from 'expo';


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

  playSoundtrack = async () => {
    this.soundtrack = new Audio.Sound();
    try {
      await this.soundtrack.loadAsync(require('../assets/music/TakeMe.mp3'), { isPlaying: false }, true)
      await this.soundtrack.setIsMutedAsync(false);
      await this.soundtrack.setVolumeAsync(0.5);
      //await soundtrack.playAsync();
    } catch (err) {
      console.log(err);
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

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });

    setInterval(() => this._onVolumeSliderValueChange(), 500);
    this.playSoundtrack();
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
