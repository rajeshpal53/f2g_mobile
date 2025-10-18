import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Card, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../Constants/Theme";
import { readApi } from "../../Util/UtilApi";
import UserDataContext from "../../Store/UserDataContext";
import { useIsFocused } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ACCENT_BLUE = "#6c63ff";
const GRAY_TEXT = "#5c5c5c";
const HEADER_BLACK = "#1a1a1a";
const LIGHT_BACKGROUND = "#fcfcfc";

const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { userData } = useContext(UserDataContext);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [referralDashboardData, setReferralDashboardData] = useState(null);
  const [showBookingStatus, setShowBookingStatus] = useState(false);
  const [showReferralStatus, setShowReferralStatus] = useState(false);
  const isFocused=useIsFocused()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const bookingRes = await readApi(
          `booking/getBookingStats?year=2025&bookedBy=${userData?.user?.id}`
        );
        const referralRes = await readApi(
          `refferal/getRefferalStats?year=2025&refferedBy=${userData?.user?.id}`
        );

        setDashboardData(bookingRes || {});
        setReferralDashboardData(referralRes || {});
      } catch (error) {
        console.error("Overview Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isFocused]);

  const handleReferralPress = () => {
    Alert.alert(
      "Referral",
      "Navigate to referral page or share your referral link!"
    );
  };

  // 🌀 Loading State
  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ color: colors.text, marginTop: 10 }}>
          Loading Overview...
        </Text>
      </SafeAreaView>
    );
  }

  // 🧾 Empty Data → Show Welcome Screen
  if (
    dashboardData?.noOfBookings === 0 &&referralDashboardData?.noOfRefferals === 0
  ) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BACKGROUND} />
        <View style={styles.contentContainer}>
          <View style={styles.illustrationContainer}>
            <Image
              source={require("../../../assets/coinpay_illustration.png")}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.mainHeading}>
            Congratulations!{"\n"}Welcome to F2G 🥳
          </Text>
          <Text style={styles.subText}>We are happy to have you.{"\n"}
           It's time to <Text style={{ fontWeight: "700" }}>refer</Text>,{" "}
            <Text style={{ fontWeight: "700" }}></Text>your collegues{" "}
            <Text style={{ fontWeight: "700" }}>and earn profit</Text>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Dashboard Data Available → Show Analytics
  const totalLoans = dashboardData?.totalBookings ?? 0;
  const totalReferrals = referralDashboardData?.totalRefferals ?? 0;

  const mixPieData = [
    { name: "Loans", population: totalLoans, color: "#42A5F5" },
    { name: "Referrals", population: totalReferrals, color: "#AB47BC" },
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

    const statusColors = ["#42A5F5", "#AB47BC", "#FF7043", "#26A69A", "#FFCA28"];
    return (
      <Card style={[styles.statusCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.statusTitle, { color: colors.primary }]}>
          {title}
        </Text>
        {entries.map(([key, val], i) => (
          <View key={i} style={styles.statusRowModern}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: statusColors[i % statusColors.length],
                marginRight: 10,
              }}
            />
            <Text style={styles.statusKeyModern}>{key}</Text>
            <Text
              style={[
                styles.statusValueModern,
                { color: statusColors[i % statusColors.length] },
              ]}
            >
              {val ?? 0}
            </Text>
          </View>
        ))}
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              setShowBookingStatus((prev) => !prev);
              setShowReferralStatus(false);
            }}
          >
            <Card
              style={[styles.statCardModern, { borderLeftColor: "#42A5F5" }]}
            >
              <Text style={styles.statValueModern}>{totalLoans}</Text>
              <Text style={styles.statLabelModern}>Total Bookings</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              setShowReferralStatus((prev) => !prev);
              setShowBookingStatus(false);
            }}
          >
            <Card
              style={[styles.statCardModern, { borderLeftColor: "#AB47BC" }]}
            >
              <Text style={styles.statValueModern}>{totalReferrals}</Text>
              <Text style={styles.statLabelModern}>Total Referrals</Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Status Cards */}
        {showBookingStatus &&
          renderStatusCard(
            "Booking Status Breakdown",
            dashboardData?.statusWiseBookings
          )}
        {showReferralStatus &&
          renderStatusCard(
            "Referral Status Breakdown",
            referralDashboardData?.statusWiseRefferals
          )}

        {/* Pie Chart */}
        <Card style={styles.chartCardModern}>
          <Text style={styles.chartTitle}>Loan vs Referral Overview</Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <PieChart
              data={mixPieData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="70"
              hasLegend={false}
              absolute={false}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 15,
              }}
            >
              {mixPieData.map((item, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 10,
                  }}
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
                  <Text style={{ color: colors.text, fontSize: 14 }}>
                    {item.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteModern}>
            "Share with your collegues and earn rewards on every referral!"
          </Text>
        </View>
        {/* Referral Button */}
        <TouchableOpacity
          style={styles.referralButtonModern}
          onPress={handleReferralPress}
        >
          <Text style={styles.referralButtonText}>Refer & Earn</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: LIGHT_BACKGROUND,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surface,
    },
    contentContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    illustrationContainer: {
      width: "100%",
      height: screenHeight * 0.35,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 50,
      marginTop: 10,
    },
    illustrationImage: {
      width: "150%",
      height: "150%",
    },
    mainHeading: {
      fontSize: 28,
      fontWeight: "900",
      textAlign: "center",
      color: HEADER_BLACK,
      lineHeight: 42,
      marginBottom: 25,
    },
    subText: {
      fontSize: 16,
      color: GRAY_TEXT,
      textAlign: "center",
      lineHeight: 28,
      fontWeight: "400",
    },
    container: {
      alignItems: "center",
      paddingVertical: 20,
      flexGrow: 1,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: screenWidth - 30,
      marginBottom: 20,
    },
    statCardModern: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 25,
      marginHorizontal: 5,
      borderRadius: 15,
      elevation: 4,
      backgroundColor: "#FFFFFF",
      borderLeftWidth: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    statValueModern: { fontSize: 28, fontWeight: "bold" },
    statLabelModern: { fontSize: 14, marginTop: 5, color: "#555" },
    chartCardModern: {
      width: screenWidth - 30,
      borderRadius: 20,
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
    },
    statusTitle: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      color: colors.primary,
    },
    statusRowModern: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginVertical: 4,
      borderRadius: 10,
      backgroundColor: "#f9f9f9",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    statusKeyModern: { flex: 1, fontSize: 15, fontWeight: "500", color: "#333" },
    statusValueModern: { fontSize: 15, fontWeight: "bold" },
    quoteContainer: {
      width: screenWidth - 40,
      marginVertical: 10,
      padding: 10,
      backgroundColor: "#f2f2f2",
      borderRadius: 15,
    },
    quoteModern: {
      fontStyle: "italic",
      textAlign: "center",
      fontSize: 14,
      color: "#555",
    },
    referralButtonModern: {
      paddingVertical: 15,
      borderRadius: 30,
      width: screenWidth - 50,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#007BFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      marginBottom: 30,
    },
    referralButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  });

export default HomeScreen;
