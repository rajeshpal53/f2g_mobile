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
  isResolved,
}) => {
  const { colors } = useTheme(); // use theme

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.type, { color: colors.main }]}>{item.feedbackType}</Text>
        <Text style={[styles.date, { color: colors.muted }]}>{formatDate(item.createdAt)}</Text>
      </View>

      <Text style={[styles.desc, { color: colors.text }]}>{item.description}</Text>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            setItem(item);
            toggleModal();
          }}
        >
          <Text style={[styles.link, { color: colors.main }]}>View Details</Text>
        </TouchableOpacity>

        {!isResolved && (
          <TouchableOpacity
            onPress={() => {
              setQueryToAct(item);
              setConfirmModalVisible(true);
            }}
          >
            <Text style={[styles.resolve, { color: colors.danger }]}>Mark Resolved</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  type: {
    fontWeight: "600",
    fontSize: 16,
  },
  date: {
    fontSize: 12,
  },
  desc: {
    marginVertical: 8,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  link: {
    fontWeight: "bold",
  },
  resolve: {
    fontWeight: "bold",
  },
});

export default QueryCard;
