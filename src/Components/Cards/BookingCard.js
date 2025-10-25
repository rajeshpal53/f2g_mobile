import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { colorByStatusFk, statusById, selectLoanFromId } from "../../Util/UtilApi";
import { useTheme } from "../../Constants/Theme"; // <-- Import custom hook

const BookingCard = ({ booking, navigation, isAdmin }) => {
  const { colors } = useTheme(); // <-- Get theme colors

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
      onPress={() => navigation?.navigate("BookingDetailsScreen", { booking, isAdmin })}
    >
      <Card.Content style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.name, { color: colors.text }]}>{booking.name}</Text>
            <Text style={[styles.subId, { color: colors.textSecondary }]}>
              Book ID: {booking.bookId}
            </Text>
            <Text style={[styles.subId, { color: colors.textSecondary }]}>
              Loan No: {booking.loanAccountNumber}
            </Text>
            <Text style={[styles.loanValue, { color: colors.primary }]}>
              # {selectLoanFromId[booking.loantypefk]}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colorByStatusFk(booking?.statusfk) },
            ]}
          >
            <Text style={styles.statusText}>{statusById[booking?.statusfk]}</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <MaterialIcons name="account-balance-wallet" size={14} color={colors.accent} />
            <Text style={[styles.label, { color: colors.textSecondary }]}>BookingAmount:</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              ₹{booking.bookingAmount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="receipt-long" size={14} color={colors.accent} />
            <Text style={[styles.label, { color: colors.textSecondary }]}>Tentative Bill:</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              ₹{booking.tentativeBillAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Address */}
        <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
          {booking.address}
        </Text>

        {/* Remark */}
        <Text style={[styles.remark, { color: colors.muted }]} numberOfLines={1}>
          {booking.remark}
        </Text>

        {/* Footer Date */}
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
          {new Date(booking.createdAt).toLocaleDateString()}
        </Text>
      </Card.Content>
    </TouchableOpacity>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    paddingHorizontal: 5,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
  },
  subId: {
    fontSize: 11,
    marginTop: 1,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 11,
  },
  infoContainer: {
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1,
  },
  label: {
    marginLeft: 4,
    fontSize: 12,
  },
  value: {
    marginLeft: 4,
    fontWeight: "600",
    fontSize: 12,
  },
  loanValue: {
    marginLeft: 4,
    fontWeight: "800",
    fontSize: 13,
    fontStyle: "italic",
  },
  address: {
    fontSize: 12,
    marginTop: 2,
  },
  remark: {
    fontSize: 12,
    marginTop: 1,
  },
  dateText: {
    marginTop: 3,
    fontSize: 11,
    textAlign: "right",
  },
});
