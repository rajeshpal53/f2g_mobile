import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Card, ActivityIndicator, useTheme as usePaperTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../Constants/Theme";
import { readApi } from "../../Util/UtilApi";
import UserDataContext from "../../Store/UserDataContext";
import { useIsFocused } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const HomeScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme(); // your custom theme
  const paperTheme = usePaperTheme();
  const styles = getStyles(colors);
  const { userData } = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [referralDashboardData, setReferralDashboardData] = useState({});
  const [showBookingStatus, setShowBookingStatus] = useState(false);
  const [showReferralStatus, setShowReferralStatus] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.user?.id) return;

      try {
        setLoading(true);
        const bookingRes = await readApi(
          `booking/getBookingStats?year=2025&bookedBy=${userData.user.id}`
        );
        const referralRes = await readApi(
          `refferal/getRefferalStats?year=2025&refferedBy=${userData.user.id}`
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
  }, [isFocused, userData]);

  if (loading || !userData?.user?.id) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading Overview...</Text>
      </SafeAreaView>
    );
  }

  const totalLoans =
    dashboardData?.totalBookings ??
    dashboardData?.noOfBookings ??
    dashboardData?.bookings ??
    0;

  const totalReferrals =
    referralDashboardData?.totalRefferals ??
    referralDashboardData?.noOfRefferals ??
    referralDashboardData?.referrals ??
    0;

  if (!totalLoans && !totalReferrals) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />
        <View style={styles.contentContainer}>
          <View style={styles.illustrationContainer}>
            <Image
              source={require("../../../assets/coinpayIllustration.png")}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.mainHeading, { color: colors.text }]}>
            Congratulations!{"\n"}Welcome to F2G 🥳
          </Text>
          <Text style={[styles.subText, { color: colors.textSecondary }]}>
            We are happy to have you.{"\n"}It's time to{" "}
            <Text style={{ fontWeight: "700", color: colors.primary }}>refer</Text> your colleagues
            and <Text style={{ fontWeight: "700", color: colors.primary }}>earn profit</Text>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const mixPieData = [
    { name: "Loans", population: totalLoans, color: colors.primary },
    { name: "Referrals", population: totalReferrals, color: colors.secondary },
  ];

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.text,
    labelColor: () => colors.text,
  };

  const renderStatusCard = (title, dataObj) => {
    if (!dataObj || Object.keys(dataObj).length === 0) return null;
    const entries = Object.entries(dataObj);
    const statusColors = [colors.primary, colors.secondary, colors.success, colors.warning, colors.info];

    return (
      <Card style={[styles.statusCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.statusTitle, { color: colors.primary }]}>{title}</Text>
        {entries.map(([key, val], i) => (
          <View key={i} style={[styles.statusRowModern, { backgroundColor: colors.background }]}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: statusColors[i % statusColors.length],
                marginRight: 10,
              }}
            />
            <Text style={[styles.statusKeyModern, { color: colors.text }]}>{key}</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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
              style={[
                styles.statCardModern,
                { backgroundColor: colors.surface, borderLeftColor: colors.primary },
              ]}
            >
              <Text style={[styles.statValueModern, { color: colors.text }]}>{totalLoans}</Text>
              <Text style={[styles.statLabelModern, { color: colors.textSecondary }]}>
                Total Bookings
              </Text>
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
              style={[
                styles.statCardModern,
                { backgroundColor: colors.surface, borderLeftColor: colors.secondary },
              ]}
            >
              <Text style={[styles.statValueModern, { color: colors.text }]}>{totalReferrals}</Text>
              <Text style={[styles.statLabelModern, { color: colors.textSecondary }]}>
                Total Referrals
              </Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Status Cards */}
        {showBookingStatus &&
          renderStatusCard("Booking Status Breakdown", dashboardData?.statusWiseBookings)}
        {showReferralStatus &&
          renderStatusCard("Referral Status Breakdown", referralDashboardData?.statusWiseRefferals)}

        {/* Pie Chart */}
        <Card style={[styles.chartCardModern, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Loan vs Referral Overview</Text>
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
            />
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 15 }}>
              {mixPieData.map((item, idx) => (
                <View
                  key={idx}
                  style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}
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
        <View style={[styles.quoteContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.quoteModern, { color: colors.textSecondary }]}>
            "Share with your colleagues and earn rewards on every referral!"
          </Text>
        </View>

        {/* Referral Button */}
        <TouchableOpacity
          style={[styles.referralButtonModern, { backgroundColor: colors.main }]}
          onPress={() => navigation.navigate("ReferralForm")}
        >
          <Text style={[styles.referralButtonText, { color: colors.text }]}>
            Refer & Earn
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
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
    },
    illustrationImage: { width: "150%", height: "150%" },
    mainHeading: { fontSize: 28, fontWeight: "900", textAlign: "center", lineHeight: 42, marginBottom: 25 },
    subText: { fontSize: 16, textAlign: "center", lineHeight: 28 },
    container: { alignItems: "center", paddingVertical: 20, flexGrow: 1 },
    statsRow: { flexDirection: "row", justifyContent: "space-between", width: screenWidth - 30, marginBottom: 20 },
    statCardModern: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 25,
      marginHorizontal: 5,
      borderRadius: 15,
      elevation: 4,
      borderLeftWidth: 5,
    },
    statValueModern: { fontSize: 28, fontWeight: "bold" },
    statLabelModern: { fontSize: 14, marginTop: 5 },
    chartCardModern: {
      width: screenWidth - 30,
      borderRadius: 20,
      padding: 15,
      elevation: 4,
      marginBottom: 20,
    },
    chartTitle: { fontSize: 16, fontWeight: "600", textAlign: "center", marginBottom: 10 },
    statusCard: { width: screenWidth - 30, borderRadius: 15, padding: 10, marginBottom: 15, elevation: 4 },
    statusTitle: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    statusRowModern: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginVertical: 4,
      borderRadius: 10,
      elevation: 1,
    },
    statusKeyModern: { flex: 1, fontSize: 15, fontWeight: "500" },
    statusValueModern: { fontSize: 15, fontWeight: "bold" },
    quoteContainer: {
      width: screenWidth - 40,
      marginVertical: 10,
      padding: 10,
      borderRadius: 15,
    },
    quoteModern: { fontStyle: "italic", textAlign: "center", fontSize: 14 },
    referralButtonModern: {
      paddingVertical: 15,
      borderRadius: 30,
      width: screenWidth - 50,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      marginBottom: 30,
    },
    referralButtonText: { fontWeight: "bold", fontSize: 16 },
  });

export default HomeScreen;
