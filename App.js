import React, { useContext, useEffect, useCallback,useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigators/StackNavigator";
import { UserDataProvider } from "./src/Store/UserDataContext";
import UserDataContext from "./src/Store/UserDataContext";
import { SnackbarProvider } from "./src/Store/SnackbarContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { StorageLocationProvider } from "./src/Store/StorageLocationContext";
import {
  storeMessage,
  requestUserPermission,
  setupTokenRefreshListener,
  setupBackgroundHandler,
  foregroundHandler,

} from "./src/Util/NotificationHandler";
import { useAudioPlayer } from 'expo-audio';
import { useTheme } from "./src/Constants/Theme";


SplashScreen.preventAutoHideAsync(); // 👈 Keep splash visible until ready

export default function App() {
  const [fcmToken,setFcmToken]=useState('')
  const {theme}=useTheme();
  const audioSource = require('./assets/notification.mp3');
  const player = useAudioPlayer(audioSource);
  
   useEffect(() => {
    // Request permission and retrieve token on startup
    requestUserPermission();
    // Set up the token refresh listener
    const unsubscribeTokenRefresh = setupTokenRefreshListener(setFcmToken);
    // Clean up the token refresh listener
    return () => unsubscribeTokenRefresh();
  }, []);
  useEffect(() => {
    // Handle background messages
      const remoteMessage=setupBackgroundHandler(player);
      // playNotificationSound();
      console.log('Message handled in the background:', remoteMessage);
  }, []);
  useEffect(() => {
    const unsubscribeForeground = foregroundHandler(storeMessage);
    console.log("unsubscribeForeground", unsubscribeForeground);
    return () => unsubscribeForeground();
  }, []);
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme} >
        <StorageLocationProvider>
                  <SnackbarProvider>
          <UserDataProvider>
            <AppContainer />
          </UserDataProvider>
        </SnackbarProvider>
        </StorageLocationProvider>

      </PaperProvider>
    </SafeAreaProvider>
  );
}

function AppContainer() {
  const { isLoading } = useContext(UserDataContext);

  // Hide splash **only when loading finishes and UI is ready**
  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      onLayoutRootView();
    }
  }, [isLoading]);

  // 👇 Keep native splash visible (render nothing) while loading
  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StackNavigator />
    </NavigationContainer>
  );
}
