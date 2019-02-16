import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';

global.volume = 100;//better to see current volume
//const math = require('mathjs');
sample = [];
timer = 0;
export default class AccelerometerSensor extends React.Component {
  state = {
    accelerometerData: {},
  }

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  }

  _fast = () => {
    Accelerometer.setUpdateInterval(16);
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
      sample.push(accelerometerData.x + accelerometerData.y + accelerometerData.z);
      if (sample.length >= 20) {
        sample.shift();
      }
      console.log(standardDev(sample));

      if (standardDev(sample) < 0.01) {
        timer++;
        if (timer > 10) {
          timer = 0;
          if (volume > 0) { volume -= 5; }
          else { volume = 0; }
        }
      }

    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  render() {
    let { x, y, z } = this.state.accelerometerData;

    return (
      <View style={styles.sensor}>
        <Text>Accelerometer:</Text>
        <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>
        <Text>volume:{global.volume}</Text>
      </View>
    );
  }
}

function standardDev(values) {
  var avg = average(values);

  var squareDiffs = values.map(function (value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  //console.log(stdDev);
  return stdDev;
}

function average(data) {
  //console.log(data);
  var sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  //console.log(avg);
  return avg;
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});