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
    selectedMinutes: 0,
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

  generateAlarmTimeText(){

    const end_hour = this.state.selectedHours; 
    const end_minute = this.state.selectedMinutes; 
    var start_hour = end_hour; 
    var start_minute = end_minute; 
    if (end_minute >= 30) {
      start_minute = end_minute - 30; 
    }
    else {
      start_minute = end_minute + 30; 
      start_hour = end_hour == 0? 23:start_hour-1;
    }
    var start_hour_str = start_hour < 10 ? '0' + start_hour: start_hour;
    var start_min_str = start_minute < 10 ? '0' + start_minute: start_minute;
    var end_hour_str = end_hour < 10 ? '0' + end_hour: end_hour;
    var end_minute_str = end_minute < 10 ? '0' + end_minute: end_minute;

    return (<Text style = {styles.wakentext}> You will be waken up between {start_hour_str} : {start_min_str} and {end_hour_str}:{end_minute_str} </Text>)
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

        {this.generateAlarmTimeText()}
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
    wakentext: {
      padding: 10
    }
});
