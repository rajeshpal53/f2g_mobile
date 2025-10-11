import {createStackNavigator} from "@react-navigation/stack";

import BottomNavigator from "./BottomNavigator";
import WelcomeScreen from "../Screens/stackscreens/WelcomeScreen";
import { useTheme } from "../Constants/Theme.js";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import AdminSectionScreen from "../Screens/stackscreens/AdminSectionScreen.js";
import { Text } from "react-native-paper";
export default function StackNavigator() {
    const {colors} = useTheme();

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
        <Stack.Screen
  name="AdminSection"
  component={AdminSectionScreen}
  options={{
    headerTitle: () => (
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          color: "#000",
        }}
      >
        Admin Section
      </Text>
    ),
    headerTitleAlign: "center",
    headerTintColor: "#000", // color of back arrow and title tint
    headerShadowVisible: false, // removes bottom shadow
    // headerLeft: () => <CustomBackButton />, // uncomment if you have one
  }}
/>
        </Stack.Navigator>
        </SafeAreaView>
    
    )   
}