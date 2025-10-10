import React from 'react';
import { StyleSheet, Text, View, Image, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

// --- Design Constants ---
const ACCENT_BLUE = '#6c63ff'; // Header Underline/Accent
const GRAY_TEXT = '#5c5c5c';   // Body Text Color
const HEADER_BLACK = '#1a1a1a'; // Near-black for main heading
const LIGHT_BACKGROUND = '#fcfcfc'; // Slightly off-white background

// --- Illustration Component (Path is correct for your structure) ---
const IllustrationPlaceholder = () => (
    <View style={styles.illustrationContainer}>
        {/* Path assumes the current file is in src/Screens/BottomScreens */}
        <Image
            source={require('../../../assets/coinpay_illustration.png')} 
            style={styles.illustrationImage}
            resizeMode="contain"
        />
    </View>
);
// ------------------------------------

export default function WelcomeScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BACKGROUND} />
            
            {/* Header: Back Arrow with Blue Accent */}
            <View style={styles.header}>
                {/* <MaterialIcons name="arrow-back-ios" size={24} color="#000" /> */}
                {/* <View style={styles.underline} /> */}
            </View>

            {/* Main Content Area */}
            <View style={styles.contentContainer}>
                
                {/* Illustration */}
                <IllustrationPlaceholder />

                {/* Text Section */}
                <Text style={styles.mainHeading}>
                    Congratulations!{'\n'}
                    Welcome to F2G 🥳
                </Text>
                <Text style={styles.subText}>
                    We are happy to have you.{'\n'} 
                    It's time to **record, reserve, and manage your expenses.**
                </Text>
            </View>

            {/* CONTINUE BUTTON HAS BEEN REMOVED */}
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LIGHT_BACKGROUND,
    },
    header: {
        paddingHorizontal: 20, 
        paddingTop: 15,
        position: 'relative', 
        height: 60, 
    },
    underline: {
        position: 'absolute',
        bottom: 0, 
        left: 0,
        width: '100%',
        height: 4,
        backgroundColor: ACCENT_BLUE, 
        shadowColor: ACCENT_BLUE,
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    contentContainer: {
        // Since the button is removed, we center the content more fully on the screen
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically
        paddingHorizontal: 20,
        // Removed fixed paddingTop to allow justify-content: center to take over
    },
    // --- Illustration Styling ---
    illustrationContainer: {
        width: '100%',
        height: screenHeight * 0.35, 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50, // Increased margin for spacing above text
        marginTop:10,
    },
    illustrationImage: {
        width: '150%',
        height: '150%',
    },
    // --- Text Styling ---
    mainHeading: {
        fontSize: 28, 
        fontWeight: '900', 
        textAlign: 'center',
        color: HEADER_BLACK, 
        lineHeight: 42,
        marginBottom: 25,
        
    },
    subText: {
        fontSize: 16, 
        color: GRAY_TEXT, 
        textAlign: 'center',
        lineHeight: 28, 
        fontWeight: '400',
    },
    
});