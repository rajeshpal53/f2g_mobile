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
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ConfirmModal from "../Components/Modal/ConfirmModal";
import { useSnackbar } from "../Store/SnackbarContext";
import ServiceImagePicker from "../UI/ServiceImagePicker";
import GenericDropdown from "../UI/DropDown/GenericDropDown";
import { API_BASE_URL, NORM_URL } from "../Util/UtilApi";
import { useTheme } from "../Constants/Theme";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(2, "At least 2 characters"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .min(10, "Must be at least 10 digits")
    .max(15, "Must be at most 15 digits"),
  gender: Yup.string().required("Gender is required").nullable(),
  address: Yup.string().required("Address is required").min(4, "At least 4 characters"),
  dob: Yup.string()
    .required("DOB is required")
    .test("min-age", "You must be at least 5 years old", function (value) {
      if (!value) return false;
      const enteredDate = new Date(value);
      if (isNaN(enteredDate.getTime())) return false;
      const today = new Date();
      const minAgeDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
      return enteredDate <= minAgeDate;
    }),
});

export default function EditProfileScreen({ navigation }) {
  const { t } = useTranslation();
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
    dob: new Date(),
    address: "",
    profileImage: null,
  });

  useEffect(() => {
    const setInitialDataFunc = (data) => {
      setInitialData({
        name: data?.user?.name || "",
        mobile: data?.user?.mobile || "",
        email: data?.user?.email || "",
        gender: data?.user?.gender || "",
        dob: data?.user?.dob ? new Date(data.user.dob) : new Date(),
        address: data?.user?.address || "",
        profileImage: data?.user?.profilePicurl
          ? {
              uri: `${NORM_URL.replace(/\/$/, "")}/${data.user.profilePicurl.replace(/^\//, "")}`,
              name: "profilePic.jpeg",
              type: "image/jpeg",
            }
          : null,
      });
    };

    if (routeData) {
      setInitialDataFunc({ user: routeData });
    } else {
      setInitialDataFunc(userData);
    }
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()} ${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;
  };

  const editHandler = async () => {
    try {
      setModalVisible(false);
      setIsLoading(true);

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
      showSnackbar(t("Profile updated successfully!"), "success");

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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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

              if (values.profileImage) {
                formData.append("profilePicurl", values.profileImage);
              }

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
                />

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
                  containerStyle={{ marginTop: 10 }}
                  pickerContainerStyle={{
                    borderColor: colors.text,
                    backgroundColor: "#FFFFFF",
                    paddingbottom:-10,
                  }}
                  pickerStyle={{ color: colors.text }}
                  fontStyles={{ fontSize: 14, color: colors.text }}
                />
                {touched.gender && errors.gender && (
                  <Text style={styles.errorText}>{errors.gender}</Text>
                )}

                {/* DOB */}
                <View>
                  <RNText style={[styles.label, { color: colors.text }]}>Date of Birth*</RNText>
                  <Pressable
                    onPress={() => setShowDateTimePicker(true)}
                    style={styles.dateRow}
                  >
                    <Icon name="calendar" size={22} color={colors.accent} />
                    <RNText style={[styles.dateText, { color: colors.text }]}>
                      {values?.dob ? formatDate(values.dob) : "Select Date"}
                    </RNText>
                  </Pressable>
                  {showDateTimePicker && (
                    <DateTimePicker
                      value={values.dob || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDateTimePicker(false);
                        if (selectedDate) setFieldValue("dob", selectedDate);
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
  scrollContent: { padding: 20, paddingBottom: 60 },
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
