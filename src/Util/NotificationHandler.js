// src/notificationService.js
import messaging from '@react-native-firebase/messaging';
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

// Request permission & get FCM token
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await getFcmToken();
    return token;
  } else {
    Alert.alert('Notification Permission Denied');
    return null;
  }
};

// Get FCM token
export const getFcmToken = async () => {
  try {
    const token = await messaging().getToken();
    if (token) {
      await AsyncStorage.setItem('FCMToken', token);
      return token;
    }
  } catch (error) {
    console.log('Error getting FCM token:', error);
  }
};

// Listen to token refresh
export const setupTokenRefreshListener = (setFcmToken) => {
  return messaging().onTokenRefresh(async (token) => {
    setFcmToken(token);
    await AsyncStorage.setItem('FCMToken', token);
  });
};

// Handle foreground messages
export const foregroundHandler = (player) => {
  return messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message:', remoteMessage);
    await incrementValue();
    await storeMessage(remoteMessage);
    if (player) {
      player.seekTo(0);
      player.play();
    }
  });
};

// Handle background messages
export const setupBackgroundHandler = (player) => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background message:', remoteMessage);
    await incrementValue();
    await storeMessage(remoteMessage);
    if (player) {
      player.seekTo(0);
      player.play();
    }
  });
};

// Store incoming messages
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
