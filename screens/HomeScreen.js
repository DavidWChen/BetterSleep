import React from 'react';
import {
  Image,
  Platform,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { WebBrowser, Font } from 'expo';

import { MonoText } from '../components/StyledText';
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _startListening = () => {
    global.volume = 100;
    this.props.navigation.push('Music');
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.sleepIconContainer}>
            <Image source={require('../assets/images/sleepIcon.png')} style={styles.sleepIcon}>

            </Image>
            <Text style={styles.BetterSleepTitle}>Turn Down</Text>
            <Text style={styles.BetterSleepTitleBottom}>For What?</Text>
            <Text style={styles.BetterSleepDescription}>Better Sleep ...</Text>
          </View>
          <View style={styles.activateButtonContainer} >

            <TouchableOpacity
              style={styles.activateButton}
              onPress={this._startListening}
            >
              <Text style={styles.activateButtonText}>Play Music</Text>
            </TouchableOpacity>
          </View>


        </ScrollView>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000025',
  },
  sleepIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sleepIcon: {
    flex: 1,
    marginTop: 30,
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  BetterSleepTitle: {
    marginTop: 20,
    fontSize: 50,
    color: '#ffe0da',
    fontFamily: 'coiny',
  },
  BetterSleepTitleBottom: {
    fontSize: 50,
    color: '#ffe0da',
    fontFamily: 'coiny',
    marginBottom: 20,
  },
  BetterSleepDescription: {
    marginTop: 30,
    fontSize: 25,
    color: '#fff',
    marginLeft: '10%',
    marginRight: '10%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Baskerville',
    lineHeight: 30
  },
  contentContainer: {
    paddingTop: 30,
  },
  activateButtonContainer: {
    marginTop: 30,
    marginBottom: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activateButton: {
    padding: 10,
    paddingTop: 25,
    borderRadius: 20,
    textAlign: 'center',
    resizeMode: 'contain',
    backgroundColor: '#ffa447',
  },
  activateButtonText: {
    fontFamily: 'coiny',
    fontSize: 30,
  }


});
