import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Divider, Avatar, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../Constants/Theme";
import { selectLoanFromId } from "../../Util/UtilApi";
const BookingDetailsScreen = ({ route,navigation }) => {
  const { booking,isAdmin } = route.params;
  const theme = useTheme();

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text variant="titleMedium">No booking data found</Text>
      </View>
    );
  }

  const bookedByUser = booking.bookedByUser;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Icon
            size={50}
            icon="file-document-outline"
            color="white"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={{ marginLeft: 15 }}>
            <Text variant="titleMedium" style={styles.headerTitle}>
              Booking ID: {booking.bookId}
            </Text>
            <Text variant="bodyMedium" style={styles.statusText}>
              Status: {booking.status?.status || "Pending"}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Customer Info */}
      <Card style={styles.sectionCard}>
        <Card.Title
          title="Customer Details"
          left={(props) => (
            <MaterialIcons name="person" size={26} color={theme.colors.primary} />
          )}
        />
        <Divider />
        <Card.Content>
          <DetailRow label="Name" value={booking.user?.name} />
          <DetailRow label="Mobile" value={booking.user?.mobile} />
          <DetailRow label="Address" value={booking.user?.address} />
        </Card.Content>
      </Card>

      {/* Booking Info */}
      <Card style={styles.sectionCard}>
        <Card.Title
          title="Booking Information"
          left={(props) => (
            <MaterialIcons name="event-note" size={26} color={theme.colors.primary} />
          )}
        />
        <Divider />
        <Card.Content>
          <DetailRow label="Loan Type" value={selectLoanFromId[booking.loantypefk]} />
          <DetailRow label="Loan Account Number" value={booking.loanAccountNumber} />
          <DetailRow label="Booking Amount" value={`₹${booking.bookingAmount}`} />
          <DetailRow label="Tentative Bill" value={`₹${booking.tentativeBillAmount}`} />
          <DetailRow label="Booked By" value={booking.bookedBy || "N/A"} />
          <DetailRow label="Address" value={booking.address} />
        </Card.Content>
      </Card>

      {/* Booked By User Info */}
      {bookedByUser && (
        <Card style={styles.sectionCard}>
          <Card.Title
            title="Booked By "
            left={(props) => (
              <MaterialIcons name="supervisor-account" size={26} color={theme.colors.primary} />
            )}
          />
          <Divider />
          <Card.Content>
            <DetailRow label="Mobile" value={bookedByUser.mobile} />
            {bookedByUser.name && <DetailRow label="Name" value={bookedByUser.name} />}
            {bookedByUser.email && <DetailRow label="Email" value={bookedByUser.email} />}
            {bookedByUser.address && <DetailRow label="Address" value={bookedByUser.address} />}
          </Card.Content>
        </Card>
        
      )}
      {
        
     <Button 
            disabled={!isAdmin&&booking?.statusfk>2?true:false}
     onPress={()=>{navigation.navigate("BookingScreen",{editBooking:booking,isAdmin})}}
     mode="contained" 
     labelStyle={{fontSize:16}} 
     icon={"pencil"}
     style={{width:"80%",
                opacity:!isAdmin&&booking?.statusfk>2?0.8:1,
      alignSelf:"center",backgroundColor:theme?.colors?.main,borderRadius:8}} >Edit Booking</Button>
        
        }
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "-"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
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
    backgroundColor: "#fff",
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "700",
    color: "#333",
    flexWrap:"wrap"
  },
  statusText: {
    marginTop: 3,
    color: "#4CAF50",
    fontWeight: "600",
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontWeight: "500",
    color: "#222",
    maxWidth: "55%",
    textAlign: "right",
  },
});

export default BookingDetailsScreen;
