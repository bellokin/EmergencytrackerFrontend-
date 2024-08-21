import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmergencyContacts({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [locationData, setLocationData] = useState(null);

  // Function to load contacts from AsyncStorage
  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem('emergencyContacts');
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  // Function to load location data from AsyncStorage
  const loadLocationData = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem('locationData');
      if (storedLocation) {
        setLocationData(JSON.parse(storedLocation));
      }
    } catch (error) {
      console.error('Failed to load location data:', error);
    }
  };

  // Function to save contacts to AsyncStorage
  const saveContacts = async (newContacts) => {
    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(newContacts));
    } catch (error) {
      console.error('Failed to save contacts:', error);
    }
  };

  // Function to handle adding a new contact
  const handleAddContact = () => {
    if (!name || !email || !phoneNumber) {
      Alert.alert('Please fill in all fields');
      return;
    }

    const newContact = { name, email, phoneNumber };
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveContacts(updatedContacts);

    // Clear input fields
    setName('');
    setEmail('');
    setPhoneNumber('');
  };

  // Function to handle deleting a contact
  const handleDeleteContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  // Function to handle sending an emergency email
  const handleEmergency = async () => {
    if (!contacts.length || !locationData) {
      Alert.alert('Please add contacts and ensure location data is available');
      return;
    }

    try {
      const response = await fetch('https://emergencytracker-rm8r.onrender.com/mail/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: `TEST-USER`,
          emergency_contacts: contacts.map(contact => contact.email),
          user_message: `Location: Latitude ${locationData.latitude}, Longitude ${locationData.longitude}`,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Emergency email sent successfully');
      } else {
        Alert.alert('Failed to send emergency email', result.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error sending emergency email:', error);
      Alert.alert('Error', 'Failed to send emergency email');
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token'); // Remove access token
      navigation.navigate('Signup'); // Navigate to Signup screen
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Load contacts and location data when the component mounts
  useEffect(() => {
    loadContacts();
    loadLocationData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Contact List</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      
      <Button title="Add Contact" onPress={handleAddContact} />
      
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.contactItem}>
            <View style={styles.contactDetails}>
              <Text style={styles.contactText}>{item.name}</Text>
              <Text style={styles.contactText}>{item.email}</Text>
              <Text style={styles.contactText}>{item.phoneNumber}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteContact(index)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleEmergency}
      >
        <Text style={styles.emergencyButtonText}>Emergency</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  contactDetails: {
    flex: 1,
  },
  contactText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  emergencyButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 18,
  },
  
  logoutButton: {
  backgroundColor: '#1E90FF', // A more subtle blue shade
  paddingVertical: 12,        // Slightly less padding for a more modern look
  paddingHorizontal: 20,      // Add horizontal padding to make the button wider
  marginTop: 20,
  borderRadius: 8,            // Increase border radius for a smoother, rounder edge
  alignItems: 'center',
  justifyContent: 'center',   // Center content vertically if needed
  shadowColor: '#000',        // Add subtle shadow for depth
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,               // Elevation for Android shadow
},

  logoutButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
