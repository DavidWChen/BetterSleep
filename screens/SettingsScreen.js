import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
//import all the components we are going to use.
import TimePicker from 'react-native-simple-time-picker';
//import TimePicker from the package we installed
global.hour = 0; 
global.minutes = 0; 

export default class App extends Component {
  state = {
    selectedHours: 0,
    //initial Hours
    selectedHours: 0,
    //initial Minutes
    ifNewTime : false
  };

  setTime = () => {
    this.setState({ifNewTime: false})
    global.hour = this.state.selectedHours;
    global.minutes = this.state.selectedMinutes;
    alert("your time is set to be")
  }

  render() {
    const { selectedHours, selectedMinutes } = this.state;
    return (
      <View style={styles.container}>
        <Text> When do you want to wake up? </Text>
        <TimePicker
          selectedHours={selectedHours}
          //initial Hourse value
          selectedMinutes={selectedMinutes}
          //initial Minutes value
          onChange={(hours, minutes) => {
            this.setState({ selectedHours: hours, selectedMinutes: minutes, ifNewTime: true })
            console.log (selectedHours);}
          }
        />
        <TouchableOpacity 
          style={[styles.button, { opacity: this.state.ifNewTime ? 1.0 : 0.4 }]}
          onPress = {this.setTime}
          disabled = {!this.state.ifNewTime}

        >
        <Text> Set Alarm </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginLeft: 125,
    marginRight: 125,
    alignItems: 'center',
    justifyContent: 'center',
  },
    button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
});
