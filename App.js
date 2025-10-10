import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavigator from "./src/Navigators/BottomNavigator";
import StackNavigator from "./src/Navigators/StackNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator/>
    </NavigationContainer>
  );
}
