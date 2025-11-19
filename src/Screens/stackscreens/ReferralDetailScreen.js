import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Divider, Avatar, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import {
  valuesByStatusfk,
  statusColors,
  selectLoanFromId,
} from "../../Util/UtilApi";
import { useTheme } from "../../Constants/Theme";

const ReferralDetailScreen = ({ route, navigation }) => {
  const { referral, isAdmin } = route.params;
  const theme = useTheme();
  const status = valuesByStatusfk[referral?.statusfk];

  if (!referral) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text variant="titleMedium" style={{ color: theme.colors.onBackground }}>
          No referral data found
        </Text>
      </View>
    );
  }

  const referredByUser = referral.refferedByUser;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Card
        style={[
          styles.headerCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
          },
        ]}
      >
        <Card.Content style={styles.headerContent}>
          <Avatar.Icon
            size={40}
            icon="account-arrow-right"
            color="white"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={{ marginLeft: 15 }}>
            <Text
              variant="titleMedium"
              style={[styles.headerTitle, { color: theme.colors.onSurface }]}
            >
              Referral ID: {referral.refId}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.statusText,
                { color: statusColors[status] || theme.colors.primary },
              ]}
            >
              Status: {status}
            </Text>
           {referral?.description && (
  <Text
    variant="bodyMedium"
    style={[
      {
        color: theme?.colors.text,
        flexWrap: "wrap",
        flexShrink: 1,
        flex: 1,
        lineHeight: 20,
        marginTop: 6,
        textAlign: "justify",
        maxWidth: '95%',
      },
    ]}
  >
    Description / Remark: {referral?.description}
  </Text>
)}
          </View>
        </Card.Content>
      </Card>

      {/* Customer Info */}
      <InfoCard
        theme={theme}
        title="Customer Details"
        icon="person"
        rows={[
          { label: "Name", value: referral.user?.name },
          { label: "Mobile", value: referral.user?.mobile },
          { label: "Address", value: referral.user?.address },
        ]}
      />

      {/* Referral Info */}
      <InfoCard
        theme={theme}
        title="Referral Information"
        icon="event-note"
        rows={[
          { label: "Loan Type", value: selectLoanFromId[referral.loantypefk] },
          { label: "Loan Amount", value: `₹${referral.loanAmount}` },
          { label: "Address", value: referral.address },
          { label: "Remark", value: referral.remark },
          {
            label: "Referred On",
            value: new Date(referral.createdAt).toLocaleString(),
          },
        ]}
      />

      {/* Referred By Info */}
      {referredByUser && (
        <InfoCard
          theme={theme}
          title="Referred By"
          icon="supervisor-account"
          rows={[
            { label: "Mobile", value: referredByUser.mobile },
            referredByUser.name && { label: "Name", value: referredByUser.name },
            referredByUser.email && { label: "Email", value: referredByUser.email },
            referredByUser.address && {
              label: "Address",
              value: referredByUser.address,
            },
          ].filter(Boolean)}
        />
      )}

      {/* Edit Button */}


      {  isAdmin&&(
         <Button
        onPress={() =>
          navigation.navigate("ReferralForm", { editReferral: referral, isAdmin })
        }
        mode="contained"
        labelStyle={{ fontSize: 16 }}
        icon="pencil"
        style={{
          opacity: !isAdmin && referral?.statusfk > 2 ? 0.8 : 1,
          width: "80%",
          alignSelf: "center",
          backgroundColor: theme.colors.primary,
          borderRadius: 8,
          marginTop: 16,
        }}
        textColor={theme.colors.onPrimary}
      >
        Edit Referral
      </Button>
      )}
     
    </ScrollView>
  );
};

const InfoCard = ({ theme, title, icon, rows }) => (
  <Card
    style={[
      styles.sectionCard,
      { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
    ]}
  >
    <Card.Title
      title={title}
      titleStyle={{ color: theme.colors.onSurface }}
      left={() => (
        <MaterialIcons name={icon} size={26} color={theme.colors.primary} />
      )}
    />
    <Divider />
    <Card.Content>
      {rows.map((row, index) => (
        <DetailRow
          key={index}
          label={row.label}
          value={row.value}
          theme={theme}
        />
      ))}
    </Card.Content>
  </Card>
);

const DetailRow = ({ label, value, theme }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
      {label}
    </Text>
    <Text style={[styles.value, { color: theme.colors.onSurface }]}>
      {value || "-"}
    </Text>
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
    borderWidth: 1,
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
    borderWidth: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontWeight: "600",
    flex: 1,
  },
  value: {
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
});

export default ReferralDetailScreen;
