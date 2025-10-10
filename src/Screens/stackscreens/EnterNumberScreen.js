

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomCheckbox from "../Components/CustomCheckBox";
import { useSnackbar } from "../Store/SnackbarContext";
import { loginWithPhone, verifyOtp } from "../../firebaseAuth";
import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { createApi } from "../Util/UtilApi";

//  Yup Schema
const SignupSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
    .required("Mobile number is required"),
  agree: Yup.boolean().oneOf([true], "You must agree to continue"),
});

export default function EnterNumberScreen() {
  const navigation = useNavigation();
  const { showSnackbar } = useSnackbar();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [passwordModal, setPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  const [timer, setTimer] = useState(60); // 60 seconds countdown
  const [resendEnabled, setResendEnabled] = useState(false);

  // useEffect to handle the countdown timer
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendEnabled(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Step 1: Send OTP
  const handleSendOtp = async (values) => {
    try {
      setLoading(true);
      const confirmation = await loginWithPhone("+91" + values.mobile);
      setConfirm(confirmation);
      setMobileNumber(values.mobile);
      setOtpSent(true);
      setTimer(60); // Reset timer on new OTP
      setResendEnabled(false); // Disable resend button
      Alert.alert("OTP Sent", `OTP sent to +91 ${values.mobile}`);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // // New function to handle resending OTP
  // const handleResendOtp = async () => {
  //   if (confirm) {
  //     try {
  //       setLoading(true);
  //       // The original logic to send OTP
  //       const confirmation = await loginWithPhone(confirm.phoneNumber);
  //       setConfirm(confirmation);
  //       setTimer(60); // Reset timer
  //       setResendEnabled(false); // Disable resend button
  //       Alert.alert("OTP Resent", "A new OTP has been sent to your number.");
  //     } catch (error) {
  //       Alert.alert("Error", error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };



  const handleResendOtp = async (mobileNumber) => {
    // It's still a good idea to check for the mobile number
    console.log("Resending OTP to:", mobileNumber);
    if (!mobileNumber) {
      Alert.alert("Error", "Could not find a phone number to resend OTP to.");
      return;
    }
    try {
      setLoading(true);
      // Concatenate the country code to the mobile number
      const confirmation = await loginWithPhone("+91" + mobileNumber);
      setConfirm(confirmation);
      setTimer(60); // Reset timer
      setResendEnabled(false); // Disable resend button
      Alert.alert("OTP Resent", "A new OTP has been sent to your number.");
    } catch (error) {
      Alert.alert("Error", error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };




  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      const user = await verifyOtp(confirm, otp);
      const token = await user.getIdToken();
      setIdToken(token);
      setPasswordModal(true); // open password setup modal
    } catch (error) {
      Alert.alert("Error", "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Signup
  const handleSignup = async (mobile, password) => {
    try {
      const FCMToken = await AsyncStorage.getItem("FCMToken");
      const payload = {
        mobile,
        password,
        idToken,
        fcmtokens: [FCMToken],
      };

      await createApi("users/signUp", payload);

      showSnackbar("Account created successfully", "Success");
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: "Home" }],
      // });
    } catch (error) {
      console.log("Signup Error:", error);
      showSnackbar("Signup Failed", "Error");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={{ mobile: "", agree: false }}
        validationSchema={SignupSchema}
        onSubmit={handleSendOtp}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            {/* Logo */}
            <View style={{ alignItems: "center", marginTop: "25%" }}>
              <Image
                source={require("../../assets/societyLogo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>Get Started</Text>
            <Text style={styles.subtitle}>
              Please enter your mobile Number to proceed further
            </Text>

            {/* Phone Number Input */}
            <Text style={{ marginVertical: "5%", color: "black", textAlign: "center", fontSize: 18 }}>
              {otpSent ? "Enter OTP" : "Phone Number"}
            </Text>

            {otpSent ? (
              // OTP Input
              <View>
                <OtpInput
                  numberOfDigits={6}
                  onTextChange={(val) => setOtp(val)}
                  theme={{
                    pinCodeTextStyle: { fontSize: 20 },
                    pinCodeContainerStyle: { borderBottomWidth: 2 },
                  }}
                />
                {/* Resend Timer and Button */}
                <View style={styles.resendContainer}>
                  {resendEnabled ? (
                    <TouchableOpacity
                      onPress={() => handleResendOtp(values.mobile)}
                      disabled={loading}
                    >
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.timerText}>
                      Resend OTP in {timer}s
                    </Text>
                  )}
                </View>
              </View>
            ) : (
              // Mobile Input
              <View style={styles.inputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Mobile Number"
                  keyboardType="numeric"
                  maxLength={10}
                  value={values.mobile}
                  onChangeText={handleChange("mobile")}
                />
              </View>
            )}

            {touched.mobile && errors.mobile && !otpSent && (
              <Text style={styles.errorText}>{errors.mobile}</Text>
            )}

            {/* Checkbox */}
           <View style={styles.checkboxRow}>
  <CustomCheckbox
    isChecked={values.agree}
    onChange={() => setFieldValue("agree", !values.agree)}
  />
  
  <TouchableOpacity
    onPress={() =>
      navigation.navigate("PoliciesDetailScreen", {
        webUri: "https://qwikbill.in/qapp/privacy-policy?view=mobile",
        headerTitle: "Privacy and Policies",
      })
    }
  >
    <Text style={styles.link}>Terms & Conditions</Text>
  </TouchableOpacity>
</View>

            {touched.agree && errors.agree && (
              <Text style={styles.errorText}>{errors.agree}</Text>
            )}

            <TouchableOpacity
              style={styles.sendBtn}
              onPress={otpSent ? handleVerifyOtp : handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.sendBtnText}>
                  {otpSent ? "Verify OTP" : "Send OTP"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Already have account */}
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate("Login")}
              >
                Login
              </Text>
            </Text>

            {/* Security Info */}
            <View style={styles.securityContainer}>
              <View style={styles.securityRow}>
                <MaterialIcons name="security" size={18} color="gray" />
                <Text style={styles.securityText}>
                  Does not sell or trade your data
                </Text>
              </View>
              <View style={styles.securityRow}>
                <FontAwesome5 name="certificate" size={16} color="gray" />
                <Text style={styles.securityText}>
                  Is ISO 27001 certified for information security
                </Text>
              </View>
              <View style={styles.securityRow}>
                <Entypo name="lock" size={18} color="gray" />
                <Text style={styles.securityText}>
                  Encrypts and secures your data
                </Text>
              </View>
              <View style={styles.securityRow}>
                <MaterialIcons name="description" size={18} color="gray" />
                <Text style={styles.securityText}>
                  Is certified GDPR ready, the gold standard in data privacy
                </Text>
              </View>
            </View>

            {/* Terms & Privacy */}
            <Text style={styles.bottomLinks}>
              <Text
                style={styles.link}
                onPress={() => navigation.navigate("Terms")}
              >
                Terms & Conditions
              </Text>{" "}
              ·{" "}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate("Privacy")}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        )}
      </Formik>

      <Modal visible={passwordModal} transparent animationType="slide">
        <View style={styles.modalWrapper}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={styles.modalBox}>
              {/* Icon + Title */}
              <View style={styles.modalHeader}>
                <MaterialIcons name="lock-outline" size={28} color="#fcd116" />
                <Text style={styles.modalTitle}>Set Your Password</Text>
              </View>

              <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={Yup.object().shape({
                  password: Yup.string()
                    .min(6, "Password must be at least 6 characters")
                    .required("Password is required"),
                  confirmPassword: Yup.string()
                    .oneOf([Yup.ref("password"), null], "Passwords must match")
                    .required("Confirm password is required"),
                })}
                onSubmit={(values) => {
                  handleSignup(
                    //confirm?.phoneNumber.replace("+91", ""),
                    mobileNumber,
                    values.password
                  );
                  setPasswordModal(false);
                  navigation.navigate("Login")

                }}
              >
                {({ handleChange, handleSubmit, values, errors, touched }) => (
                  <View style={{ marginTop: 10 }}>
                    <View style={{ marginBottom: 15 }}>
                      <Text style={styles.modalInputLabel}>Password</Text>
                      <View style={styles.inputWithIcon}>
                        <MaterialIcons name="vpn-key" size={20} color="#666" />
                        <TextInput
                          placeholder="Enter Password"
                          secureTextEntry={!showPassword}
                          style={styles.modalInput}
                          value={values.password}
                          onChangeText={handleChange("password")}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          <MaterialIcons
                            name={showPassword ? "visibility" : "visibility-off"}
                            size={22}
                            color="#666"
                          />
                        </TouchableOpacity>
                      </View>
                      {touched.password && errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                      )}
                    </View>
                    {/* Confirm Password Input */}
                    <Text style={styles.modalInputLabel}>Confirm Password</Text>
                    <View style={styles.inputWithIcon}>
                      <MaterialIcons name="vpn-key" size={20} color="#666" />
                      <TextInput
                        placeholder="Confirm Password"
                        secureTextEntry={!showConfirmPassword}
                        style={styles.modalInput}
                        value={values.confirmPassword}
                        onChangeText={handleChange("confirmPassword")}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <MaterialIcons
                          name={showConfirmPassword ? "visibility" : "visibility-off"}
                          size={22}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                    {/* Buttons Row */}
                    <View style={styles.modalBtnRow}>
                      <TouchableOpacity
                        style={[
                          styles.modalBtn,
                          { flex: 1.3, marginRight: 5 },
                        ]}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.modalBtnText}>Set Password</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.modalBtn,
                          { flex: 0.7, backgroundColor: "#ccc", marginLeft: 5 },
                        ]}
                        onPress={() => setPasswordModal(false)}
                      >
                        <Text style={[styles.modalBtnText, { color: "#333" }]}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 10,
  },
  subtitle: { fontSize: 14, textAlign: "center", marginVertical: 10, color: "#333" },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 15,
    height: 50,
  },
  countryCode: { marginRight: 10, fontSize: 16 },
  input: { flex: 1, fontSize: 16 },
  sendBtn: {
    backgroundColor: "#FFD700",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 15,
  },
  sendBtnText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  termsText: { marginLeft: 10, fontSize: 14, color: "#333" },
  link: { color: "#007AFF", fontWeight: "bold" },
  errorText: { color: "red", marginBottom: 5 },
  loginText: { textAlign: "center", marginTop: 10, fontSize: 14 },
  logo: { height: 75, width: 75, marginBottom: 10 },
  securityContainer: { marginTop: 20 },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  securityText: { marginLeft: 10, fontSize: 13, color: "#555", flex: 1 },
  bottomLinks: { textAlign: "center", marginTop: 20, fontSize: 14 },
  // modalWrapper: {
  //   flex: 1,
  //   backgroundColor: "rgba(0,0,0,0.5)",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // modalBox: {
  //   backgroundColor: "#fff",
  //   padding: 20,
  //   borderRadius: 15,
  //   width: "85%",
  //   elevation: 5,
  // },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    //justifyContent: "center",
    //alignItems: "center",
    padding: 10,
    // width:"90%"
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "95%",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 20,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginLeft: 10,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    backgroundColor: "#fafafa",
  },
  modalInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },

  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    backgroundColor: "#fcd116",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  modalInputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    // marginBottom: 3,
  },
  resendContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  resendText: {
    color: "#444",
    fontWeight: "bold",
    fontSize: 16,
  },
  timerText: {
    color: "gray",
    fontSize: 16,
  },

});

