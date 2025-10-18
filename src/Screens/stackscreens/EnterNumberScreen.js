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
import { useSnackbar } from "../../Store/SnackbarContext";
import { createApi } from "../../Util/UtilApi";
  import { getApp } from "@react-native-firebase/app";
  import {Checkbox} from 'react-native-paper'
import {
  getAuth,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";
import SetpasswordModal from "../../Components/Modal/SetpasswordModal";
import { getFcmToken } from "../../Util/NotificationHandler";
const screenHeight = Dimensions.get("window").height;
  const app = getApp();
const auth = getAuth(app); // ✅ fixed initialization

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
   Checkbox Component
------------------------- */
const Checkbox1= ({ checked, onToggle, label, labelStyle, showError, errorText }) => {
  const { colors } = useTheme();

  return (
    <View>
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
            borderColor: showError && !checked ? colors.error : colors.border,
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

      {showError && !checked && (
        <Text style={{ color: colors.error, fontSize: 12, marginTop: 4 }}>
          {errorText || "This field is required"}
        </Text>
      )}
    </View>
  );
};

/* -------------------------
   Main Component
------------------------- */
export default function EnterNumberScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { showSnackbar } = useSnackbar();

  const [otpSent, setOtpSent] = useState(false);
  const [confirmObj, setConfirmObj] = useState(null);
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
  const [isForgetPasswordState, setIsForgetPasswordState] = useState(false)


  useEffect(()=>{
     const token=getFcmToken()
     console.log(token,"token in enter Number Screen")
  },[])
  

  /* ---------- Timer ---------- */
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

  /* ---------- Send OTP ---------- */
  const handleSendOtp = async (values) => {
    try {

      setLoading(true);
      const fullPhone = "+91" + values.mobile;
      const confirmation = await signInWithPhoneNumber(auth, fullPhone);
      setConfirmObj(confirmation);
      setMobileNumber(values.mobile);
      setOtpSent(true);
      setTimer(60);
      setResendEnabled(false);
      setTimeout(() => otpInputsRef.current[0]?.focus(), 250);
      showSnackbar(`OTP sent to ${fullPhone}`, "success");
    } catch (error) {
      console.error("OTP Send Error:", error);
      showSnackbar(error.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Resend OTP ---------- */
  const handleResendOtp = async () => {
    if (!mobileNumber) return Alert.alert("Error", "No mobile number found.");
    handleSendOtp({ mobile: mobileNumber, agree: true });
  };

  /* ---------- Confirm OTP ---------- */
const handleVerifyOtp = async () => {
    if (!confirmObj) return Alert.alert("Error", "No confirmation found");
    try {
      setLoading(true);
      const userCredential = await confirmObj.confirm(otp); // ✅ Modern API
      const token = await userCredential.user.getIdToken();
      console.log("User token:", token);
      // Alert.alert("Success", "Phone verified!");
      setIdToken(token)
      setPasswordModalVisible(true)

    } catch (error) {
      console.log("Verify OTP Error:", error);
      Alert.alert("Invalid OTP", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Signup API ---------- */
  const handleSignup = async ( password,isForgetPassword,navigation, setIsForgetPasswordState) => {
    try {
      setLoading(true);
      const FCMToken = await AsyncStorage.getItem("FCMToken");
      const payload = {
        mobile:mobileNumber,
        password,
        idToken,
        fcmtokens: FCMToken ? [FCMToken] : [],
      };
      console.log(payload)
      const result = await createApi("users/signUp", payload);
      if (result?.user)
        await AsyncStorage.setItem("userData", JSON.stringify(result.user));

      showSnackbar(result?.message || "Account created successfully", "success");
      setPasswordModalVisible(false);
      navigation.navigate("welcome");
    } catch (err) {
      console.log("Signup Error:", err);
      showSnackbar(err.message || "Unable to sign up", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- OTP Input ---------- */
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

  /* ---------- UI ---------- */
  const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: colors.background },
    logoWrap: { alignItems: "center", marginTop: 14, marginBottom: 8 },
    logo: { height: 300, width: 300, borderRadius: 12 },
    title: {
      fontSize: 22,
      fontWeight: "700",
      alignSelf: "center",
      color: colors.text,
      marginTop: 6,
    },
    subtitle: {
      fontSize: 14,
      textAlign: "center",
      marginVertical: 8,
      color: colors.textSecondary,
    },
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
    input: { flex: 1, fontSize: 16, color: colors.text },
    sendBtn: {
      height: 55,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 15,
      backgroundColor: colors.accent,
    },
    sendBtnText: { fontSize: 17, fontWeight: "600", color: colors.card,  width:150, textAlign:"center"},
    otpRow: { flexDirection: "row", gap: 8, justifyContent: "center" },
    otpBox: {
      width: 48,
      height: 56,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      textAlign: "center",
      fontSize: 20,
      color: colors.text,
      fontWeight: "600",
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoWrap}>
            <Image
              source={require("../../../assets/image.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Formik
            initialValues={{ mobile: "", agree: true }}
            validationSchema={SignupSchema}
            onSubmit={handleSendOtp}
          >
            {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
              <>
                {!otpSent ? (
                  <>
                    <Text style={styles.title}>Create an Account</Text>
                    <Text style={styles.subtitle}>
                      Please enter your mobile number to proceed further
                    </Text>

                    <View style={styles.inputContainer}>
                      <Text style={{ marginRight: 10, fontSize: 16, color: colors.text }}>+91</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Mobile Number"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="numeric"
                        maxLength={10}
                        value={values.mobile}
                        onChangeText={(t) =>
                          handleChange("mobile")(t.replace(/[^0-9]/g, "").slice(0, 10))
                        }
                      />
                    </View>
                    {touched.mobile && errors.mobile && (
                      <Text style={{ color: "red" }}>{errors.mobile}</Text>
                    )}
<View style={{ marginBottom: 12 }}>
  <TouchableOpacity
    style={{ flexDirection: "row", alignItems: "center" }}
    onPress={() => setFieldValue("agree", !values.agree)}
    activeOpacity={0.8}
  >
    <Checkbox
      status={values.agree ? "checked" : "unchecked"}
      color={colors?.main}
    />
    <Text style={styles.label}>I agree to the</Text>

    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Policies", {
          webUri: "https://qwikbill.in/qapp/privacy-policy?view=desktop",
          headerTitle: "Privacy and Policies",
        })
      }
      activeOpacity={0.7}
    >
      <Text
        style={{
          marginLeft: 6,
          color: colors.accent,
          fontWeight: "700",
        }}
      >
        Terms & Conditions
      </Text>
    </TouchableOpacity>
  </TouchableOpacity>

  {touched.agree && errors.agree && (
    <Text style={{ color: "red", marginTop: 4 }}>{errors.agree}</Text>
  )}
</View>


                    <TouchableOpacity
                      style={styles.sendBtn}
                      onPress={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={colors.card} />
                      ) : (
                        <Text style={styles.sendBtnText}>Send OTP</Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        textAlign: "center",
                        color: colors.text,
                        fontSize: 16,
                        marginBottom: 8,
                      }}
                    >
                      Enter OTP sent to +91 {mobileNumber}
                    </Text>

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

                      {resendEnabled ? (
                        <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                          <Text style={{ color: colors.accent, marginVertical: 10 }}>
                            Resend OTP
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={{ color: colors.textSecondary, marginVertical: 10 }}>
                          Resend OTP in {timer}s
                        </Text>
                      )}

                      <TouchableOpacity
                        style={styles.sendBtn}
                        onPress={handleVerifyOtp}
                        disabled={loading}
                      >
                        {loading ? (
                          <ActivityIndicator color={colors.card} />
                        ) : (
                          <Text style={styles.sendBtnText}>Verify OTP</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
          </Formik>
        </ScrollView>
        {
          passwordModalVisible&&(
            <SetpasswordModal
      visible={passwordModalVisible}
      closeModal={()=>{setPasswordModalVisible}}
      navigation={navigation}
      postData={handleSignup}
      isForgetPassword={isForgetPasswordState}
      setIsForgetPasswordState={setIsForgetPasswordState}
    />
          )
        }
         
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
