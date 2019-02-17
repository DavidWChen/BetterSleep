import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Audio, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';


global.musicThings = {};

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    
    const objectsToLoad = {
      'songA': require('./assets/music/TakeMe.mp3')
    }
    
    for (const key of Object.keys(objectsToLoad)) {
      const resource = objectsToLoad[key];
      await Asset.fromModule(resource).downloadAsync();
      const {sound} = await Audio.Sound.createAsync(resource, { volume: 1 });

      musicThings[key] = sound;
    
      // await musicThings[key].loadAsync(resource, {});
      // musicThings[key].setVolumeAsync(1)
    }

    return Promise.all([
      ,
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'coiny': require('./assets/fonts/Coiny-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
