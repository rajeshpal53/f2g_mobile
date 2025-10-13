import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Dimensions, 
    useColorScheme,
    StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Get screen height for potential responsive sizing
const screenHeight = Dimensions.get('window').height;

// --- START Theme Definition (Integrated from theme.ts) ---

// Light theme
const LightColors = {
    muted:"#666",
    background: "#FFFFFF",
    surface: "#F8F9FA",           // soft gray
    card: "#FFFFFF",
    text: "#212529",
    textSecondary: "#6C757D",
    border: "#DEE2E6",

    // accents
    primary: "#0C3B73",           // deep blue
    secondary: "#26A0DF",         // light blue
    accent: "#007BFF",            // action button color

    // states
    overlay: "rgba(0,0,0,0.05)",
    selected: "#E8F5E9",

    // custom additions from your UI
    itemBackground: "#F0F0F0",
    helpBackground: "#F0F0F0",
    avatarBackground: "#B3ECFF",
    modalBackground: "rgba(0,0,0,0.8)",

    success: "#2E7D32",
    danger: "#D32F2F",
    warning: "#ED6C02",
    info: "#0288D1",
    xyz:"#FF00FF",
};

const DarkColors = {
    muted:"#bbb",
    background: "#121212",
    surface: "#1E1E1E",
    card: "#1E1E1E",
    text: "#FFFFFF",
    textSecondary: "#A1A1A1",
    border: "#2C2C2C",

    // accents
    primary: "#26A0DF",           // lighter blue pops on dark
    secondary: "#0C3B73",         // deep accent blue
    accent: "#339CFF",            // brighter button color

    // states
    overlay: "rgba(255,255,255,0.08)",
    selected: "rgba(38,160,223,0.15)",

    // custom additions from your UI
    itemBackground: "#2A2A2A",
    helpBackground: "#2A2A2A",
    avatarBackground: "#274472",
    modalBackground: "rgba(0,0,0,0.9)",

    success: "#81C784",
    danger: "#EF9A9A",
    warning: "#FFB74D",
    info: "#4FC3F7",
    xyz:"#FF00FF",
};


// Custom hook to provide theme colors and scheme status
function useTheme() {
    const scheme = useColorScheme(); // 'light' or 'dark'
    console.log(scheme,"scheme")
    const colors = scheme === 'dark' ? DarkColors : LightColors;
    const isDark = scheme === 'dark';
    return { colors, isDark };
}
// --- END Theme Definition ---


const LoginScreen = ({ navigation }) => {
    // Replaced old simulation with the new useTheme hook
    const { colors, isDark } = useTheme(); 
    const [showPassword, setShowPassword] = useState(false);

    // --- Dynamic Styles ---
    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingHorizontal: 20, 
            paddingTop: 15,
            height: 60,
            justifyContent: 'center',
        },
        backIcon: {
            color: colors.text,
        },
        contentContainer: {
            flex: 1,
            paddingHorizontal: 32, // Equivalent to px-8
            paddingTop: 16,       // Equivalent to pt-4
            alignItems: 'flex-start',
        },
        title: {
            fontSize: 24,
            fontWeight: '700', // bold
            color: colors.text,
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 32,
        },
        label: {
            fontSize: 10,
            fontWeight: '600', // semibold
            color: colors.textSecondary,
            textTransform: 'uppercase',
            marginBottom: 8,
        },
        // --- Input Styling ---
        inputGroup: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 12, // rounded-xl
            height: 56,       // h-14
            width: '100%',
            paddingHorizontal: 16,
            marginBottom: 16,
            backgroundColor: colors.surface,
            // Updated to use the new 'border' color key
            borderColor: colors.border,
        },
        inputGroupFocused: {
            borderColor: colors.accent,
        },
        inputField: {
            flex: 1,
            height: '100%',
            fontSize: 16,
            color: colors.text,
            backgroundColor: 'transparent',
            paddingVertical: 0,
            // Corrected: Removed extra padding right due to new layout
        },
        countryCode: {
            fontSize: 16,
            fontWeight: '500', // medium
            color: colors.text,
            paddingRight: 12,
            marginRight: 12,
            borderRightWidth: 1,
            // Updated to use the new 'border' color key for consistency
            borderColor: colors.border, 
        },
        inputIcon: {
            fontSize: 20,
            color: colors.textSecondary,
            marginRight: 12,
        },
        // --- Button Styling ---
        buttonWrapper: {
            paddingHorizontal: 32,
            paddingBottom: 40,
            width: '100%',
        },
        primaryButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 56,
            borderRadius: 12,
            marginBottom: 16,
            width: '100%',
            backgroundColor: colors.accent,
            
            // Basic shadow for native 
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
        },
        primaryButtonText: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.card,
        },
        linkButton: {
            alignSelf: 'flex-end',
            marginTop: 4,
            marginBottom: 40,
        },
        linkText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.accent,
            textDecorationLine: 'underline',
        },
        signUpTextContainer: {
            marginTop: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        signUpText: {
            color: colors.textSecondary,
            fontSize: 14,
        }
    });

    // Simulated action handlers
    const handleLogin = () => {
        console.log("Attempting Log In (Native Navigation Placeholder)...");
        // FIX: Navigate to the main stack route that holds the bottom tab navigator ("Bottom")
        navigation.navigate("Bottom"); 
    };

    const handleForgotPassword = () => {
        console.log("Navigating to Forgot Password (Native Navigation Placeholder)...");
        // navigation.navigate("ForgotPasswordScreen");
    };

    const handleSignUpLink = () => {
        console.log("Navigating to Sign Up Screen (Native Navigation Placeholder)...");
        // navigation.navigate("EnterNumberScreen");
    };

    const handleGoBack = () => {
        console.log("Navigating Back (Native Navigation Placeholder)...");
        // navigation.goBack();
    }
    
    // State for input focus to provide the border effect
    const [phoneFocus, setPhoneFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar 
                // Updated to use the new 'isDark' boolean from the useTheme hook
                barStyle={isDark ? "light-content" : "dark-content"} 
                backgroundColor={colors.background} 
            />
            
            {/* Header: Back Arrow */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <MaterialIcons name="arrow-back-ios" size={24} style={styles.backIcon} />
                </TouchableOpacity>
            </View>

            {/* Main Content Area */}
            <View style={styles.contentContainer}>
                
                {/* Text Section */}
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Sign in to access your F2G account.</Text>

                {/* --- Form --- */}
                <View style={{ width: '100%' }}>
                    {/* Phone Input */}
                    <Text style={styles.label}>Phone</Text>
                    <View style={[styles.inputGroup, phoneFocus && styles.inputGroupFocused]}>
                        <FontAwesome5 name="phone" style={styles.inputIcon} />
                        <Text style={styles.countryCode}>+91</Text>
                        <TextInput
                            placeholder="Mobile number"
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.inputField, { marginLeft: 12 }]}
                            keyboardType="phone-pad"
                            onFocus={() => setPhoneFocus(true)}
                            onBlur={() => setPhoneFocus(false)}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input */}
                    <Text style={styles.label}>Password</Text>
                    <View style={[styles.inputGroup, passwordFocus && styles.inputGroupFocused]}>
                        <FontAwesome5 name="lock" style={styles.inputIcon} />
                        <TextInput
                            placeholder="••••••••"
                            placeholderTextColor={colors.textSecondary}
                            style={styles.inputField}
                            secureTextEntry={!showPassword}
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)}
                            style={{ padding: 8 }}
                        >
                            <MaterialIcons 
                                name={showPassword ? "visibility" : "visibility-off"} 
                                size={24} 
                                color={colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Forgot Password Link */}
                <TouchableOpacity 
                    style={styles.linkButton} 
                    onPress={handleForgotPassword}
                >
                    <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>
                
            </View>

            {/* Button Container */}
            <View style={styles.buttonWrapper}>
                {/* Log In Button (Primary) */}
                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={handleLogin} 
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Log In</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signUpTextContainer}>
                    <Text style={styles.signUpText}>
                        Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={handleSignUpLink}>
                        <Text style={styles.linkText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </SafeAreaView>
    );
}

export default LoginScreen;
