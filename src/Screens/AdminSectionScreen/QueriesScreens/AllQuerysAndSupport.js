import * as React from "react";
import { useWindowDimensions, Text } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import PendingQueries from "./PendingQueries";
import ResolvedQueries from "./ResolvedQueries";
import { useTheme } from "../../../Constants/Theme";

const AllQuerysAndSupport = () => {
  const layout = useWindowDimensions();
  const { colors } = useTheme();

  const [index, setIndex] = React.useState(0);
  const [pendingRefresh, setPendingRefresh] = React.useState(false);
  const [resolvedRefresh, setResolvedRefresh] = React.useState(false);

  const routes = [
    { key: "pending", title: "Pending" },
    { key: "resolved", title: "Resolved" },
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "pending":
        return (
          <PendingQueries
            pendingRefresh={pendingRefresh}
            setPendingRefresh={setPendingRefresh}
            setIndex={setIndex}
          />
        );
      case "resolved":
        return (
          <ResolvedQueries
            pendingRefresh={resolvedRefresh}
            setPendingRefresh={setResolvedRefresh}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: colors.primary, height: 3 }}
          style={{ backgroundColor: colors.secondary}}
          labelStyle={{ fontWeight: "600", textTransform: "capitalize" }}
          renderLabel={({ route, focused }) => (
            <Text
              style={{
                fontWeight: "600",
                color: focused ? colors.primary : colors.textSecondary,
                textTransform: "capitalize",
              }}
            >
              {route.title}
            </Text>
          )}
        />
      )}
      style={{ backgroundColor: colors.background }}
    />
  );
};

export default AllQuerysAndSupport;
