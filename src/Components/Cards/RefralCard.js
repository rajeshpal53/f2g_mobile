import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { selectLoanFromId,statusById,colorByStatusFk} from  "../../Util/UtilApi"


const ReferralCard = ({ referral,navigation,isAdmin }) => {
  // const statusColor = statusColors[referral.status] || "#9CA3AF";

  return (
    <Card style={styles.card} onPress={()=>{ navigation.navigate("ReferralDetailScreen",{referral:referral,isAdmin})}}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{referral.name}</Text>
            <Text style={styles.refId}>Ref ID: {referral.refId}</Text>
            <Text  style={styles.loanType}> {referral?.user?.mobile} </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colorByStatusFk(referral?.statusfk) }]}>
            <Text style={styles.statusText}>{statusById[referral.statusfk]}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.loanType}>{selectLoanFromId[referral.loantypefk]}</Text>
          <Text style={styles.loanAmount}>₹{referral.loanAmount.toLocaleString()}</Text>
        </View>

        <Text style={styles.address} numberOfLines={2}>
          {referral.address}
        </Text>

        <Text style={styles.remark} numberOfLines={2}>
          {referral.remark}
        </Text>

        <Text style={styles.date}>
          {new Date(referral.createdAt).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
    paddingVertical: 6,
  },
  content: {
    paddingVertical: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  refId: {
    color: "#6B7280",
    fontSize: 12,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  loanType: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "500",
  },
  loanAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  address: {
    marginTop: 4,
    fontSize: 13,
    color: "#374151",
  },
  remark: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280",
  },
  date: {
    marginTop: 4,
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
  },
});

export default ReferralCard;
