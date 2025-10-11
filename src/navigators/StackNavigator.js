import {createStackNavigator} from "@react-navigation/stack";
import BottomNavigator from "./BottomNavigator";
import WelcomeScreen from "../Screens/stackscreens/WelcomeScreen";

// Import the EnterNumberScreen so it can be navigated to
import EnterNumberScreen from "../Screens/stackscreens/EnterNumberScreen"; 
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
            initialRouteName={"welcome"}
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors?.background,
                },
                headerTintColor: colors?.text,
                headerTitleStyle: {
                    fontWeight: "bold",
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
            
            <Stack.Screen 
                name="welcome"
                component={WelcomeScreen}
                options={{
                    headerShown: false,
                }}
            />
            
            {/* 💡 FIX: Registering the destination screen for the Sign up button */}
            <Stack.Screen 
                name="EnterNumberScreen" 
                component={EnterNumberScreen}
                options={{
                    headerShown: false,
                }}
            />
        
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
