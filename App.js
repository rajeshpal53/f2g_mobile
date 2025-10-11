import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import StackNavigator from "./src/navigators/StackNavigator";
import { UserDataProvider } from "./src/Store/UserDataContext";
import { SnackbarProvider } from "./src/Store/SnackbarContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
export default function App() {
  return (

    <SafeAreaProvider>
      <PaperProvider>
    <SnackbarProvider>
    <UserDataProvider>   
       <NavigationContainer>
      <StackNavigator/>
    </NavigationContainer>
    </UserDataProvider>
    </SnackbarProvider>
    </PaperProvider>
    </SafeAreaProvider>

  );
}
