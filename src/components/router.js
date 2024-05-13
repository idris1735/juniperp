// import React from 'react';
// import {createStackNavigator} from '@react-navigation/stack';

// import SignInScreen from '../pages/login';
// import HomeScreen from '../pages/home';
// import OdooBackend from '../pages/backend';
// import AuthLoadingScreen from './auth';

// const Stack = createStackNavigator();

// function AuthStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="SignIn" component={SignInScreen} />
//     </Stack.Navigator>
//   );
// }

// function AppStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Other" component={OdooBackend} />
//     </Stack.Navigator>
//   );
// }

// export const AppNavigator = () => {
//   return (
//     <Stack.Navigator initialRouteName="AuthLoading">
//       <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
//       <Stack.Screen name="App" component={AppStack} />
//       <Stack.Screen name="Auth" component={AuthStack} />
//     </Stack.Navigator>
//   );
// };
