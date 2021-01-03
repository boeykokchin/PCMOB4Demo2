import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LognScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal">
        <Stack.Screen component={ChatScreen} name="Chat" />
        <Stack.Screen component={LoginScreen} name="Login" options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
