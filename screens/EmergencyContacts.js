import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_EMERGENCY_URL,API_SEND_URL} from '@env';

export default function EmergencyContacts({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [locationData, setLocationData] = useState(null);

  // Load contacts and location data when the component mounts
  useEffect(() => {
    loadContacts();
    loadLocationData();
  }, []);

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

  const saveContacts = async (newContacts) => {
    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(newContacts));
    } catch (error) {
      console.error('Failed to save contacts:', error);
    }
  };

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

  const handleDeleteContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  const handleEmergency = async () => {
    if (!contacts.length || !locationData) {
      Alert.alert('Please add contacts and ensure location data is available');
      return;
    }

    try {
      console.log("Env val here 2"+API_SEND_URL)
      console.log("Env val here"+API_EMERGENCY_URL)
      const response = await fetch(API_EMERGENCY_URL, {
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token'); // Remove access token
      navigation.navigate('Signup'); // Navigate to Signup screen
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust based on your layout
    >
      <Text style={styles.title}>Emergency Contact List</Text>

      <View style={styles.form}>
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
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddContact}
        >
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

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
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleEmergency}
      >
        <Text style={styles.emergencyButtonText}>Emergency</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  addButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20, // Ensures content isn't hidden behind other elements
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactDetails: {
    flex: 1,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  emergencyButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  emergencyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
