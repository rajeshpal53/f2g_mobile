import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Card, ActivityIndicator } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { readApi } from "../../Util/UtilApi";
import { useTheme } from "../../Constants/Theme"; // <- your custom hook

const screenWidth = Dimensions.get("window").width;

const AdminDashboardScreen = () => {
  const { colors } = useTheme(); // <- use theme colors
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "loan", title: "Bookings" },
    { key: "referral", title: "Referral" },
  ]);

  const [dashboardData, setDashboardData] = useState(null);
  const [referralDashboardData, setReferralDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const bookingRes = await readApi("booking/getBookingStats?year=2025");
        const referralRes = await readApi("refferal/getRefferalStats?year=2025");

        setDashboardData(bookingRes || {});
        setReferralDashboardData(referralRes || {});
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.surface }]}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading Dashboard...</Text>
      </View>
    );
  }

  if (!dashboardData || !referralDashboardData) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.danger }}>Unable to load dashboard data.</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    barPercentage: 0.7,
  };

  const bookingPieData = Object.entries(dashboardData?.loanTypeWiseBookings || {}).map(
    ([name, value], i) => ({
      name,
      population: Number(value) || 0,
      color: [
        "#1976D2",
        "#E53935",
        "#FDD835",
        "#43A047",
        "#8E24AA",
        "#00897B",
        "#FB8C00",
        "#5E35B1",
      ][i % 8],
      legendFontColor: colors.text,
      legendFontSize: 13,
    })
  );

  const bookingBarData = {
    labels: (dashboardData?.monthlyBookings || []).map((m) => m?.month || ""),
    datasets: [
      {
        data: (dashboardData?.monthlyBookings || []).map((m) =>
          Number(m?.noOfBookings || 0)
        ),
      },
    ],
  };

  const referralPieData = Object.entries(referralDashboardData?.loanTypeWiseRefferals || {}).map(
    ([name, value], i) => ({
      name,
      population: Number(value) || 0,
      color: [
        "#8E24AA",
        "#039BE5",
        "#43A047",
        "#FB8C00",
        "#3949AB",
        "#7CB342",
        "#00897B",
      ][i % 7],
      legendFontColor: colors.text,
      legendFontSize: 13,
    })
  );

  const referralBarData = {
    labels: (referralDashboardData?.monthlyRefferals || []).map((m) => m?.month || ""),
    datasets: [
      {
        data: (referralDashboardData?.monthlyRefferals || []).map((m) =>
          Number(m?.noOfRefferals || 0)
        ),
      },
    ],
  };

  const renderChart = (ChartComponent, data, isPie = false, title = "") => {
    const isEmpty =
      !data ||
      (isPie ? data.length === 0 : !data.datasets?.[0]?.data?.some((v) => v > 0));

    return (
      <>
        <Text style={[styles.chartHeading, { color: colors.text }]}>{title}</Text>
        {isEmpty ? (
          <Text style={{ textAlign: "center", color: colors.text, marginVertical: 20 }}>
            No chart data available
          </Text>
        ) : (
          <ChartComponent
            data={data}
            width={screenWidth - 30}
            height={isPie ? 220 : 250}
            chartConfig={chartConfig}
            accessor={isPie ? "population" : undefined}
            backgroundColor="transparent"
            paddingLeft={isPie ? "20" : undefined}
            absolute={isPie}
            fromZero={!isPie}
            showValuesOnTopOfBars={!isPie}
            verticalLabelRotation={!isPie ? -25 : 0}
            style={styles.chart}
          />
        )}
      </>
    );
  };

  const renderTable = (title, dataObj) => {
    const entries = Object.entries(dataObj || {});
    return (
      <Card style={[styles.tableCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.tableTitle, { color: colors.primary }]}>{title}</Text>
        {entries.length === 0 ? (
          <Text style={{ textAlign: "center", color: colors.text, paddingVertical: 10 }}>
            No data available
          </Text>
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.headerText, { flex: 1.5 }]}>Category</Text>
              <Text style={[styles.tableCell, styles.headerText]}>Count</Text>
            </View>
            {entries.map(([key, val], i) => (
              <View
                key={i}
                style={[
                  styles.tableRow,
                  {
                    backgroundColor: i % 2 === 0 ? colors.surface : colors.background,
                  },
                ]}
              >
                <Text style={[styles.tableCell, { flex: 1.5, color: colors.text }]}>{key}</Text>
                <Text style={[styles.tableCell, { color: colors.text }]}>{val ?? 0}</Text>
              </View>
            ))}
          </>
        )}
      </Card>
    );
  };

  const LoanScene = () => (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={[styles.contentContainer, { backgroundColor: colors.surface }]}
      showsVerticalScrollIndicator={false}
    >
      <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Loan Overview</Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Total Bookings: <Text style={{ color: colors.primary }}>{dashboardData?.totalBookings ?? 0}</Text>
        </Text>
      </Card>

      {renderChart(PieChart, bookingPieData, true, "Loan Type Distribution")}
      {renderChart(BarChart, bookingBarData, false, "Monthly Bookings")}
      {renderTable("Booking Status Breakdown", dashboardData?.statusWiseBookings)}
      {renderTable("Loan Type Breakdown", dashboardData?.loanTypeWiseBookings)}
    </ScrollView>
  );

  const ReferralScene = () => (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={[styles.contentContainer, { backgroundColor: colors.surface }]}
      showsVerticalScrollIndicator={false}
    >
      <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Referral Overview</Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Total Referrals: <Text style={{ color: colors.primary }}>{referralDashboardData?.totalRefferals ?? 0}</Text>
        </Text>
      </Card>

      {renderChart(PieChart, referralPieData, true, "Referral Type Distribution")}
      {renderChart(BarChart, referralBarData, false, "Monthly Referrals")}
      {renderTable("Referral Status Breakdown", referralDashboardData?.statusWiseRefferals)}
      {renderTable("Loan Type Breakdown", referralDashboardData?.loanTypeWiseRefferals)}
    </ScrollView>
  );

  const renderScene = SceneMap({
    loan: LoanScene,
    referral: ReferralScene,
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: colors.primary, height: 3 }}
            style={{ backgroundColor: colors.surface }}
            labelStyle={{ color: colors.text, fontWeight: "bold", fontSize: 13 }}
            activeColor={colors.primary}
            inactiveColor={colors.text}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: { alignItems: "center", paddingVertical: 20, paddingBottom: 60 },
  sectionCard: { width: screenWidth - 30, borderRadius: 12, padding: 15, marginBottom: 20, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  infoText: { fontSize: 16, textAlign: "center", fontWeight: "600" },
  chartHeading: { fontSize: 17, fontWeight: "bold", marginVertical: 10, alignSelf: "flex-start", marginLeft: 15 },
  chart: { borderRadius: 10, marginVertical: 15, alignSelf: "center" },
  tableCard: { width: screenWidth - 30, borderRadius: 12, padding: 10, marginTop: 15, elevation: 3 },
  tableTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 5 },
  tableRow: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 0.5, borderColor: "#e0e0e0" },
  tableCell: { flex: 1, fontSize: 14, textAlign: "center" },
  headerText: { fontWeight: "bold", color: "#666" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default AdminDashboardScreen;
