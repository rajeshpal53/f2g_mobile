import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { formatDate } from "../../../Util/UtilApi";
import { useTheme } from "../../../Constants/Theme";

const QueryCard = ({
  item,
  setQueryToAct,
  setConfirmModalVisible,
  setItem,
  toggleModal,
}) => {
  const { colors } = useTheme();

  if (!item) return null; // Safety check

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.main }]}>
          {item.name || "N/A"}
        </Text>
        <Text style={[styles.date, { color: colors.muted }]}>
          {formatDate(item.createdAt)}
        </Text>
      </View>

      {/* Type */}
      <View style={styles.typeContainer}>
        <Text style={[styles.label, { color: colors.muted }]}>Type:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{item.feedbackType || "N/A"}</Text>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.muted }]}>Email:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.email || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.muted }]}>Mobile:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.mobile || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.muted }]}>Description:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.description || "N/A"}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            setItem(item);
            toggleModal();
          }}
        >
          <Text style={[styles.link, { color: colors.primary }]}>View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setQueryToAct(item);
            setConfirmModalVisible(true);
          }}
        >
          <Text style={[styles.resolve, { color: colors.danger }]}>Mark Resolved</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: { fontWeight: "600", fontSize: 16 },
  date: { fontSize: 12 },
  typeContainer: { flexDirection: "row", marginVertical: 4 },
  infoContainer: { marginVertical: 8 },
  infoRow: { flexDirection: "row", marginVertical: 2 },
  label: { fontWeight: "600", width: 80 },
  value: { flex: 1 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  link: { fontWeight: "bold" },
  resolve: { fontWeight: "bold" },
});

export default QueryCard;
