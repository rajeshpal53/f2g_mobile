import {createStackNavigator} from "@react-navigation/stack";

import BottomNavigator from "./BottomNavigator";
import WelcomeScreen from "../Screens/stackscreens/WelcomeScreen";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
export default function StackNavigator() {
    const colors = useTheme().colors;

      const Stack = createStackNavigator();
    return(
          <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors?.background }}>

         <Stack.Navigator
        // initialRouteName={userData ? "Passcode" : "login"}
         initialRouteName={"welcome"}
       screenOptions={{
    headerStyle: {
      backgroundColor: colors?.background, // 🔹 applies to all screens
    },
    headerTintColor: colors?.text, // optional: text/icon color
    headerTitleStyle: {
      fontWeight: "bold", // optional: styling for header title
    },
  }}

      >
         <Stack.Screen
          name="Bottom"
          options={{
            headerShown: false,
            cardStyle: { backgroundColor: "#fff" },
          }}
        >
          {({ navigation }) => (
            <BottomNavigator navigation={navigation} />
          )}
        </Stack.Screen>
        
        <Stack.Screen   name="welcome"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          
          }}
        />
    
        </Stack.Navigator>
        </SafeAreaView>
    
    )   
}