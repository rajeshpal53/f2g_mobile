import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

// --- Design Constants ---
const PRIMARY_BLUE = '#4e54f9';      // Main Button Color
const ACCENT_BLUE = '#6c63ff';      // Link/Accent Blue
const GRAY_TEXT = '#5c5c5c';         // Body Text Color
const HEADER_BLACK = '#1a1a1a';      // Main Heading Color
const LIGHT_BACKGROUND = '#fcfcfc';  // Primary background
const SOFT_GRAY_BG = '#f5f5f5';      // Used for the subtle background tint

// --- Illustration Component ---
const IllustrationPlaceholder = () => (
    <View style={styles.illustrationContainer}>
        {/* Path for the credit card/coin illustration */}
        {/* Ensure this path is correct for your project structure */}
        <Image
            source={require('../../../assets/coinpay_credit_cards.png')} 
            style={styles.illustrationImage}
            resizeMode="contain"
        />
    </View>
);
// ------------------------------------

export default function WelcomeScreen({ navigation }) {
    
    const handleSignUp = () => {
        // Correct navigation to start the sign-up flow
        console.log("Navigating to EnterNumberScreen for Sign Up...");
        navigation.navigate("EnterNumberScreen");
    };

    const handleLogIn = () => {
        // Correct navigation to the Home screen inside the Bottom tab navigator
        console.log("Navigating to Home Screen for Log In...");
        navigation.navigate("Bottom", { screen: "Home" });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BACKGROUND} />
            
            {/* Soft Gray Background Layer */}
            <View style={styles.softBackgroundLayer} />
            
            {/* Header: Back Arrow */}
            <View style={styles.header}>
                {/* Assuming this back button navigates back in the stack, e.g., to an initial splash screen */}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Main Content Area */}
            <View style={styles.contentContainer}>
                
                {/* Illustration */}
                <IllustrationPlaceholder />

                {/* Text Section (FIXED ALIGNMENT) */}
                <Text style={[styles.mainHeading, {marginBottom: 0}]}>
                    Create your
                </Text>
                
                {/* 💡 FIX: Container for the second line and icon */}
                <View style={styles.iconTitleRow}>
                    <Text style={styles.mainHeadingText}>
                        F2G account
                    </Text>
                    <FontAwesome5 
                        name="medal" 
                        size={28} 
                        color={PRIMARY_BLUE} 
                        style={styles.titleIcon} 
                    />
                </View>
                
                <Text style={styles.subText}>
                    F2G is a powerful tool that allows you to easily 
                    send, receive, and track all your transactions.
                </Text>
            </View>

            {/* Button Container */}
            <View style={styles.buttonWrapper}>
                {/* Sign Up Button (Primary) -> NAVIGATES TO EnterNumberScreen */}
                <TouchableOpacity 
                    style={[styles.actionButton, styles.primaryButton]}
                    activeOpacity={0.8}
                    onPress={handleSignUp} 
                >
                    <Text style={styles.primaryButtonText}>Sign up</Text>
                </TouchableOpacity>

                {/* Log In Button (Secondary/Outline) -> NAVIGATES TO HOME SCREEN */}
                <TouchableOpacity 
                    style={[styles.actionButton, styles.secondaryButton]}
                    activeOpacity={0.8}
                    onPress={handleLogIn} 
                >
                    <Text style={styles.secondaryButtonText}>Log in</Text>
                </TouchableOpacity>

                {/* Terms and Privacy Links */}
                <Text style={styles.termsText}>
                    By continuing you accept our{' '}
                    <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
            </View>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LIGHT_BACKGROUND,
    },
    softBackgroundLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: LIGHT_BACKGROUND,
    },
    header: {
        paddingHorizontal: 20, 
        paddingTop: 15,
        height: 60,
        backgroundColor: 'transparent', 
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
    },
    // --- Illustration Styling ---
    illustrationContainer: {
        width: '100%',
        height: screenHeight * 0.35, 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10, 
    },
    illustrationImage: {
        width: '120%',
        height: '110%',
    },
    // --- Text Styling ---
    mainHeading: {
        // Style for the first line ("Create your")
        fontSize: 30, 
        fontWeight: '900', 
        textAlign: 'center',
        color: HEADER_BLACK, 
        lineHeight: 40,
        // Resetting the bottom margin here
    },
    iconTitleRow: {
        // View to hold the second line of text and the icon horizontally
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, // Add spacing after the entire title
    },
    mainHeadingText: {
        // Style for the second line ("F2G account")
        fontSize: 30, 
        fontWeight: '900', 
        color: HEADER_BLACK, 
        lineHeight: 40,
        textAlign: 'center',
    },
    titleIcon: {
        // Style for the icon to add slight spacing
        marginLeft: 8,
        // Vertical adjustment to align icon better with text baseline
        transform: [{ translateY: 2 }] 
    },
    subText: {
        fontSize: 15, 
        color: GRAY_TEXT, 
        textAlign: 'center',
        lineHeight: 24, 
        fontWeight: '400',
        paddingHorizontal: 15,
    },
    // --- Button Wrapper and Styling ---
    buttonWrapper: {
        paddingHorizontal: 30,
        paddingBottom: 40,
        width: '100%',
    },
    actionButton: {
        height: 55,
        borderRadius: 10, 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15, 
        width: '100%',
    },
    primaryButton: {
        backgroundColor: PRIMARY_BLUE, 
        shadowColor: PRIMARY_BLUE, 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    primaryButtonText: {
        fontSize: 17,
        color: '#fff',
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: PRIMARY_BLUE,
    },
    secondaryButtonText: {
        fontSize: 17,
        color: PRIMARY_BLUE,
        fontWeight: '600',
    },
    // --- Terms Text Styling ---
    termsText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 18,
    },
    linkText: {
        color: ACCENT_BLUE,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
