import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { selectLoanFromId, statusById, colorByStatusFk } from "../../Util/UtilApi";
import { useTheme } from "../../Constants/Theme";

const ReferralCard = ({ referral, navigation, isAdmin }) => {
  const { colors, dark } = useTheme();

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.outline },
      ]}
      onPress={() => {
        navigation.navigate("ReferralDetailScreen", { referral, isAdmin });
      }}
    >
      <Card.Content style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.name, { color: colors.text }]}>{referral.name}</Text>
            <Text style={[styles.refId, { color: colors.textSecondary }]}>
              Ref ID: {referral.refId}
            </Text>
            <Text style={[styles.loanType, { color: colors.primary }]}>
              {referral?.user?.mobile}
            </Text>
          </View>

          {/* Status */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colorByStatusFk(referral?.statusfk) },
            ]}
          >
            <Text style={styles.statusText}>
              {statusById[referral.statusfk]}
            </Text>
          </View>
        </View>

        {/* Loan Info */}
        <View style={styles.infoRow}>
          <Text style={[styles.loanType, { color: colors.primary }]}>
            {selectLoanFromId[referral.loantypefk]}
          </Text>
          <Text style={[styles.loanAmount, { color: colors.text }]}>
            ₹{referral.loanAmount.toLocaleString()}
          </Text>
        </View>

        {/* Address */}
        <Text
          style={[styles.address, { color: colors.text }]}
          numberOfLines={2}
        >
          {referral.address}
        </Text>

        {/* Remark */}
        <Text
          style={[styles.remark, { color: colors.text }]}
          numberOfLines={2}
        >
          {referral.remark}
        </Text>

        {/* Date */}
        <Text style={[styles.date, { color: colors.textSecondary }]}>
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
    borderWidth: 1,
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
  },
  refId: {
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
    fontWeight: "500",
  },
  loanAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  address: {
    marginTop: 4,
    fontSize: 13,
  },
  remark: {
    marginTop: 2,
    fontSize: 13,
  },
  date: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "right",
  },
});

export default ReferralCard;
