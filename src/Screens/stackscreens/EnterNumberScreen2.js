import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OtpInput } from "react-native-otp-entry";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  NORM_URL,
  createApi,
  fontFamily,
  fontSize,
  readApi
} from "../../Util/UtilApi";

import { Formik } from "formik";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Divider,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput
} from "react-native-paper";
import * as Yup from "yup";
import { getApp } from "@react-native-firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber
} from '@react-native-firebase/auth';
import { useSnackbar } from "../../Store/SnackbarContext";
import UserDataContext from "../../Store/UserDataContext";

const EnterNumberScreen = ({ navigation, route, setIsForgetPasswordState }) => {

  const isForgetPassword = route?.params?.isForgetPassword || false;

  const [phoneNumber, setPhoneNumber] = useState(null);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [confirm, setConfirm] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [autoVerification, setAutoVerification] = useState(false);
  const [FCMToken, setFCMToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userData, saveUserData } = useContext(UserDataContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const [otpError, setOtpError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const app = getApp();
  const auth = getAuth(app);
  const { showSnackbar } = useSnackbar();
  const [idToken, setIdToken] = useState(null);

  const Validation = Yup.object().shape({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be numeric")
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number can be at most 10 digits")
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenCall = await AsyncStorage.getItem("FCMToken");
        setFCMToken(tokenCall);
      } catch (err) {
        console.error("failed to get token");
      }
    };
    fetchToken();
  }, []);

  const checkPhoneNumberAvailability = async (phoneNumber) => {
    try {
      const response = await readApi(`users/getUserByMobile/${phoneNumber}`);
      if (response?.mobile === phoneNumber) return false;
      return true;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) return prevTimer - 1;
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (user) => {});
    return () => subscriber();
  }, []);

  const postData = async (password, isForgetPassword, navigation) => {
    setIsLoading(true);
    const payload = {
      mobile: phoneNumber,
      password,
      idToken: idToken,
      fcmtokens: [FCMToken]
    };

    try {
      if (payload?.mobile) {
        const response = await createApi("users/signUp", payload);
        await saveUserData(response);
        await AsyncStorage.setItem("updatedPassword", password);
        if (isForgetPassword) setIsForgetPasswordState(true);
        return true;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    } finally {
      setIsLoading(false);
      alert("Password reset successfully!");
    }
  };

  const handleResendOTP = () => {
    setTimer(30);
    sendOtp("+91" + phoneNumber);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const startTimer = (timer) => {
    setTimer(timer);
    setIsTimerRunning(true);
  };

  const sendOtp = async (phoneNumber) => {
    try {
      setIsLoading(true);
      startTimer(30);
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
      setConfirm(confirmation);
      showSnackbar(
        "OTP Sent! Check your messages for the verification code.",
        "success"
      );
      return true;
    } catch (error) {
      showSnackbar(`OTP Sent failed ${error}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmOtp = async () => {
    if (otp.length !== 6) {
      setOtpError(true);
      return;
    }
    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), 10000);

    try {
      if (confirm) {
        const userCredential = await confirm.confirm(otp);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        setIdToken(idToken);
        setPasswordModalVisible(true);
      }
    } catch (error) {
      showSnackbar(`Failed to Login ${error}`, "error");
    }
  };

  const closeModal = () => setPasswordModalVisible(false);

  const Loader = () => (
    <Portal>
      <Modal
        visible={isLoading}
        contentContainerStyle={styles.modalBackground}
        accessible={true}
        accessibilityLabel="Loading content. Please wait."
        accessibilityRole="alert"
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      {!isVerified && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
            {autoVerification ? (
              <Text style={styles.autoVerifyText}>
                Auto-verification in progress...
              </Text>
            ) : confirm ? (
              <View style={styles.container1}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  <TouchableOpacity
                    style={{ alignItems: "flex-start", height: 48, width: 80 }}
                    onPress={() => setConfirm(null)}
                  >
                    <Button
                      textColor="#fff"
                      icon={() => (
                        <MaterialCommunityIcons
                          name="less-than"
                          size={18}
                          color="#fff"
                        />
                      )}
                      contentStyle={{ flexDirection: "row", backgroundColor: "#fcb534" }}
                      style={{ borderRadius: 10 }}
                    >
                      Back
                    </Button>
                  </TouchableOpacity>

                  <View>
                    <Image
                      style={{ height: height * 0.4, width: "100%" }}
                      source={require("../../../assets/create_account_image.png")}
                    />
                    {isLoading && <Loader />}
                  </View>

                  <Text variant="bodyLarge" style={styles.instructions}>
                    Enter the OTP sent to your mobile number +91{phoneNumber}
                  </Text>

                  <OtpInput numberOfDigits={6} onTextChange={setOtp} />

                  {otpError && (
                    <HelperText type="error">
                      Please enter a valid 6-digit OTP.
                    </HelperText>
                  )}

                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                    <TouchableOpacity onPress={handleResendOTP} disabled={timer !== 0}>
                      <Text style={[styles.resendOTP, timer !== 0 && { color: "#AAA" }]}>
                        Resend OTP in {formatTime(timer)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Button mode="contained" onPress={confirmOtp} style={styles.loginButton}>
                    Login
                  </Button>
                </ScrollView>
              </View>
            ) : (
              <>
                <View style={[styles.topHeader, { height: isForgetPassword ? "35%" : "40%" }]}>
                  <Image source={require("../../../assets/create_account_image.png")} style={styles.logo} />
                </View>

                <View style={[styles.loginSection, { height: isForgetPassword ? "70%" : "65%" }]}>
                  <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
                    <View style={{ flex: 1, justifyContent: "space-around" }}>
                      <View style={{ gap: 20 }}>
                        <Text style={styles.heading}>
                          {isForgetPassword ? "Forgot Password" : "Welcome to QwikBill"}
                        </Text>
                        {isForgetPassword && (
                          <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.label, marginHorizontal: 10, marginTop: -8, color: "#777" }}>
                            Enter your registered mobile number to receive a password reset OTP.
                          </Text>
                        )}

                        <Formik
                          initialValues={{ phone: "" }}
                          validationSchema={Validation}
                          onSubmit={async (values) => {
                            setIsLoading(true);
                            setPhoneNumber(values.phone);
                            await sendOtp("+91" + values.phone);
                            setIsLoading(false);
                          }}
                        >
                          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
                            <View style={{ justifyContent: "center", width: "100%" }}>
                              <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.labelMedium, marginHorizontal: 10 }}>
                                Mobile Number
                              </Text>

                              <View style={styles.inputContainer}>
                                <TouchableOpacity style={styles.countryCodeButton} onPress={() => setModalVisible(true)}>
                                  <View style={styles.flagContainer}>
                                    <Text style={styles.flagText}>🇮🇳</Text>
                                  </View>
                                  <Text style={styles.countryCodeText}>+91</Text>
                                  <MaterialCommunityIcons name="chevron-down" size={20} color={"#777"} style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                                <Divider style={{ height: "60%", width: 1, backgroundColor: "#ddd", marginHorizontal: 6 }} />
                                <TextInput
                                  placeholder="Enter Phone Number"
                                  keyboardType="phone-pad"
                                  style={styles.input}
                                  underlineColor="transparent"
                                  activeUnderlineColor="transparent"
                                  onChangeText={handleChange("phone")}
                                  onBlur={handleBlur("phone")}
                                  value={values.phone}
                                  error={touched.phone && errors.phone}
                                  maxLength={10}
                                  mode={"flat"}
                                  cursorColor={"#1e90ff"}
                                />
                              </View>

                              <View style={{ alignSelf: "center" }}>
                                {touched && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                              </View>

                              <Button
                                onPress={handleSubmit}
                                disabled={isTimerRunning && timer > 0 || !isValid || !dirty || !values.phone}
                                style={[styles.button, { borderRadius: 10 }, !isValid || !dirty || !values.phone ? { backgroundColor: "#d3d3d3" } : { backgroundColor: "#1E90FF" }]}
                                mode="contained"
                              >
                                <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.labelMedium, color: "#fff" }}>
                                  {isForgetPassword ? "Send OTP" : "Sign up"}
                                </Text>
                              </Button>

                              {isForgetPassword && (
                                <Text style={{ color: "#1E90FF", alignSelf: "center", fontFamily: fontFamily.medium, fontSize: fontSize.labelMedium, marginTop: 8 }}
                                  onPress={() => navigation.navigate("login")}>
                                  Back to Login
                                </Text>
                              )}
                            </View>
                          )}
                        </Formik>

                        {isLoading && <Loader />}
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, gap: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", flex: 1, width: 335, backgroundColor: "#F4F4F4", borderRadius: 8, paddingHorizontal: 12, marginBottom: 15, marginTop: 5, marginHorizontal: 10 },
  countryCodeButton: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  flagContainer: { width: 22, height: 18, marginRight: 8 },
  flagText: { fontSize: 23, marginTop: -5 },
  countryCodeText: { fontSize: 16, color: "#000" },
  input: { flex: 1, fontSize: fontSize.labelLarge, fontFamily: fontFamily.bold, color: "#000", backgroundColor: "transparent" },
  heading: { fontSize: fontSize.headingLarge, fontFamily: fontFamily.bold, color: "rgba(0,0,0,0.7)", marginTop: 12, marginHorizontal: 10 },
  container1: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#F5F5F5" },
  autoVerifyText: { fontSize: 20, textAlign: "center", marginTop: 20 },
  instructions: { marginBottom: 20, fontSize: 14, color: "#193238" },
  loginButton: { marginTop: 30, borderRadius: 10, backgroundColor: "#0c3b73", height: 48, justifyContent: "center" },
  resendOTP: { fontSize: 14, color: "#007BFF", textDecorationLine: "underline", textAlign: "center", marginBottom: 20 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.4)" },
  loaderContainer: { padding: 20, backgroundColor: "#fff", borderRadius: 10 },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
  topHeader: { width: "100%" },
  loginSection: { width: "100%", paddingHorizontal: 10 },
  logo: { width: "100%", height: "100%", resizeMode: "contain" }
});

export default EnterNumberScreen;
