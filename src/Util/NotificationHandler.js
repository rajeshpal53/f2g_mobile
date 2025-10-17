// src/notificationService.js
// import messaging from '@react-native-firebase/messaging'; // 🔒 Disabled for now
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

const STORAGE_KEY = 'counter_value';

// Increment counter
export const incrementValue = async () => {
  try {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
    const newValue = storedValue ? parseInt(storedValue, 10) + 1 : 1;
    await AsyncStorage.setItem(STORAGE_KEY, newValue.toString());
    return newValue;
  } catch (error) {
    console.error('Error incrementing value:', error);
  }
};

// Get current counter
export const getValue = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error('Error fetching value:', error);
    return 0;
  }
};

// Reset counter
export const resetValue = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, '0');
    return 0;
  } catch (error) {
    console.error('Error resetting value:', error);
  }
};

// Stub for request permission (no Firebase)
export const requestUserPermission = async () => {
  console.log('🔔 Notifications disabled (Firebase messaging not configured).');
  Alert.alert('Notification Info', 'Notifications are currently disabled.');
  return null;
};

// Stub for FCM token
export const getFcmToken = async () => {
  console.log('⚠️ getFcmToken called but Firebase is not active.');
  return null;
};

// Stub for token refresh
export const setupTokenRefreshListener = () => {
  console.log('⚠️ setupTokenRefreshListener skipped (Firebase disabled).');
  return null;
};

// Stub for foreground handler
export const foregroundHandler = async (player) => {
  console.log('⚠️ foregroundHandler disabled (Firebase not active).');
  if (player) {
    player.seekTo?.(0);
    player.play?.();
  }
};

// Stub for background handler
export const setupBackgroundHandler = async (player) => {
  console.log('⚠️ setupBackgroundHandler disabled (Firebase not active).');
  if (player) {
    player.seekTo?.(0);
    player.play?.();
  }
};

// Store incoming messages (local only)
export const storeMessage = async (message) => {
  try {
    const existingMessages = await AsyncStorage.getItem('remoteMessages');
    const messages = existingMessages ? JSON.parse(existingMessages) : [];
    messages.unshift(message);
    await AsyncStorage.setItem('remoteMessages', JSON.stringify(messages));
  } catch (error) {
    console.error('Error storing message:', error);
  }
};
