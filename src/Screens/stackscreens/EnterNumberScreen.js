// src/Screens/EnterNumberScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTheme } from "../../Constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenHeight = Dimensions.get("window").height;

/* -------------------------
   MOCK HELPERS — replace with real implementations
------------------------- */
const loginWithPhone = async (fullNumber) => {
  await new Promise((r) => setTimeout(r, 600));
  return { phoneNumber: fullNumber, _mock: true };
};

const verifyOtp = async (confirmObj, otp) => {
  await new Promise((r) => setTimeout(r, 600));
  if (!confirmObj) throw new Error("No confirmation object");
  if (otp.length !== 6) throw new Error("Invalid OTP length");
  return {
    getIdToken: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return "mock-id-token-xyz";
    },
  };
};

const createApi = async (path, payload) => {
  await new Promise((r) => setTimeout(r, 700));
  return { ok: true, data: { message: "signed up (mock)" } };
};

/* -------------------------
   Small Checkbox
------------------------- */
const Checkbox = ({ checked, onToggle, label, labelStyle }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{ flexDirection: "row", alignItems: "center" }}
      activeOpacity={0.8}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          borderWidth: 1.5,
          borderColor: colors.border,
          backgroundColor: checked ? colors.accent : "transparent",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}
      >
        {checked && <MaterialIcons name="check" size={14} color={colors.card} />}
      </View>
      <Text style={[{ color: colors.textSecondary }, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

/* -------------------------
   Validation Schema
------------------------- */
const SignupSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
    .required("Mobile number is required"),
  agree: Yup.boolean().oneOf([true], "You must agree to continue"),
});

/* -------------------------
   Main Screen
------------------------- */
export default function EnterNumberScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  const [otpSent, setOtpSent] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const otpInputsRef = useRef([]);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [idToken, setIdToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ---------- OTP Countdown ---------- */
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setResendEnabled(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  /* ---------- Handlers ---------- */
  const handleSendOtp = async (values) => {
    try {
      setLoading(true);
      const confirmation = await loginWithPhone("+91" + values.mobile);
      setConfirm(confirmation);
      setMobileNumber(values.mobile);
      setOtpSent(true);
      setTimer(60);
      setResendEnabled(false);
      setTimeout(() => otpInputsRef.current[0]?.focus(), 250);
      Alert.alert("OTP Sent", `OTP sent to +91 ${values.mobile}`);
    } catch (err) {
      Alert.alert("Error", err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!mobileNumber) return Alert.alert("Error", "No mobile number to resend OTP.");
    try {
      setLoading(true);
      const confirmation = await loginWithPhone("+91" + mobileNumber);
      setConfirm(confirmation);
      setTimer(60);
      setResendEnabled(false);
      setOtp("");
      setTimeout(() => otpInputsRef.current[0]?.focus(), 250);
      Alert.alert("OTP Resent", `OTP resent to +91 ${mobileNumber}`);
    } catch (err) {
      Alert.alert("Error", err?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return Alert.alert("Error", "Please enter the complete 6-digit OTP.");
    try {
      setLoading(true);
      const user = await verifyOtp(confirm, otp);
      const token = await user.getIdToken();
      setIdToken(token);
      setPasswordModalVisible(true);
    } catch (err) {
      Alert.alert("Error", err?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (mobile, password) => {
    try {
      setLoading(true);
      const FCMToken = await AsyncStorage.getItem("FCMToken");
      const payload = { mobile, password, idToken, fcmtokens: FCMToken ? [FCMToken] : [] };
      await createApi("users/signUp", payload);
      Alert.alert("Success", "Account created successfully");
      setPasswordModalVisible(false);
      navigation.navigate("welcome"); // Navigate to Welcome screen
    } catch (err) {
      Alert.alert("Signup Failed", err?.message || "Unable to sign up");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- OTP input helper ---------- */
  const onOtpChangeAt = (digit, idx) => {
    const d = digit.replace(/[^0-9]/g, "");
    let arr = otp.split("");
    while (arr.length < 6) arr.push("");
    arr[idx] = d ? d[0] : "";
    const newOtp = arr.join("").slice(0, 6);
    setOtp(newOtp);

    if (d && otpInputsRef.current[idx + 1]) otpInputsRef.current[idx + 1].focus();
    if (!d && otpInputsRef.current[idx - 1]) otpInputsRef.current[idx - 1].focus();
  };

  /* ---------- Styles ---------- */
  const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: colors.background },
    logoWrap: { alignItems: "center", marginTop: 14, marginBottom: 8 },
    logo: { height: 300, width: 300, borderRadius: 12 },
    title: { fontSize: 22, fontWeight: "700", alignSelf: "center", color: colors.text, marginTop: 6 },
    subtitle: { fontSize: 14, textAlign: "center", marginVertical: 8, color: colors.textSecondary },
    inputContainer: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      alignItems: "center",
      marginBottom: 12,
      height: 52,
      backgroundColor: colors.card,
    },
    countryCode: { marginRight: 10, fontSize: 16, color: colors.text },
    input: { flex: 1, fontSize: 16, color: colors.text },
    sendBtn: {
      height: 55,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 15,
      width: "100%",
      backgroundColor: colors.accent,
      elevation: 8,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    sendBtnText: { fontSize: 17, fontWeight: "600", color: colors.card },
    errorText: { color: "#e53935", marginBottom: 6 },
    otpRow: { flexDirection: "row", gap: 8, justifyContent: "center" },
    otpBox: {
      width: 48, height: 56, borderRadius: 10, borderWidth: 1,
      borderColor: colors.border, backgroundColor: colors.card,
      textAlign: "center", fontSize: 20, color: colors.text, fontWeight: "600"
    },
    resendContainer: { alignItems: "center", marginVertical: 10 },
    resendText: { color: colors.text, fontWeight: "600" },
    timerText: { color: colors.textSecondary },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 12 },
    modalBox: { backgroundColor: colors.card, borderRadius: 12, padding: 18, elevation: 6 },
    modalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    modalTitle: { fontSize: 18, fontWeight: "700", marginLeft: 8, color: colors.text },
    inputWithIcon: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10, backgroundColor: colors.surface },
    modalInput: { flex: 1, paddingVertical: 8, color: colors.text },
    modalBtnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
    modalBtn: { flex: 1, backgroundColor: colors.accent, paddingVertical: 12, borderRadius: 10, alignItems: "center", marginHorizontal: 6 },
    modalBtnText: { fontSize: 16, fontWeight: "700", color: colors.card },
    modalInputLabel: { fontSize: 14, fontWeight: "600", color: colors.text, marginTop: 6 },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={styles.logoWrap}>
            <Image source={require("../../../assets/image.png")} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Formik for mobile input */}
          <Formik initialValues={{ mobile: "", agree: false }} validationSchema={SignupSchema} onSubmit={handleSendOtp}>
            {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View>
                {!otpSent ? (
                  <>
                    <Text style={styles.title}>Create an Account</Text>
                    <Text style={styles.subtitle}>Please enter your mobile number to proceed further</Text>

                    <View style={styles.inputContainer}>
                      <Text style={styles.countryCode}>+91</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Mobile Number"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="numeric"
                        maxLength={10}
                        value={values.mobile}
                        onChangeText={(t) => handleChange("mobile")(t.replace(/[^0-9]/g, "").slice(0, 10))}
                      />
                    </View>
                    {touched.mobile && errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                      <Checkbox checked={values.agree} onToggle={() => setFieldValue("agree", !values.agree)} label="I agree to the" />
                      <TouchableOpacity onPress={() => navigation.navigate("PoliciesDetailScreen", { webUri: "https://qwikbill.in/qapp/privacy-policy?view=mobile", headerTitle: "Privacy and Policies" })}>
                        <Text style={{ marginLeft: 6, color: colors.accent, fontWeight: "700" }}>Terms & Conditions</Text>
                      </TouchableOpacity>
                    </View>
                    {touched.agree && errors.agree && <Text style={styles.errorText}>{errors.agree}</Text>}

                    <TouchableOpacity style={styles.sendBtn} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
                      {loading ? <ActivityIndicator color={colors.card} /> : <Text style={styles.sendBtnText}>Send OTP</Text>}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={{ textAlign: "center", color: colors.text, fontSize: 16, marginBottom: 8 }}>Enter OTP sent to +91 {mobileNumber}</Text>
                    <View style={{ alignItems: "center" }}>
                      <View style={styles.otpRow}>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <TextInput
                            key={i}
                            ref={(r) => (otpInputsRef.current[i] = r)}
                            value={otp[i] || ""}
                            onChangeText={(t) => onOtpChangeAt(t, i)}
                            keyboardType="number-pad"
                            maxLength={1}
                            style={styles.otpBox}
                          />
                        ))}
                      </View>
                      <View style={styles.resendContainer}>
                        {resendEnabled ? (
                          <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                            <Text style={styles.resendText}>Resend OTP</Text>
                          </TouchableOpacity>
                        ) : (
                          <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
                        )}
                      </View>
                      <TouchableOpacity style={[styles.sendBtn, { marginTop: 6 }]} onPress={handleVerifyOtp} disabled={loading} activeOpacity={0.85}>
                        {loading ? <ActivityIndicator color={colors.card} /> : <Text style={styles.sendBtnText}>Verify OTP</Text>}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            )}
          </Formik>

          {/* Password Modal */}
          <Modal visible={passwordModalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <View style={styles.modalHeader}>
                  <MaterialIcons name="lock-outline" size={26} color={colors.accent} />
                  <Text style={styles.modalTitle}>Set Your Password</Text>
                </View>

                <Formik
                  initialValues={{ password: "", confirmPassword: "" }}
                  validationSchema={Yup.object().shape({
                    password: Yup.string().min(6, "At least 6 chars").required("Required"),
                    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Required"),
                  })}
                  onSubmit={(vals) => handleSignup(mobileNumber, vals.password)}
                >
                  {({ handleChange, handleSubmit, values, touched, errors }) => (
                    <View>
                      <Text style={styles.modalInputLabel}>Password</Text>
                      <View style={styles.inputWithIcon}>
                        <MaterialIcons name="vpn-key" size={20} color={colors.textSecondary} />
                        <TextInput
                          placeholder="Enter Password"
                          placeholderTextColor={colors.textSecondary}
                          secureTextEntry={!showPassword}
                          style={styles.modalInput}
                          value={values.password}
                          onChangeText={handleChange("password")}
                        />
                        <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                      <Text style={styles.modalInputLabel}>Confirm Password</Text>
                      <View style={styles.inputWithIcon}>
                        <MaterialIcons name="vpn-key" size={20} color={colors.textSecondary} />
                        <TextInput
                          placeholder="Confirm Password"
                          placeholderTextColor={colors.textSecondary}
                          secureTextEntry={!showConfirmPassword}
                          style={styles.modalInput}
                          value={values.confirmPassword}
                          onChangeText={handleChange("confirmPassword")}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword((s) => !s)}>
                          <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                      <View style={styles.modalBtnRow}>
                        <TouchableOpacity style={styles.modalBtn} onPress={handleSubmit} activeOpacity={0.85}>
                          <Text style={styles.modalBtnText}>{loading ? "Please wait..." : "Set Password"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setPasswordModalVisible(false)} activeOpacity={0.85}>
                          <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
