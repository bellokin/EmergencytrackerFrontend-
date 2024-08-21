import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import Main from '../screens/Main';
import EmergencyContacts from '../screens/EmergencyContacts';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Gps" component={Main} />
        <Stack.Screen name="EmergencyContacts" component={EmergencyContacts} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
