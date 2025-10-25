import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useTheme } from "../../Constants/Theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSnackbar } from "../../Store/SnackbarContext";
import { API_BASE_URL } from "../../Util/UtilApi";
import axios from "axios";
import UserDataContext from "../../Store/UserDataContext";
import { Formik } from "formik";
import * as Yup from "yup";

// ✅ Validation Schema
const FeedbackSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
    .required("Mobile number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  concern: Yup.string().required("Select a feedback type"),
  description: Yup.string()
    .min(5, "Description should be at least 5 characters")
    .required("Description is required"),
});

// ✅ Compress image before upload
const compressImageToTargetSize = async (uri, targetMB = 1) => {
  try {
    const targetSize = targetMB * 1024 * 1024; // bytes
    let compressQuality = 1.0;
    let resized = await ImageManipulator.manipulateAsync(uri, [], {
      compress: compressQuality,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    while (resized && resized.uri && (await getFileSize(resized.uri)) > targetSize && compressQuality > 0.1) {
      compressQuality -= 0.1;
      resized = await ImageManipulator.manipulateAsync(uri, [], {
        compress: compressQuality,
        format: ImageManipulator.SaveFormat.JPEG,
      });
    }

    return resized.uri;
  } catch (err) {
    console.error("Compression error:", err);
    return uri;
  }
};

// ✅ Helper to get file size
const getFileSize = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob.size;
};

const FeedbackandHelp = ({navigation}) => {
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();
  const { userData } = useContext(UserDataContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fileUri, setFileUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const concerns = [
    { label: "Comment", value: "Comment" },
    { label: "Bug Report", value: "Bug Report" },
    { label: "Suggestion", value: "Suggestion" },
    { label: "Questions", value: "Questions" },
    { label: "Complaint", value: "Complaint" },
     { label: "Feature Request", value: "Feature Request" },
     {label :"Others", value:"Others"}

  ];

  'Complaint', 'Questions', 'Suggestion', 'Comment', 'Feature Request', 'Bug Report'

  // ---------------- PICK FILE ----------------
  const pickFile = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access the gallery is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // ✅ Modern usage
        allowsEditing: true,
        quality: 1,
        aspect: [16, 9],
      });

      if (pickerResult.canceled || !pickerResult.assets?.length) return;

      const selectedImage = pickerResult.assets[0];

      const compressedUri = await compressImageToTargetSize(selectedImage.uri, 1);

      const imageData = {
        uri: compressedUri,
        name: selectedImage.fileName || "image.jpg",
        type: selectedImage.mimeType || "image/jpeg",
      };

      setFileUri(imageData);
    } catch (err) {
      console.error("Image picker error:", err);
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("mobile", values.mobile);
      formData.append("email", values.email);
      formData.append("feedbackType", values.concern);
      formData.append("description", values.description);

      if (fileUri?.uri) {
        formData.append("screenShotUrl", {
          uri: fileUri.uri,
          type: fileUri.type,
          name: fileUri.name,
        });
      }

      console.log(formData,"formData")
      const response = await axios.post(
        `${API_BASE_URL}feedback/createFeedBack`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" ,
         Authorization:`Bearer ${userData?.token}` } }
      );

      if (response) {
        showSnackbar("Feedback submitted successfully!", "success");
        navigation.navigate("Bottom",{screen:"Profile"})
        resetForm();
        setFileUri(null);
      }
    } catch (error) {
      console.error("Feedback submit error:", error);
      showSnackbar("Failed to submit feedback.", "error");
    } finally {
      setLoading(false);
    }
  };

  const styles = feedbackStyles(colors);

  return (
    <Formik
      initialValues={{
        name: "",
        mobile: "",
        email: "",
        concern: "",
        description: "",
      }}
      validationSchema={FeedbackSchema}
      onSubmit={handleSubmit}
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
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Help & Support</Text>
            <Text style={styles.subtitle}>
              We’d love to hear your thoughts, suggestions, or issues so we can
              improve.
            </Text>

            {/* Name */}
            <TextInput
              label="Name*"
              value={values.name}
              onChangeText={(text) => {
                if (/^[A-Za-z\s]{0,30}$/.test(text)) setFieldValue("name", text);
              }}
              onBlur={handleBlur("name")}
              mode="outlined"
              style={styles.input}
              activeOutlineColor={colors.primary}
              outlineColor={colors.border}
              error={touched.name && errors.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.helperText}>{errors.name}</Text>
            )}

            {/* Mobile */}
            <TextInput
              label="Mobile Number*"
              value={values.mobile}
              onChangeText={(text) => {
                if (/^\d{0,10}$/.test(text)) setFieldValue("mobile", text);
              }}
              onBlur={handleBlur("mobile")}
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.input}
              activeOutlineColor={colors.primary}
              outlineColor={colors.border}
              error={touched.mobile && errors.mobile}
            />
            {touched.mobile && errors.mobile && (
              <Text style={styles.helperText}>{errors.mobile}</Text>
            )}

            {/* Email */}
            <TextInput
              label="Email*"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              keyboardType="email-address"
              mode="outlined"
              style={styles.input}
              activeOutlineColor={colors.primary}
              outlineColor={colors.border}
              error={touched.email && errors.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.helperText}>{errors.email}</Text>
            )}

            {/* Concern Dropdown */}
            <TouchableOpacity
              style={[
                styles.dropdown,
                { borderColor: values.concern ? colors.primary : colors.border },
              ]}
              onPress={() => setDropdownVisible(true)}
            >
              <Text
                style={{
                  color: values.concern ? colors.text : colors.muted,
                  paddingHorizontal: 10,
                  paddingVertical: 14,
                }}
              >
                {values.concern
                  ? concerns.find((c) => c.value === values.concern)?.label
                  : "Select Feedback Type*"}
              </Text>
            </TouchableOpacity>
            {touched.concern && errors.concern && (
              <Text style={styles.helperText}>{errors.concern}</Text>
            )}

            {/* Dropdown Modal */}
            <Modal
              visible={dropdownVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setDropdownVisible(false)}
            >
              <Pressable
                style={[styles.modalOverlay, { backgroundColor: colors.modalBackground }]}
                onPress={() => setDropdownVisible(false)}
              >
                <View
                  style={[styles.dropdownContainer, { backgroundColor: colors.surface }]}
                >
                  <FlatList
                    data={concerns}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setFieldValue("concern", item.value);
                          setDropdownVisible(false);
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text style={{ color: colors.text }}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </Pressable>
            </Modal>

            {/* Description */}
            <TextInput
              label="Description*"
              value={values.description}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
              mode="outlined"
              multiline
              numberOfLines={5}
              style={styles.textarea}
              activeOutlineColor={colors.primary}
              outlineColor={colors.border}
              error={touched.description && errors.description}
            />
            {touched.description && errors.description && (
              <Text style={styles.helperText}>{errors.description}</Text>
            )}

            {/* Upload Screenshot */}
            <View style={styles.uploadBox}>
  {fileUri?.uri ? (
    <View style={{ width: "100%", height: "100%" }}>
      {/* Uploaded Image */}
      <Image source={{ uri: fileUri.uri }} style={styles.preview} />

      {/* ❌ Cross Icon */}
      <TouchableOpacity
        style={styles.removeIcon}
        onPress={() => setFileUri(null)}
      >
        <MaterialCommunityIcons name="close-circle" size={26} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      style={styles.uploadContent}
      onPress={pickFile}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons
        name="file-upload-outline"
        size={40}
        color="#007BFF"
      />
      <Text style={[styles.uploadText, { color: "#007BFF" }]}>
        Upload a Screenshot (Optional)
      </Text>
    </TouchableOpacity>
  )}
</View>


            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={loading}
              disabled={loading}
              labelStyle={{ fontWeight: "600", fontSize: 16 }}
            >
              Submit
            </Button>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

const feedbackStyles = (colors) =>
  StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: colors.background, padding: 0 },
    card: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    title: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.text,
      textAlign: "center",
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 25,
      lineHeight: 20,
    },
    input: {
      marginBottom: 4,
      backgroundColor: colors.surface,
      borderRadius: 10,
    },
    helperText: {
      color: "red",
      fontSize: 12,
      marginBottom: 10,
      marginLeft: 4,
    },
    dropdown: {
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 4,
      backgroundColor: colors.surface,
    },
    textarea: {
      height: 120,
      marginBottom: 4,
      backgroundColor: colors.surface,
      borderRadius: 10,
    },
    uploadBox: {
  borderWidth: 1,
  borderStyle: "dashed",
  borderRadius: 10,
  height: 160,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 25,
  borderColor: colors.border,
  backgroundColor: colors.helpBackground,
  overflow: "hidden",
  position: "relative",
},

uploadContent: {
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
},

preview: {
  width: "100%",
  height: "100%",
  borderRadius: 10,
  resizeMode: "cover",
},

removeIcon: {
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: "#FFF",
  borderRadius: 50,
  padding: 2,
  elevation: 4,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.25,
  shadowRadius: 2,
},

uploadText: {
  fontWeight: "500",
  fontSize: 15,
  marginTop: 6,
  textAlign: "center",
},

    
    submitButton: {
      borderRadius: 10,
      paddingVertical: 8,
      backgroundColor: colors.accent,
      marginTop: 10,
    },
    modalOverlay: { flex: 1, justifyContent: "center", padding: 20 },
    dropdownContainer: {
      borderRadius: 12,
      paddingVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: colors.surface,
    },
    dropdownItem: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
   
    
  });

export default FeedbackandHelp;
