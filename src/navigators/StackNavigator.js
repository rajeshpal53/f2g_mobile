import {createStackNavigator} from "@react-navigation/stack";
import BottomNavigator from "./BottomNavigator";
import WelcomeScreen from "../Screens/stackscreens/WelcomeScreen";
// Import the EnterNumberScreen so it can be navigated to
import EnterNumberScreen from "../Screens/stackscreens/EnterNumberScreen"; 
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

export default function StackNavigator() {
    const colors = useTheme().colors;

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
        
        </Stack.Navigator>
        </SafeAreaView>
    
    ) 
}
