import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import {MainStack, HomeStack}from './MainTabNavigator';

export default createAppContainer(createSwitchNavigator(
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  {
  Home: HomeStack,
  Main: MainStack,
},
  {
    initialRouteName: 'Home',
  }
));


//export default createAppContainer(MainStack);
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
