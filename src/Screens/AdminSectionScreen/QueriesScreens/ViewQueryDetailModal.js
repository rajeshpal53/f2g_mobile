import React from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { API_BASE_URL } from "../../../Util/UtilApi";
import { useTheme } from "../../../Constants/Theme";

const ViewQueryDetailModal = ({ item, queryDetailModalVisible, toggleModal }) => {
  const { colors } = useTheme();
  if (!item) return null;

  const fullImageUrl = item?.screenShotUrl
    ? `${API_BASE_URL}${item.screenShotUrl}`
    : null;

  return (
    <Modal visible={queryDetailModalVisible} transparent animationType="slide">
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.primary }]}>Query Details</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Type:</Text>
          <Text style={[styles.text, { color: colors.text }]}>{item.feedbackType}</Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Description:</Text>
          <Text style={[styles.text, { color: colors.text }]}>{item.description}</Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Name:</Text>
          <Text style={[styles.text, { color: colors.text }]}>{item.name}</Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Email:</Text>
          <Text style={[styles.text, { color: colors.text }]}>{item.email}</Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Mobile:</Text>
          <Text style={[styles.text, { color: colors.text }]}>{item.mobile}</Text>

          {fullImageUrl && (
            <Image
              source={{ uri: fullImageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={toggleModal}>
            <Text style={[styles.buttonText, { color: colors.surface }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  container: {
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    marginTop: 6,
  },
  text: {
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
});

export default ViewQueryDetailModal;
