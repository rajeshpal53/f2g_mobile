import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Divider, Avatar, Button, useTheme as usePaperTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../Constants/Theme"; // your custom theme hook
import { selectLoanFromId } from "../../Util/UtilApi";

const BookingDetailsScreen = ({ route, navigation }) => {
  const { booking, isAdmin } = route.params;
  const { colors, isDark } = useTheme();
  const paperTheme = usePaperTheme();

  if (!booking) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text variant="titleMedium" style={{ color: colors.text }}>
          No booking data found
        </Text>
      </View>
    );
  }

  const bookedByUser = booking.bookedByUser;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Card style={[styles.headerCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Icon
            size={50}
            icon="file-document-outline"
            color="white"
            style={{ backgroundColor: colors.primary }}
          />
          <View style={{ marginLeft: 15 }}>
            <Text variant="titleMedium" style={[styles.headerTitle, { color: colors.text }]}>
              Booking ID: {booking.bookId}
            </Text>
            <Text variant="bodyMedium" style={[styles.statusText, { color: colors.success }]}>
              Status: {booking.status?.status || "Pending"}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Customer Info */}
      <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
        <Card.Title
          title="Customer Details"
          titleStyle={{ color: colors.text }}
          left={(props) => (
            <MaterialIcons name="person" size={26} color={colors.primary} />
          )}
        />
        <Divider style={{ backgroundColor: colors.border }} />
        <Card.Content>
          <DetailRow label="Name" value={booking.user?.name} colors={colors} />
          <DetailRow label="Mobile" value={booking.user?.mobile} colors={colors} />
          <DetailRow label="Address" value={booking.user?.address} colors={colors} />
        </Card.Content>
      </Card>

      {/* Booking Info */}
      <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
        <Card.Title
          title="Booking Information"
          titleStyle={{ color: colors.text }}
          left={(props) => (
            <MaterialIcons name="event-note" size={26} color={colors.primary} />
          )}
        />
        <Divider style={{ backgroundColor: colors.border }} />
        <Card.Content>
          <DetailRow label="Loan Type" value={selectLoanFromId[booking.loantypefk]} colors={colors} />
          <DetailRow label="Loan Account Number" value={booking.loanAccountNumber} colors={colors} />
          <DetailRow label="Booking Amount" value={`₹${booking.bookingAmount}`} colors={colors} />
          <DetailRow label="Tentative Bill" value={`₹${booking.tentativeBillAmount}`} colors={colors} />
          <DetailRow label="Booked By" value={booking.bookedBy || "N/A"} colors={colors} />
          <DetailRow label="Address" value={booking.address} colors={colors} />
        </Card.Content>
      </Card>

      {/* Booked By User Info */}
      {bookedByUser && (
        <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Card.Title
            title="Booked By"
            titleStyle={{ color: colors.text }}
            left={(props) => (
              <MaterialIcons name="supervisor-account" size={26} color={colors.primary} />
            )}
          />
          <Divider style={{ backgroundColor: colors.border }} />
          <Card.Content>
            <DetailRow label="Mobile" value={bookedByUser.mobile} colors={colors} />
            {bookedByUser.name && <DetailRow label="Name" value={bookedByUser.name} colors={colors} />}
            {bookedByUser.email && <DetailRow label="Email" value={bookedByUser.email} colors={colors} />}
            {bookedByUser.address && <DetailRow label="Address" value={bookedByUser.address} colors={colors} />}
          </Card.Content>
        </Card>
      )}

      {/* Edit Button */}
      <Button
        disabled={!isAdmin && booking?.statusfk > 2}
        onPress={() => navigation.navigate("BookingScreen", { editBooking: booking, isAdmin })}
        mode="contained"
        labelStyle={{ fontSize: 16 }}
        icon="pencil"
        style={{
          width: "80%",
          alignSelf: "center",
          borderRadius: 8,
          opacity: !isAdmin && booking?.statusfk > 2 ? 0.6 : 1,
          backgroundColor: colors.main,
        }}
      >
        Edit Booking
      </Button>
    </ScrollView>
  );
};

const DetailRow = ({ label, value, colors }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    <Text style={[styles.value, { color: colors.text }]}>{value || "-"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCard: {
    borderRadius: 16,
    marginBottom: 18,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "700",
    flexWrap: "wrap",
  },
  statusText: {
    marginTop: 3,
    fontWeight: "600",
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontWeight: "600",
  },
  value: {
    fontWeight: "500",
    maxWidth: "55%",
    textAlign: "right",
  },
});

export default BookingDetailsScreen;
