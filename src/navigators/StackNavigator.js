import {createStackNavigator} from "@react-navigation/stack";
import BottomNavigator from "./BottomNavigator";
import WelcomeScreen from "../Screens/stackscreens/WelcomeScreen";

// Import the EnterNumberScreen so it can be navigated to
import EnterNumberScreen from "../Screens/stackscreens/EnterNumberScreen"; 
import { useTheme } from "../Constants/Theme.js";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext } from "react";
import AdminSectionScreen from "../Screens/stackscreens/AdminSectionScreen.js";

import LoginScreen from "../Screens/stackscreens/LoginScreen.js";


import { Text ,StyleSheet} from "react-native-paper";
import CustomBackButton from "../UI/CustomBackButton.js";
import EditProfileScreen from "../Components/EditProfileScreen.js";
import AllUser from "../Screens/AdminSectionScreen/AllUserScreen.js";
import ReferralForm from "../Screens/stackscreens/ReferScreen.js";
import BookingScreen from "../Screens/stackscreens/BookingScreen.js";
import FeedbackandHelp from "../Screens/stackscreens/FeedbackandHelp.js";
import UserDataContext from "../Store/UserDataContext";
import AllQuerysAndSupport from "../Screens/AdminSectionScreen/QueriesScreens/AllQuerysAndSupport";

export default function StackNavigator() {
    const {colors} = useTheme();
    const {userData}=useContext(UserDataContext)
    const Stack = createStackNavigator();
    return(
        <SafeAreaView edges={['bottom',"top"]} style={{ flex: 1, backgroundColor: colors?.background }}>

        <Stack.Navigator
            initialRouteName= {userData?"Bottom":"welcome"}
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

         <Stack.Screen   name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
          
          }}
        />
         <Stack.Screen   name="ReferralForm"
          component={ReferralForm}
          options={{
    headerTitle: () => (
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins-bold",
          color: colors?.text,
          fontWeight:"bold"
        }}

      >
       Add New Refral
      </Text>
    ),
    headerTitleAlign: "center",
    headerTintColor: "#000", // color of back arrow and title tint
    headerShadowVisible: false, // removes bottom shadow
    // headerLeft: () => <CustomBackButton />, // uncomment if you have one
  }}
        />
         <Stack.Screen   name="BookingScreen"
          component={BookingScreen}
         options={{
    headerTitle: () => (
      <Text
        style={{
         fontFamily: "Poppins-bold",
          color: colors?.text,
          fontWeight:"bold",
          fontSize:18
        }}
      >
       Add New Booking
      </Text>
    ),
    headerTitleAlign: "center",
    headerTintColor: "#000", // color of back arrow and title tint
    headerShadowVisible: false, // removes bottom shadow
    // headerLeft: () => <CustomBackButton />, // uncomment if you have one
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
<Stack.Screen
  name="FeedbackandHelp"
  component={FeedbackandHelp}
  options={{
    // headerShown:false,
    headerTitle: () => (
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          color: "#000",
        }}
      >
        Feedback and Help
      </Text>
    ),
    headerTitleAlign: "center",
    headerTintColor: "#000",
    headerShadowVisible: false,
  }}
/>


 <Stack.Screen
            name="AllUsers"
            component={AllUser}
            options={{
              headerTitle: () => (
                <Text style={styles.headerTitle}>All Users</Text>
              ),

              headerTitleAlign: "center",
              headerLeft: () => <CustomBackButton />,
            }}
          ></Stack.Screen>
          <Stack.Screen
          name="AllQuerysAndSupport"
          component={AllQuerysAndSupport}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>
                All Queries and Support
              </Text>
            ),
            headerShadowVisible: false,

            headerTitleAlign: "center",
          }}
        ></Stack.Screen>
   <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"EditProfilePage"}</Text>
            ),

            headerTitleAlign: "center",



            // headerLeft: () => <CustomBackButton />,
          }}
        />
        </Stack.Navigator>
        </SafeAreaView>
    
    ) 
}

const styles =(colors)=> StyleSheet.create({
  headerTitle: {
    color:colors?.text,
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.headingSmall,
    fontWeight: "bold",

  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
