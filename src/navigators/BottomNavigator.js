import React from "react";
import { View, StyleSheet,Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../Screens/BottomScreens/HomeScreen";
import ProfileScreen from "../Screens/BottomScreens/ProfileScreen";

import ViewReferalScreen from "../Screens/BottomScreens/ViewReferalScreen";
import ViewBookingScreen from "../Screens/BottomScreens/ViewBookingScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../Constants/Theme";

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  const {colors}=useTheme();
  return (
    <SafeAreaView edges={['top',""]} style={{ flex: 1, backgroundColor: colors?.background }}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: "#304FFF", // light blue background
          borderTopWidth: 0,
          elevation: 10,
          paddingBottom: 10,
        textAlign: "bottom",  
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
             let label;
          if (route.name === "Home") {
            iconName = "home";
            label = "Home";
          } else if (route.name === "Profile") {
            iconName = "person";
            label = "Profile";
          } else if (route.name === "Booking") {
            iconName = "calendar";
            label = "Booking";
          } else if (route.name === "Refer") {
            iconName = "send";
            label = "Referral";
          }

          // Active icon with blue circle slightly above the tab
          return (
              <View
                style={[
                  styles.iconWrapper,
                  focused && { backgroundColor: "#fff" },
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={focused ? size + 2 : size}
                  color={focused ? "#304FFF" : "#fff"}
                />
                <Text
                style={[
                  styles.label,
                  { color: focused ? "#304FFF" : "#fff" },
                ]}
              >
                {label}
              </Text>
              </View>
              

          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Refer" component={ViewReferalScreen} />
      <Tab.Screen name="Booking" component={ViewBookingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    top: 9,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // allow moving up
  },
   label: {
    fontSize: 10,
    textAlign: "center",
  },
    iconContainer: {
    alignItems: "center",
    justifyContent: "center",

  },
});