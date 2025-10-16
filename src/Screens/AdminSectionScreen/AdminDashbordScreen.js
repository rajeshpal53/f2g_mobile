// import React from "react";
// import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
// import { PieChart } from "react-native-chart-kit";
// import { useTheme } from "../../Constants/Theme";

// const screenWidth = Dimensions.get("window").width;

// const AdminDashboardScreen = () => {
//   const { colors } = useTheme();

//   // 🏠 Loan Type Data
//   const loanTypeData = [
//     {
//       name: "House Loan",
//       population: 45,
//       color: "#4285F4",
//       legendFontColor: colors.text,
//       legendFontSize: 14,
//     },
//     {
//       name: "Car Loan",
//       population: 30,
//       color: "#FBBC05",
//       legendFontColor: colors.text,
//       legendFontSize: 14,
//     },
//     {
//       name: "Personal Loan",
//       population: 15,
//       color: "#34A853",
//       legendFontColor: colors.text,
//       legendFontSize: 14,
//     },
//     {
//       name: "Education Loan",
//       population: 10,
//       color: "#EA4335",
//       legendFontColor: colors.text,
//       legendFontSize: 14,
//     },
//   ];

//   // 📈 Booking Status Data
//   const bookingStatusData = [
//     {
//       name: "Approved",
//       population: 50,
//       color: "#34A853",
//       legendFontColor: colors.text,
//       legendFontSize: 14,
//     },
//     {
//       name: "Pending",
//       population: 30,
//       color: "#FBBC05",
//       legendFontColor: colors.text,
//       legendFontSize: 14,
//     },
//     {
//       name: "Rejected",
//       population: 20,
//       color: "#EA4335",
//       legendFontColor: colors.text,
//       legendFontSize: 14,
//     },
//   ];

//   return (
//     <ScrollView
//       style={[styles.container, { backgroundColor: colors.background }]}
//       contentContainerStyle={styles.scrollContent}
//     >
//       <Text style={[styles.heading, { color: colors.text }]}>📊 Loan Type Distribution</Text>
//       <PieChart
//         data={loanTypeData}
//         width={screenWidth - 30}
//         height={220}
//         chartConfig={{
//           backgroundColor: colors.surface,
//           backgroundGradientFrom: colors.surface,
//           backgroundGradientTo: colors.surface,
//           color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
//         }}
//         accessor={"population"}
//         backgroundColor={"transparent"}
//         paddingLeft={"15"}
//         absolute
//       />

//       <Text style={[styles.heading, { color: colors.text, marginTop: 30 }]}>
//         📈 Booking Status Overview
//       </Text>
//       <PieChart
//         data={bookingStatusData}
//         width={screenWidth - 30}
//         height={220}
//         chartConfig={{
//           backgroundColor: colors.surface,
//           backgroundGradientFrom: colors.surface,
//           backgroundGradientTo: colors.surface,
//           color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
//         }}
//         accessor={"population"}
//         backgroundColor={"transparent"}
//         paddingLeft={"15"}
//         absolute
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     alignItems: "center",
//     paddingVertical: 20,
//   },
//   heading: {
//     fontSize: 18,
//     fontFamily: "Poppins-Bold",
//     marginBottom: 10,
//   },
// });

// export default AdminDashboardScreen;


import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { useTheme } from "../../Constants/Theme";

const screenWidth = Dimensions.get("window").width;

const AdminDashboardScreen = () => {
  const { colors } = useTheme();

  // 📊 Bar Chart Data - Loan Types
  const loanTypeData = {
    labels: ["House", "Car", "Personal", "Education"],
    datasets: [
      {
        data: [45, 30, 15, 10], // sample data
      },
    ],
  };

  // 📈 Line Chart Data - Booking Status Trend
  const bookingStatusData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [20, 35, 40, 50, 60, 70],
        color: (opacity = 1) => `rgba(52, 168, 83, ${opacity})`, // Approved
        strokeWidth: 2,
      },
      {
        data: [10, 20, 25, 30, 35, 40],
        color: (opacity = 1) => `rgba(251, 188, 5, ${opacity})`, // Pending
        strokeWidth: 2,
      },
      {
        data: [5, 8, 12, 15, 18, 20],
        color: (opacity = 1) => `rgba(234, 67, 53, ${opacity})`, // Rejected
        strokeWidth: 2,
      },
    ],
    legend: ["Approved", "Pending", "Rejected"],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: colors.primary,
    },
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 📊 Loan Type Graph */}
      <Text style={[styles.heading, { color: colors.text }]}>Loan Type Distribution</Text>
      <BarChart
        data={loanTypeData}
        width={screenWidth - 30}
        height={250}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
        style={styles.chartStyle}
      />

      {/* 📈 Booking Status Graph */}
      <Text style={[styles.heading, { color: colors.text }]}>Booking Status Trend</Text>
      <LineChart
        data={bookingStatusData}
        width={screenWidth - 30}
        height={250}
        chartConfig={chartConfig}
        bezier
        style={styles.chartStyle}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  heading: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginVertical: 10,
  },
  chartStyle: {
    borderRadius: 10,
    marginVertical: 15,
    elevation: 3,
  },
});

export default AdminDashboardScreen;
