import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const screenHeight = Dimensions.get('window').height;

// --- Design Constants (Matching previous Coinpay theme) ---
const PRIMARY_BLUE = '#4e54f9';      
const GRAY_TEXT = '#5c5c5c';        
const HEADER_BLACK = '#1a1a1a';      
const LIGHT_BACKGROUND = '#fcfcfc'; 
const BORDER_GRAY = '#ddd';

// --- Shared Header Component ---
// This component contains the image, title, and subtitle, which are present on both steps.
const SharedHeader = ({ fadeAnim }) => (
    <Animated.View style={[styles.headerSection, { opacity: fadeAnim }]}>
        <Image
            // NOTE: Replace with your actual image path for the welcome/sign-up screen
            source={require("../../../assets/coinpay_credit_cards.png")} 
            style={styles.image}
            resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to F2G</Text>
        <Text style={styles.subtitle}>
            Your personalized experience starts here
        </Text>
    </Animated.View>
);

const EnterNumberScreen = ({ navigation }) => {
    const [step, setStep] = useState(1); // 1: Welcome, 2: Enter Number
    const [phoneNumber, setPhoneNumber] = useState("");

    // Animation for fading the welcome visuals out
    const welcomeFadeAnim = useRef(new Animated.Value(1)).current;
    // Animation for sliding the number input up (optional but nice)
    const inputSlideAnim = useRef(new Animated.Value(0)).current;

    const handleGetStarted = () => {
        // 1. Fade out the welcome visuals
        Animated.timing(welcomeFadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            // 2. Switch to the next step
            setStep(2);
            // 3. Start the slide-up animation for the new content
            Animated.timing(inputSlideAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleContinue = () => {
        if (phoneNumber.length < 8) { 
             alert("Please enter a valid phone number.");
             return;
        }
        console.log("Phone Number:", phoneNumber);
        navigation.navigate("OtpScreen", { phoneNumber });
    };

    // --- RENDER STEP 1: WELCOME ---
    if (step === 1) {
        return (
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* Back Button for consistency */}
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back-ios" size={24} color={HEADER_BLACK} />
                    </TouchableOpacity>
                </View>

                <SharedHeader fadeAnim={welcomeFadeAnim} />

                <Animated.View style={[styles.buttonWrapper, { opacity: welcomeFadeAnim }]}>
                    <TouchableOpacity 
                        style={[styles.primaryButton, { width: '60%' }]} 
                        onPress={handleGetStarted}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        );
    }

    // --- RENDER STEP 2: ENTER NUMBER ---
    const translateY = inputSlideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0], // Starts off-screen, slides to position
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Back Button (Always visible on step 2) */}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => setStep(1)}> 
                    <MaterialIcons name="arrow-back-ios" size={24} color={HEADER_BLACK} />
                </TouchableOpacity>
            </View>

            <SharedHeader fadeAnim={new Animated.Value(1)} /> 
            
            <Animated.View style={[styles.inputSection, { transform: [{ translateY }] }]}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Enter your phone number</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="phone-pad"
                        placeholder="e.g. 98765 43210"
                        placeholderTextColor={BORDER_GRAY}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        maxLength={15}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.primaryButton, { opacity: phoneNumber.length > 7 ? 1 : 0.6 }]} 
                    onPress={handleContinue}
                    disabled={phoneNumber.length < 8}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_BACKGROUND,
        alignItems: "center",
        paddingHorizontal: 30,
    },
    backButtonContainer: {
        width: '100%',
        paddingTop: 15,
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    headerSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: "100%",
        height: screenHeight * 0.35, 
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        textAlign: "center",
        color: HEADER_BLACK,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: GRAY_TEXT,
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    // --- Step 1 Button ---
    buttonWrapper: {
        width: "100%",
        alignItems: "center",
        marginTop: 50,
    },
    // --- Step 2 Input Section ---
    inputSection: {
        width: "100%",
        flex: 1,
        marginTop: 50,
        alignItems: 'center',
    },
    inputContainer: {
        width: "100%",
        marginBottom: 30,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 10,
        color: HEADER_BLACK,
        fontWeight: '600',
    },
    input: {
        borderWidth: 2,
        borderColor: BORDER_GRAY,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontSize: 18,
        color: HEADER_BLACK,
        letterSpacing: 1.5,
    },
    // --- Primary Button Style (Used for both Get Started and Continue) ---
    primaryButton: {
        backgroundColor: PRIMARY_BLUE,
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        width: "100%",
        height: 55,
        justifyContent: 'center',
        shadowColor: PRIMARY_BLUE,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
});

export default EnterNumberScreen;