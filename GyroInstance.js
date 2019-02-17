import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';

global.volume = 100;//better to see current volume
//const math = require('mathjs');
sample = [];
timer = 0;
timerA=0;

  let state = {
    accelerometerData: {},
  }


  export const toggle = () => {
    if (_subscription) {
      _unsubscribe();
      console.log("unsubscribe");
    } else {
      _subscribe();
      console.log("subscribe");
    } 
  }

  // _slow = () => {
  //   Accelerometer.setUpdateInterval(1000);
  // }

  // _fast = () => {
  //   Accelerometer.setUpdateInterval(16);
  // }

  export const _subscribe = () => {
    _subscription = Accelerometer.addListener(accelerometerData => {
      //this.setState({ accelerometerData });
      sample.push(accelerometerData.x + accelerometerData.y + accelerometerData.z);
      if (sample.length >= 20) {
        sample.shift();
      }
      console.log(standardDev(sample));
      console.log(global.volume)
      if (standardDev(sample) < 0.01) {
        timer++;
        if (timer > 10) {
          timer = 0;
          if (volume > 0) { volume -= 5; }
          else { volume = 0; }
        }
      }
      
      var d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();

      const end_hour = global.hour; 
      const end_minute = global.minutes; 
      var start_hour = end_hour; 
      var start_minute = end_minute; 
      if (end_minute >= 30) {
        start_minute = end_minute - 30; 
      }
      else {
        start_minute = end_minute + 30; 
        start_hour = end_hour == 0? 23:start_hour-1;
      }

      start_time = start_hour*60 + start_minute;
      curr_time = h*60 + m;
      end_time = end_hour*60 + end_minute
      start_time =  (start_time > end_time) ? start_time-60*24 : start_time;


      if (global.ifAlarm && curr_time > start_time && curr_time < end_time){
        if (standardDev(sample) > 0.01){
          timerA++;
          if (timerA > 10) {
            timerA=0;
            if (volume < 100) { volume += 5; }
            else { volume = 100; }
          }
        }
      }
     

    });
  }

  export const _unsubscribe = () => {
    if (_subscription) {
    _subscription && _subscription.remove();
    _subscription = null;
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
