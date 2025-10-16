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
import BookingDetailsScreen from "../Screens/stackscreens/BookingDetailScreen";
import ViewBookingScreen from "../Screens/BottomScreens/ViewBookingScreen";
import ReferralDetailScreen from "../Screens/stackscreens/ReferralDetailScreen";
import ViewReferralScreen from "../Screens/BottomScreens/ViewReferalScreen";
export default function StackNavigator() {
    const {colors} = useTheme();
    const {userData}=useContext(UserDataContext)
    const Stack = createStackNavigator();
    return(
        <SafeAreaView edges={['bottom',""]} style={{ flex: 1, backgroundColor: colors?.background }}>

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
    headerTitleAlign: "center",
    headerTintColor: colors?.text, // color of back arrow and title tint
    headerShadowVisible: false, // removes bottom shadow
    // headerLeft: () => <CustomBackButton />, // uncomment if you have one
  }}
        />
         <Stack.Screen   name="BookingScreen"
          component={BookingScreen}
         options={{
   
    headerTitleAlign: "center",
    headerTintColor: colors?.text, // color of back arrow and title tint
    headerShadowVisible: false, // removes bottom shadow
    // headerLeft: () => <CustomBackButton />, // uncomment if you have one
  }}
        />
         
        <Stack.Screen
        name="adminViewBooking"
        component={ViewBookingScreen}
        options={{
    headerTitle: () => (
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          color: colors?.text,
          fontWeight:"bold"
        }}
      > All Bookings </Text>
    ),
    headerTitleAlign: "center",
    headerTintColor: colors?.text, // color of back arrow and title tint
    headerShadowVisible: false, // removes bottom shadow
    // headerLeft: () => <CustomBackButton />, // uncomment if you have one
  }}
        
        />
          <Stack.Screen
        name="adminViewReferral"
        component={ViewReferralScreen}
        options={{
    headerTitle: () => (
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          color: colors?.text,
          fontWeight:"bold"
        }}
      > All Referrals </Text>
    ),
    headerTitleAlign: "center",
    headerTintColor: colors?.text, // color of back arrow and title tint
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
          color: colors?.text,
        }}
      >
        Admin Section
      </Text>
    ),
    headerTitleAlign: "center",
    headerTintColor: colors?.text, // color of back arrow and title tint
    headerShadowVisible: false, // removes bottom shadow
    // headerLeft: () => <CustomBackButton />, // uncomment if you have one
  }}
/>
 <Stack.Screen   name="ReferralDetailScreen"
          component={ReferralDetailScreen}
          options={{
    headerTitle: () => (
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          color: colors?.text,
          fontWeight: "bold"
        }}
      >
       Referral  Details Screen
      </Text>
    ),
   
    headerTitleAlign: "center",
    headerTintColor: colors?.text, // color of back arrow and title tint
    headerShadowVisible: false, // removes bottom shadow
    // headerLeft: () => <CustomBackButton />, // uncomment if you have one
  }}
        />



 <Stack.Screen
  name="BookingDetailsScreen"
  component={BookingDetailsScreen}
  options={{
    headerTitle: () => (
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          color: colors?.text,
          fontWeight: "bold"
        }}
      >
       Booking Details Screen
      </Text>
    ),
   
    headerTitleAlign: "center",
    headerTintColor: colors?.text, // color of back arrow and title tint
    headerShadowVisible: false, // removes bottom shadow
    // headerLeft: () => <CustomBackButton />, // uncomment if you have one
  }}
/>
<Stack.Screen
  name="FeedbackandHelp"
  component={FeedbackandHelp}
  options={{
    headerShown:false,
    headerTitle: () => (
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          color: colors?.text,
        }}
      >
        Feedback and Help
      </Text>
    ),
    headerTitleAlign: "center",
    headerTintColor: colors?.text,
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
