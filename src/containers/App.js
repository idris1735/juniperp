import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from '../pages/login';
import HomeScreen from '../pages/home';
import OdooBackend from '../pages/backend';
import AuthLoadingScreen from '../components/auth';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen
          name="Auth"
          component={SignInScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={OdooBackend}
          headerShown={false}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
