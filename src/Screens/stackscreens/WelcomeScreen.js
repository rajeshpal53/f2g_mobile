import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// NOTE: Assuming the theme file is one directory up from stackscreens
import { useTheme } from "../../Constants/Theme";

const screenHeight = Dimensions.get('window').height;

// Styles that don't depend on the theme (MOVED HERE to ensure availability)
const localStyles = StyleSheet.create({
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
});

// --- Illustration Component ---
const IllustrationPlaceholder = () => (
    <View style={localStyles.illustrationContainer}>
        {/* Path for the credit card/coin illustration */}
        {/* NOTE: Ensure 'coinpay_credit_cards.png' is available in your assets folder */}
        <Image
            source={require('../../../assets/coinpay_credit_cards.png')} 
            style={localStyles.illustrationImage}
            resizeMode="contain"
        />
    </View>
);
// ------------------------------------

export default function WelcomeScreen({ navigation }) {
    // 1. Use the theme hook to get dynamic colors and scheme
    const { colors, isDark } = useTheme(); 

    const handleSignUp = () => {
        console.log("Navigating to EnterNumberScreen for Sign Up...");
        // This is a common pattern for navigating to a specific stack screen
        navigation.navigate("EnterNumberScreen");
    };

    const handleLogIn = () => {
        console.log("Navigating to Home Screen for Log In...");
        // Assuming "Bottom" is the name of your Tab Navigator
        navigation.navigate("Bottom", { screen: "Home" });
    };

    // 2. Define dynamic styles using the theme colors
    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background, // Themed background
        },
        softBackgroundLayer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.surface, // Themed soft background/surface
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
        // --- Text Styling ---
        mainHeading: {
            fontSize: 30, 
            fontWeight: '900', 
            textAlign: 'center',
            color: colors.text, // Themed main heading color
            lineHeight: 40,
        },
        iconTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20, 
        },
        mainHeadingText: {
            fontSize: 30, 
            fontWeight: '900', 
            color: colors.text, // Themed main heading color
            lineHeight: 40,
            textAlign: 'center',
        },
        titleIcon: {
            marginLeft: 8,
            transform: [{ translateY: 2 }] 
        },
        subText: {
            fontSize: 15, 
            color: colors.textSecondary, // Themed body text color
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
            backgroundColor: colors.accent, // Themed primary action color
            // Dynamic shadow color
            shadowColor: isDark ? colors.accent : colors.primary, 
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
        },
        primaryButtonText: {
            fontSize: 17,
            color: colors.card, // White/Card text on button
            fontWeight: '600',
        },
        secondaryButton: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.accent, // Themed border color
        },
        secondaryButtonText: {
            fontSize: 17,
            color: colors.accent, // Themed text color for outline button
            fontWeight: '600',
        },
        // --- Terms Text Styling ---
        termsText: {
            fontSize: 12,
            color: colors.muted, // Themed muted text color
            textAlign: 'center',
            marginTop: 10,
            lineHeight: 18,
        },
        linkText: {
            color: colors.accent, // Themed link color
            fontWeight: '600',
            textDecorationLine: 'underline',
        },
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Dynamic Status Bar */}
            <StatusBar 
                barStyle={isDark ? "light-content" : "dark-content"} 
                backgroundColor={colors.background} 
            />
            
            {/* Soft Gray Background Layer */}
            {/* This adds a visual effect, but can be removed if a simpler background is desired */}
            <View style={styles.softBackgroundLayer} />
            
            {/* Header: Back Arrow */}
            <View style={styles.header}>
                {/* Note: In a typical Welcome/Onboarding screen, a back button might navigate 
                to a previous screen or be absent entirely. */}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Main Content Area */}
            <View style={styles.contentContainer}>
                
                {/* Illustration */}
                <IllustrationPlaceholder />

                {/* Text Section */}
                <Text style={[styles.mainHeading, {marginBottom: 0}]}>
                    Create your
                </Text>
                
                {/* Row for the second line and icon */}
                <View style={styles.iconTitleRow}>
                    <Text style={styles.mainHeadingText}>
                        F2G account
                    </Text>
                    <FontAwesome5 
                        name="medal" 
                        size={28} 
                        color={colors.accent} // Themed icon color
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
                {/* Sign Up Button (Primary) */}
                <TouchableOpacity 
                    style={[styles.actionButton, styles.primaryButton]}
                    activeOpacity={0.8}
                    onPress={handleSignUp} 
                >
                    <Text style={styles.primaryButtonText}>Sign up</Text>
                </TouchableOpacity>

                {/* Log In Button (Secondary/Outline) */}
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