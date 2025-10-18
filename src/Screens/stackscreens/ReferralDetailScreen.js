import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Divider, Avatar, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../Constants/Theme";
import{valuesByStatusfk,statusColors,selectLoanFromId} from "../../Util/UtilApi"
const ReferralDetailScreen = ({ route, navigation }) => {
  const { referral, isAdmin } = route.params;
  const theme = useTheme();
    const status=valuesByStatusfk[referral.statusfk]
  if (!referral) {
    return (
      <View style={styles.center}>
        <Text variant="titleMedium">No referral data found</Text>
      </View>
    );
  }

  const referredByUser = referral.refferedByUser;
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
            icon="account-arrow-right"
            color="white"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={{ marginLeft: 15 }}>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Referral ID: {referral.refId}
            </Text>
            <Text variant="bodyMedium" style={[styles.statusText,{color:statusColors[status]}]}>
              Status: { valuesByStatusfk[referral.statusfk]}
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
          <DetailRow label="Name" value={referral.user?.name} />
          <DetailRow label="Mobile" value={referral.user?.mobile} />
          <DetailRow label="Address" value={referral.user?.address} />
        </Card.Content>
      </Card>

      {/* Referral Info */}
      <Card style={styles.sectionCard}>
        <Card.Title
          title="Referral Information"
          left={(props) => (
            <MaterialIcons name="event-note" size={26} color={theme.colors.primary} />
          )}
        />
        <Divider />
        <Card.Content>
          <DetailRow label="Loan Type" value={selectLoanFromId[referral.loantypefk]} />
          <DetailRow label="Loan Amount" value={`₹${referral.loanAmount}`} />
          <DetailRow label="Address" value={referral.address} />
          <DetailRow label="Remark" value={referral.remark} />
          <DetailRow
            label="Referred On"
            value={new Date(referral.createdAt).toLocaleString()}
          />
        </Card.Content>
      </Card>

      {/* Referred By Info */}
      {referredByUser && (
        <Card style={styles.sectionCard}>
          <Card.Title
            title="Referred By"
            left={(props) => (
              <MaterialIcons
                name="supervisor-account"
                size={26}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <Card.Content>
            <DetailRow label="Mobile" value={referredByUser.mobile} />
            {referredByUser.name && <DetailRow label="Name" value={referredByUser.name} />}
            {referredByUser.email && (
              <DetailRow label="Email" value={referredByUser.email} />
            )}
            {referredByUser.address && (
              <DetailRow label="Address" value={referredByUser.address} />
            )}
          
          </Card.Content>
        </Card>
      )}
       
      {/* Edit Button */}
      <Button
      disabled={!isAdmin&&referral?.statusfk>2?true:false}
        onPress={() =>
          navigation.navigate("ReferralForm", { editReferral: referral, isAdmin })
        }
        mode="contained"
        labelStyle={{ fontSize: 16 }}
        icon="pencil"
        style={{
          opacity:!isAdmin&&referral?.statusfk>2?0.8:1,
          width: "80%",
          alignSelf: "center",
          backgroundColor: theme?.colors?.main,
          borderRadius: 8,
          marginTop: 16,
          color:theme?.colors?.text
        }}
      >
        Edit Referral
      </Button>
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

export default ReferralDetailScreen;
