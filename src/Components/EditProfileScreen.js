import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Text as RNText,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import UserDataContext from "../Store/UserDataContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ConfirmModal from "../Components/Modal/ConfirmModal";
import { useSnackbar } from "../Store/SnackbarContext";
import ServiceImagePicker from "../UI/ServiceImagePicker";
import GenericDropdown from "../UI/DropDown/GenericDropDown";
import { API_BASE_URL, NORM_URL } from "../Util/UtilApi";
import { useTheme } from "../Constants/Theme";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "At least 2 characters"),

  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10,15}$/, "Enter a valid mobile number"),

  email: Yup.string()
    .nullable()
    .email("Enter a valid email address"),

  gender: Yup.string().required("Gender is required").nullable(),

  address: Yup.string()
    .required("Address is required")
    .min(4, "At least 4 characters"),

 pincode: Yup.string()
  .required("Pincode is required")
  .matches(
    /^(?!000000)(?!.*(\d)\1{5})(^[1-9][0-9]{5}$)/,
    "Enter a valid 6-digit Indian pincode"
  ),

  dob: Yup.date()
    .typeError("Select a valid date")
    .required("Date of birth is required")
    .test("min-age", "You must be at least 5 years old", function (value) {
      if (!value) return false;
      const enteredDate = new Date(value);
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 5,
        today.getMonth(),
        today.getDate()
      );
      return enteredDate <= minAgeDate;
    }),
});
const formatUrl = (url, imageDetail) => {
    if (!url) return null; // Handle null cases

    // Ensure no double slashes in the final URL
    const formattedUrl = `${NORM_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;

    const imageFile = {
      uri: formattedUrl,
      name: `${imageDetail}.jpeg`,
      type: `image/jpeg`,
    };

    console.log("✅ Corrected Image URL:", imageFile);
    return imageFile;
  };


export default function EditProfileScreen({ navigation }) {
  const { showSnackbar } = useSnackbar();
  const { saveUserData, userData } = useContext(UserDataContext);
  const { colors } = useTheme();

  const routeData = useRoute().params?.item || null;
  const onGoBack = useRoute().params?.onGoBack || null;

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [postData, setPostData] = useState({});
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const [initialData, setInitialData] = useState({
    name: "",
    mobile: "",
    email: "",
    gender: "",
    dob: null,
    address: "",
    pincode: "",
    profileImage: null,
  });


  useEffect(() => {
  const setInitialDataFunc = (data) => {
    const user = data?.user || {};

  const fetchedDob = (() => {
  if (!user.dob) return null;

  // Normalize capitalization ("october" → "October")
  const normalizedDob = user.dob
    .trim()
    .replace(/\b([a-z])/g, (char) => char.toUpperCase());

  // Try to parse formats like "27 October 2007" or "27-10-2007"
  let parsedDate = new Date(normalizedDob);
  if (isNaN(parsedDate)) {
    // Try DD-MM-YYYY or DD/MM/YYYY fallback
    const parts = normalizedDob.split(/[-/ ]/);
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const monthIndex = monthNames.findIndex(
        (m) => m.toLowerCase().startsWith(month.toLowerCase())
      );
      if (monthIndex >= 0) parsedDate = new Date(year, monthIndex, day);
      else if (!isNaN(month)) parsedDate = new Date(year, month - 1, day);
    }
  }

  return isNaN(parsedDate) ? null : parsedDate;
})();


    setInitialData({
      name: user.name || "",
      mobile: user.mobile || "",
      email: user.email || "",
      gender: user.gender
        ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase()
        : "",
      dob: fetchedDob,
      address: user.address || "",
      pincode: user.pincode?.toString() || "",
      profileImage: user?.profilePicurl
        ? formatUrl(user?.profilePicurl, "profilePicurl")
        : null,
    });
  };

  if (routeData) setInitialDataFunc({ user: routeData });
  else setInitialDataFunc(userData);
}, []);

  const formatShowDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "Select Date";
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return "";
    return `${d.getDate()} ${d.toLocaleString("default", {
      month: "long",
    })} ${d.getFullYear()}`;
  };

  const editHandler = async () => {
    try {
      setModalVisible(false);
      setIsLoading(true);
      console.log(postData,"PostData")
      const response = await axios.post(
        `${API_BASE_URL}users/upsertOnlyUserProfileImg`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = {
        token: userData.token,
        user: response?.data,
      };

      saveUserData(updatedUser);
      showSnackbar("Profile updated successfully!", "success");

      if (onGoBack) onGoBack(response?.data);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={initialData}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setModalVisible(true);
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("mobile", values.mobile);
              formData.append("email", values.email || "");
              formData.append("gender", values.gender);
              formData.append("address", values.address);
              formData.append("dob", formatDate(values.dob));
              formData.append("pincode", values.pincode);

              if (values.profileImage)
                formData.append("profilePicurl", values.profileImage);

              setPostData(formData);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={{ gap: 20 }}>
                {/* Profile Image Picker */}
                <ServiceImagePicker
                  image={values?.profileImage}
                  label="Profile Image"
                  isAdmin={true}
                  setFieldValue={setFieldValue}
                  uploadFieldName={"profileImage"}
                  type={"rounded"}
                />

                {/* Name */}
                <TextInput
                  label="Name*"
                  mode="outlined"
                  style={styles.input}
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  error={touched.name && errors.name}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}

                {/* Mobile */}
                <TextInput
                  label="Mobile Number*"
                  mode="outlined"
                  style={styles.input}
                  value={values.mobile}
                  disabled
                />

                {/* Email */}
                <TextInput
                  label="Email"
                  mode="outlined"
                  style={styles.input}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={touched.email && errors.email}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* Gender Dropdown */}
                <GenericDropdown
                  label="Gender*"
                  selectedValue={values.gender}
                  onValueChange={(value) => setFieldValue("gender", value)}
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                  placeholder="Select Gender"
                />
                {touched.gender && errors.gender && (
                  <Text style={styles.errorText}>{errors.gender}</Text>
                )}

                {/* DOB */}
                <View>
                  <RNText style={[styles.label, { color: colors.text }]}>
                    Date of Birth*
                  </RNText>
                  <Pressable
                    onPress={() => setShowDateTimePicker(true)}
                    style={styles.dateRow}
                  >
                    <Icon name="calendar" size={22} color={colors.accent} />
                    <RNText style={[styles.dateText, { color: colors.text }]}>
                      {formatShowDate(values.dob)}
                    </RNText>
                  </Pressable>

                  {showDateTimePicker && (
                    <DateTimePicker
                      value={values.dob || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDateTimePicker(false);
                        if (selectedDate)
                          setFieldValue("dob", new Date(selectedDate));
                      }}
                    />
                  )}
                  {touched.dob && errors.dob && (
                    <Text style={styles.errorText}>{errors.dob}</Text>
                  )}
                </View>

                {/* Address */}
                <TextInput
                  label="Address*"
                  mode="outlined"
                  style={styles.input}
                  value={values.address}
                  onChangeText={handleChange("address")}
                  onBlur={handleBlur("address")}
                  error={touched.address && errors.address}
                />
                {touched.address && errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}

                {/* Pincode */}
                <TextInput
                  label="Pincode*"
                  mode="outlined"
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={values.pincode}
                  onChangeText={(text) => {
                    // only allow up to 6 digits and no letters
                    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
                    setFieldValue("pincode", cleaned);
                  }}
                  onBlur={handleBlur("pincode")}
                  error={touched.pincode && errors.pincode}
                />
                {touched.pincode && errors.pincode && (
                  <Text style={styles.errorText}>{errors.pincode}</Text>
                )}

                {/* Update Button */}
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={[styles.button, { backgroundColor: colors.accent }]}
                  labelStyle={{ color: colors.card, fontWeight: "600" }}
                >
                  Update Profile
                </Button>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirm Modal */}
      {modalVisible && (
        <ConfirmModal
          visible={modalVisible}
          message="Are you sure you want to update your profile?"
          heading="Confirm Update"
          setVisible={setModalVisible}
          handlePress={editHandler}
          buttonTitle="Update"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 80 },
  input: { backgroundColor: "transparent" },
  label: { fontSize: 14, marginBottom: 6 },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  dateText: { marginLeft: 10, fontSize: 15 },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
  button: { borderRadius: 10, paddingVertical: 8, elevation: 3 },
});
