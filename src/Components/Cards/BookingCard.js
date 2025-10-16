import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import {colorByStatusFk,statusById,selectLoanFromId} from "../../Util/UtilApi"
const BookingCard = ({ booking,navigation,isAdmin }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={()=>{navigation?.navigate("BookingDetailsScreen",{booking:booking,isAdmin})}}>
      <Card.Content style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{booking.name}</Text>
            <Text style={styles.subId}>Book ID: {booking.bookId}</Text>
            <Text style={styles.subId}>Loan No: {booking.loanAccountNumber}</Text>
            <Text style={styles.loanValue}># {selectLoanFromId[booking.loantypefk]}</Text>
          </View>
         <View style={[styles.statusBadge, { backgroundColor: colorByStatusFk(booking?.statusfk) }]}>
                    <Text style={styles.statusText}>{statusById[booking?.statusfk]}</Text>
                  </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>

          <View style={styles.infoRow}>
            <MaterialIcons name="account-balance-wallet" size={14} color="#2563EB" />
            <Text style={styles.label}>BookingAmount:</Text>
            <Text style={styles.value}>₹{booking.bookingAmount.toLocaleString()}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="receipt-long" size={14} color="#2563EB" />
            <Text style={styles.label}>Tentative Bill:</Text>
            <Text style={styles.value}>₹{booking.tentativeBillAmount.toLocaleString()}</Text>
          </View>
        </View>



        {/* Address */}
        <Text style={styles.address} numberOfLines={1}>
          {booking.address}
        </Text>

        {/* Remark */}
        <Text style={styles.remark} numberOfLines={1}>
          {booking.remark}
        </Text>

        {/* Footer Date */}
        <Text style={styles.dateText}>
          {new Date(booking.createdAt).toLocaleDateString()}
        </Text>
      </Card.Content>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
    paddingHorizontal:5
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
    color: "#111827",
  },
  subId: {
    color: "#6B7280",
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
    color: "#374151",
  },
  value: {
    marginLeft: 4,
    fontWeight: "600",
    color: "#111827",
    fontSize: 12,
  },
  loanValue:{
       marginLeft: 4,
    fontWeight: "800",
    color: "#111827",
    fontSize: 13,
    fontStyle:"italic"
  },
  address: {
    fontSize: 12,
    color: "#374151",
    marginTop: 2,
  },
  remark: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  dateText: {
    marginTop: 3,
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "right",
  },
});

export default BookingCard;
