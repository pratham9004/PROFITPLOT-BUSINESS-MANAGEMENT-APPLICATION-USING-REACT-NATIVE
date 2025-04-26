import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, List, TextInput, Switch, Text } from 'react-native-paper';

import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';




const ProfileScreen = () => {
  const { user, logout, updateProfile } = useAuth();
  const { updateBusinessDetails, businessDetails, fetchBusinessDetails } = useData();

  const [editMode, setEditMode] = useState(false);
  const [notifications, setNotifications] = useState(true);


  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    companyName: businessDetails?.companyName || '',
    gstNumber: businessDetails?.gstNumber || '',
    address: businessDetails?.address || '',
  });

  useEffect(() => {
    if (user?.uid) {
      fetchBusinessDetails(user.uid);
    }
  }, [user?.uid]);

  useEffect(() => {
    setFormData({
      displayName: user?.displayName || '',
      companyName: businessDetails?.companyName || '',
      gstNumber: businessDetails?.gstNumber || '',
      address: businessDetails?.address || '',
    });
  }, [user, businessDetails]);


  const handleUpdateProfile = async () => {
    try {
      if (formData.displayName) {
        await updateProfile({
          displayName: formData.displayName,
        });
      }

      if (formData.companyName || formData.gstNumber || formData.address) {
        await updateBusinessDetails(user.uid, {
          companyName: formData.companyName,
          gstNumber: formData.gstNumber,
          address: formData.address,
        });
      }


      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };




  return (
    <ScrollView style={styles.container}>


      {editMode ? (
        <>
          <TextInput
            label="Full Name"
            value={formData.displayName}
            onChangeText={(text) => setFormData({ ...formData, displayName: text })}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Email"
            value={user?.email}
            disabled
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Company Name"
            value={formData.companyName}
            onChangeText={(text) => setFormData({ ...formData, companyName: text })}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="GST Number"
            value={formData.gstNumber}
            onChangeText={(text) => setFormData({ ...formData, gstNumber: text })}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />
          <Button
            mode="contained"
            onPress={handleUpdateProfile}
            style={styles.button}
          >
            Save Changes
          </Button>
          <Button
            mode="outlined"
            onPress={() => setEditMode(false)}
            style={styles.button}
            labelStyle={{ color: 'white' }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <List.Section>
            <List.Subheader>Personal Information</List.Subheader>
            <List.Item
              title="Name"
              description={user?.displayName || 'Not set'}
              left={() => <List.Icon icon="account" />}
            />
            <List.Item
              title="Email"
              description={user?.email}
              left={() => <List.Icon icon="email" />}
            />
          </List.Section>

          <List.Section>
            <List.Subheader>Business Information</List.Subheader>
            <List.Item
              title="Company Name"
              description={businessDetails?.companyName || 'Not set'}
              left={() => <List.Icon icon="office-building" />}
            />
            <List.Item
              title="GST Number"
              description={businessDetails?.gstNumber || 'Not set'}
              left={() => <List.Icon icon="card-account-details" />}
            />
            <List.Item
              title="Address"
              description={businessDetails?.address || 'Not set'}
              left={() => <List.Icon icon="map-marker" />}
            />
          </List.Section>

          <List.Section>
            <List.Subheader>Preferences</List.Subheader>
            <List.Item
              title="Notifications"
              left={() => <List.Icon icon="bell" />}
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={() => setNotifications(!notifications)}
                />
              )}
            />
          </List.Section>

          <Button
            mode="contained"
            onPress={() => setEditMode(true)}
            style={styles.button}
          >
            Edit Profile
          </Button>
          <Button
            mode="contained"
            onPress={logout}
            style={[styles.button, styles.logoutButton]}
            labelStyle={{ color: 'white' }}
          >
            Logout
          </Button>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFDE7',
  },

  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  button: {
    marginVertical: 8,
    backgroundColor: '#2E7D32',
  },
  logoutButton: {
    backgroundColor: '#B00020',
    marginBottom: 20,
  },
});

export default ProfileScreen;
