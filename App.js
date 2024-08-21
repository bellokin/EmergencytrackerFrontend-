import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function App() {
  useEffect(() => {
    let shakeCount = 0;
    let lastUpdate = Date.now();

    const monitorShake = () => {
      Accelerometer.setUpdateInterval(200); // More frequent updates

      const subscription = Accelerometer.addListener(async (accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const currentTime = Date.now();
        const timeDiff = currentTime - lastUpdate;

        if (timeDiff > 200) { // Check every 200ms
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          if (magnitude > 1.2) { // Adjusted sensitivity threshold
            shakeCount++;
          } else {
            shakeCount = 0; // Reset if no significant movement
          }
          lastUpdate = currentTime;
        }

        if (shakeCount >= 5) { // Trigger action after 5 shakes
          handleEmergency();
          shakeCount = 0; // Reset shake count
        }
      });

      return subscription;
    };

    const shakeSubscription = monitorShake();

    return () => {
      shakeSubscription.remove();
    };
  }, []);

  const handleEmergency = async () => {
    try {
      const contactsJson = await AsyncStorage.getItem('emergencyContacts');
      const contacts = contactsJson ? JSON.parse(contactsJson) : [];

      const emailList = contacts.map(contact => contact.email);

      const locationData = await AsyncStorage.getItem('locationData');
      const location = locationData ? JSON.parse(locationData) : {};

      const emailRequest = {
        username: 'User',
        emergency_contacts: emailList,
        user_message: `Emergency location data: Latitude ${location.latitude}, Longitude ${location.longitude}, Accuracy ${location.accuracy}`,
      };

      await axios.post('https://emergencytracker-rm8r.onrender.com/mail/send/', emailRequest);
      Alert.alert('Emergency alert sent!');
    } catch (error) {
      console.error('Error handling emergency:', error);
      Alert.alert('Failed to send emergency alert.');
    }
  };

  return <AppNavigator />;
}
