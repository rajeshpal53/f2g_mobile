import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavigator from "./src/navigators/BottomNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <BottomNavigator />
    </NavigationContainer>
  );
}
