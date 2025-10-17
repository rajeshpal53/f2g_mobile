import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Card, ActivityIndicator } from "react-native-paper";
import { useTheme } from "../../Constants/Theme";
import { readApi } from "../../Util/UtilApi";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [referralDashboardData, setReferralDashboardData] = useState(null);
  const [showBookingStatus, setShowBookingStatus] = useState(false);
  const [showReferralStatus, setShowReferralStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingRes = await readApi("booking/getBookingStats?year=2025");
        const referralRes = await readApi("refferal/getRefferalStats?year=2025");

        setDashboardData(bookingRes || {});
        setReferralDashboardData(referralRes || {});
      } catch (error) {
        console.error("Overview Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReferralPress = () => {
    Alert.alert("Referral", "Navigate to referral page or share your referral link!");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading Overview...</Text>
      </SafeAreaView>
    );
  }

  if (!dashboardData || !referralDashboardData) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Text style={{ color: colors.danger || "red" }}>Unable to load overview data.</Text>
      </SafeAreaView>
    );
  }

  const totalLoans = dashboardData?.totalBookings ?? 0;
  const totalReferrals = referralDashboardData?.totalRefferals ?? 0;

  const mixPieData = [
    {
      name: "Loans",
      population: totalLoans,
      color: "#42A5F5",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
    {
      name: "Referrals",
      population: totalReferrals,
      color: "#AB47BC",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: () => colors.text,
  };

  const renderStatusCard = (title, dataObj) => {
    const entries = Object.entries(dataObj || {});
    if (entries.length === 0) return null;

    return (
      <Card style={styles.statusCard}>
        <Text style={styles.statusTitle}>{title}</Text>
        {entries.map(([key, val], i) => (
          <View
            key={i}
            style={[
              styles.statusRow,
              { backgroundColor: i % 2 === 0 ? colors.surface : colors.background },
            ]}
          >
            <Text style={styles.statusKey}>{key}</Text>
            <Text style={styles.statusValue}>{val ?? 0}</Text>
          </View>
        ))}
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              setShowBookingStatus(prev => !prev);
              setShowReferralStatus(false);
            }}
          >
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#42A5F5", textAlign: "center" }]}>
                {totalLoans}
              </Text>
              <Text style={[styles.statLabel, { textAlign: "center" }]}>Total Bookings</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              setShowReferralStatus(prev => !prev);
              setShowBookingStatus(false);
            }}
          >
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#AB47BC", textAlign: "center" }]}>
                {totalReferrals}
              </Text>
              <Text style={[styles.statLabel, { textAlign: "center" }]}>Total Referrals</Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Status Cards */}
        {showBookingStatus &&
          renderStatusCard("Booking Status Breakdown", dashboardData?.statusWiseBookings)}
        {showReferralStatus &&
          renderStatusCard("Referral Status Breakdown", referralDashboardData?.statusWiseRefferals)}

        {/* Pie Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Loan vs Referral Overview</Text>
          <View style={{ alignItems: "center" }}>
            <PieChart
              data={mixPieData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="70"
              hasLegend={false} // remove default legend
              absolute={false} // remove numbers inside slices
            />

            {/* Custom legend */}
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 15,marginLeft:10 }}>
              {mixPieData.map((item, idx) => (
                <View
                  key={idx}
                  style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 15 }}
                >
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: item.color,
                      borderRadius: 2,
                      marginRight: 6,
                    }}
                  />
                  <Text style={{ color: colors.text, fontSize: 14 }}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Quote */}
        <Text style={styles.quote}>
          "Share with your friends and earn rewards for every referral!"
        </Text>

        {/* Referral Button */}
        <TouchableOpacity
          style={[styles.referralButton, { backgroundColor: "#007BFF" }]}
          onPress={handleReferralPress}
        >
          <Text style={styles.referralButtonText}>Refer & Earn</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Dynamic styles generator
const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      paddingVertical: 20,
      flexGrow: 1,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surface,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: screenWidth - 30,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 20,
      marginHorizontal: 5,
      borderRadius: 15,
      elevation: 4,
      backgroundColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
    },
    statLabel: {
      fontSize: 14,
      marginTop: 5,
      color: colors.text,
    },
    chartCard: {
      width: screenWidth - 30,
      borderRadius: 15,
      padding: 15,
      elevation: 4,
      backgroundColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      marginBottom: 20,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 10,
      color: colors.text,
    },
    statusCard: {
      width: screenWidth - 30,
      borderRadius: 15,
      padding: 10,
      marginBottom: 15,
      elevation: 4,
      backgroundColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    statusTitle: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      color: colors.primary,
    },
    statusRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      paddingHorizontal: 15,
    },
    statusKey: { fontSize: 14, fontWeight: "500", color: colors.text },
    statusValue: { fontSize: 14, fontWeight: "500", color: colors.text },
    quote: {
      fontStyle: "italic",
      textAlign: "center",
      fontSize: 14,
      marginBottom: 15,
      paddingHorizontal: 20,
      color: colors.text,
    },
    referralButton: {
      paddingVertical: 15,
      borderRadius: 25,
      width: screenWidth - 50,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      marginBottom: 30,
    },
    referralButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });

export default HomeScreen;
