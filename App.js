import React, { useContext, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigators/StackNavigator";
import { UserDataProvider } from "./src/Store/UserDataContext";
import UserDataContext from "./src/Store/UserDataContext";
import { SnackbarProvider } from "./src/Store/SnackbarContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync(); // 👈 Keep splash visible until ready

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SnackbarProvider>
          <UserDataProvider>
            <AppContainer />
          </UserDataProvider>
        </SnackbarProvider>
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
