import React, { useState } from "react";
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
} from "react-native";

const EnterNumberScreen = ({ navigation }) => {
  const [showEnterNumber, setShowEnterNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const fadeAnim = new Animated.Value(1);

  const handleGetStarted = () => {
    // Fade out welcome visuals
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setShowEnterNumber(true));
  };

  const handleContinue = () => {
    console.log("Phone Number:", phoneNumber);
    navigation.navigate("OtpScreen", { phoneNumber });
  };

  if (!showEnterNumber) {
    // Welcome Screen with Get Started button
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Image
          source={require("../assets/welcome-image.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to MyApp</Text>
        <Text style={styles.subtitle}>
          Your personalized experience starts here
        </Text>

        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Enter Number Screen
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={require("../assets/welcome-image.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to MyApp</Text>
      <Text style={styles.subtitle}>
        Your personalized experience starts here
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter your phone number</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="+91 1234567890"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  getStartedButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "60%",
  },
  getStartedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EnterNumberScreen;
