import React, { useState } from "react";
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
import axios from "axios";
import { useTheme } from "../../Constants/Theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSnackbar } from "../../Store/SnackbarContext"; // ✅ Correct hook
import { safeGet } from "../../Util/UtilApi"; // add this
import { api } from "../../Util/UtilApi"; // or use api.post

const FeedbackandHelp = () => {
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar(); // ✅ useSnackbar hook
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [concern, setConcern] = useState("");
  const [description, setDescription] = useState("");
  const [fileUri, setFileUri] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const concerns = [
    { label: "Comment", value: "Comment" },
    { label: "Issue", value: "Issue" },
    { label: "Suggestion", value: "Suggestion" },
    { label: "Other", value: "Other" },
  ];

  // ---------------- PICK FILE ----------------
  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setFileUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error("File picker error:", err);
      showSnackbar("Failed to pick the file.", "error");
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!name || !mobile || !email || !concern || !description) {
      showSnackbar("Please fill all required fields.", "warning");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("email", email);
      formData.append("feedbackType", concern);
      formData.append("description", description);

      if (fileUri) {
        const filename = fileUri.split("/").pop();
        const type = filename.endsWith(".png")
          ? "image/png"
          : filename.endsWith(".jpg") || filename.endsWith(".jpeg")
          ? "image/jpeg"
          : "application/octet-stream";

        formData.append("screenShot", {
          uri: fileUri,
          type,
          name: filename,
        });
      }

      const res = await api.post("/feedback/createFeedBack", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 10000,
});
      if (res.data) {
        showSnackbar("Feedback submitted successfully!", "success");
        setName("");
        setMobile("");
        setEmail("");
        setConcern("");
        setDescription("");
        setFileUri(null);
      }
    } catch (error) {
      console.error("Feedback submit error:", error);
      showSnackbar("Failed to submit feedback. Check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const styles = feedbackStyles(colors);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>
          We’d love to hear your thoughts, suggestions, or issues so we can improve.
        </Text>

        <TextInput
          label="Name*"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          activeOutlineColor={colors.primary}
          outlineColor={colors.border}
        />

        <TextInput
          label="Mobile Number*"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          mode="outlined"
          style={styles.input}
          activeOutlineColor={colors.primary}
          outlineColor={colors.border}
        />

        <TextInput
          label="Email*"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
          activeOutlineColor={colors.primary}
          outlineColor={colors.border}
        />

        {/* Dropdown */}
        <TouchableOpacity
          style={[
            styles.dropdown,
            { borderColor: concern ? colors.primary : colors.border },
          ]}
          onPress={() => setDropdownVisible(true)}
        >
          <Text
            style={{
              color: concern ? colors.text : colors.muted,
              paddingHorizontal: 10,
              paddingVertical: 14,
            }}
          >
            {concern
              ? concerns.find((c) => c.value === concern)?.label
              : "Select Feedback Type*"}
          </Text>
        </TouchableOpacity>

        {/* Modal Dropdown */}
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
            <View style={[styles.dropdownContainer, { backgroundColor: colors.surface }]}>
              <FlatList
                data={concerns}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setConcern(item.value);
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

        <TextInput
          label="Description*"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={5}
          style={styles.textarea}
          activeOutlineColor={colors.primary}
          outlineColor={colors.border}
        />

        <TouchableOpacity style={styles.uploadBox} onPress={pickFile}>
          {fileUri ? (
            <Image source={{ uri: fileUri }} style={styles.preview} />
          ) : (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons
                name="file-upload-outline"
                size={40}
                color="#007BFF"
              />
              <Text style={[styles.uploadText, { color: "#007BFF" }]}>
                Upload a Screenshot (Optional)
              </Text>
            </View>
          )}
        </TouchableOpacity>

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
  );
};

// ---------------- STYLES ----------------
const feedbackStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: colors.background,
      padding: 0,
    },
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
      marginBottom: 12,
      backgroundColor: colors.surface,
      borderRadius: 10,
    },
    dropdown: {
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 12,
      backgroundColor: colors.surface,
    },
    textarea: {
      height: 120,
      marginBottom: 12,
      backgroundColor: colors.surface,
      borderRadius: 10,
    },
    uploadBox: {
      borderWidth: 1,
      borderStyle: "dashed",
      borderRadius: 10,
      height: 150,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 25,
      borderColor: colors.border,
      backgroundColor: colors.helpBackground,
    },
    uploadText: {
      fontWeight: "500",
      fontSize: 15,
    },
    preview: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
    },
    submitButton: {
      borderRadius: 10,
      paddingVertical: 8,
      backgroundColor: colors.accent,
      marginTop: 10,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
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
