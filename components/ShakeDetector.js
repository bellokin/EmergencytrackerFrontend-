import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ShakeDetector = () => {
  const [shakeCount, setShakeCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    Accelerometer.setUpdateInterval(1000);

    const subscription = Accelerometer.addListener(async (accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastUpdate;

      if (timeDiff > 1000) {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        if (magnitude > 1.5) { // Adjust the threshold as needed
          setShakeCount(count => count + 1);
        }
        setLastUpdate(currentTime);
      }

      if (shakeCount >= 5) { // Trigger action after 5 shakes
        handleEmergency();
        setShakeCount(0); // Reset shake count
      }
    });

    return () => {
      subscription.remove();
    };
  }, [shakeCount]);

  const handleEmergency = async () => {
    try {
      const contactsJson = await AsyncStorage.getItem('emergencyContacts');
      const contacts = contactsJson ? JSON.parse(contactsJson) : [];

      const emailList = contacts.map(contact => contact.email);

      const locationData = await AsyncStorage.getItem('locationData');
      const location = locationData ? JSON.parse(locationData) : {};

      const emailRequest = {
        username: 'User', // Replace with actual username if needed
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

  return null;
};

export default ShakeDetector;
