import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  phone: string;
  profileImage: string | null;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    profileImage: null,
  });

  const [isEditing, setIsEditing] = useState(true);

  // Test function for debugging permissions
  const testPermissions = async () => {
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    console.log('Media:', mediaStatus.status, 'Camera:', cameraStatus.status);
    Alert.alert('Permissions', `Media: ${mediaStatus.status}, Camera: ${cameraStatus.status}`);
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      console.log('Media Library Permission Status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please go to Settings and enable photo library access for this app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => console.log('Open app settings') }
          ]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Image Picker Result:', result);

      if (!result.canceled && result.assets[0]) {
        setProfile(prev => ({
          ...prev,
          profileImage: result.assets[0].uri
        }));
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      console.log('Camera Permission Status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please go to Settings and enable camera access for this app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => console.log('Open app settings') }
          ]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Camera Result:', result);

      if (!result.canceled && result.assets[0]) {
        setProfile(prev => ({
          ...prev,
          profileImage: result.assets[0].uri
        }));
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose how you want to set your profile picture',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const saveProfile = () => {
    if (!profile.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    if (!profile.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    setIsEditing(false);
    Alert.alert('Success', 'Profile saved successfully!');
  };

  const updateField = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderProfileImage = () => (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={showImageOptions} style={styles.imageWrapper}>
        {profile.profileImage ? (
          <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={60} color="#ccc" />
          </View>
        )}
        <View style={styles.cameraIcon}>
          <Ionicons name="camera" size={20} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderInputField = (
    label: string,
    field: keyof UserProfile,
    placeholder: string,
    multiline: boolean = false,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default'
  ) => (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {isEditing ? (
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          placeholder={placeholder}
          value={profile[field] as string}
          onChangeText={(text) => updateField(field, text)}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        />
      ) : (
        <ThemedView style={[styles.displayField, multiline && styles.multilineDisplay]}>
          <Text style={styles.displayText}>
            {(profile[field] as string) || 'Not provided'}
          </Text>
        </ThemedView>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              {isEditing ? 'Edit Profile' : 'My Profile'}
            </ThemedText>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons 
                name={isEditing ? "close" : "pencil"} 
                size={20} 
                color="#007AFF" 
              />
            </TouchableOpacity>
          </View>

          {/* Profile Image */}
          {renderProfileImage()}

          {/* Form Fields */}
          <View style={styles.form}>
            {renderInputField('Full Name *', 'name', 'Enter your full name')}
            {renderInputField('Email *', 'email', 'Enter your email', false, 'email-address')}
            {renderInputField('Phone', 'phone', 'Enter your phone number', false, 'phone-pad')}
            {renderInputField('Location', 'location', 'Enter your location')}
            {renderInputField('Bio', 'bio', 'Tell us about yourself...', true)}
          </View>

          {/* Test Permissions Button - Remove this after testing */}
          {isEditing && (
            <TouchableOpacity style={styles.testButton} onPress={testPermissions}>
              <Text style={styles.testButtonText}>Test Permissions</Text>
            </TouchableOpacity>
          )}

          {/* Save Button */}
          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          )}

          {/* Profile Stats */}
          {!isEditing && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>12</ThemedText>
                <ThemedText style={styles.statLabel}>Todos Created</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>8</ThemedText>
                <ThemedText style={styles.statLabel}>Completed</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>4</ThemedText>
                <ThemedText style={styles.statLabel}>Pending</ThemedText>
              </View>
            </View>
          )}
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#007AFF',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    borderWidth: 4,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  displayField: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  multilineDisplay: {
    minHeight: 80,
  },
  displayText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 30,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  testButton: {
    backgroundColor: '#FF9500',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});