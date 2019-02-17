import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { FontAwesome, Feather, MaterialIcons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import MusicScreen from '../screens/MusicScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GyroScreen from '../screens/GyroScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

export const HomeStack = createStackNavigator({
  Home: HomeScreen,
  // Music: MusicScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <Feather name={"home"} size={30} color="black" />
  ),
};

const MusicStack = createStackNavigator({
  Music: MusicScreen,
});

MusicStack.navigationOptions = {
  tabBarLabel: 'Music',
  tabBarIcon: ({ focused }) => (
    <Feather name={"music"} size={30} color="black" />
  ),
};

const GyroStack = createStackNavigator({
  Links: GyroScreen,
});

GyroStack.navigationOptions = {
  tabBarLabel: 'Gyro',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Alarm',
  tabBarIcon: ({ focused }) => (
    <Ionicons name={"md-alarm"} size={30} color="black" />
  ),
};


export const MainStack = createBottomTabNavigator({
  MusicStack,
  HomeStack,
  SettingsStack,
});

