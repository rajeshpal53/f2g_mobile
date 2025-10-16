import * as React from "react";
import { useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import PendingQueries from "./PendingQueries";
import ResolvedQueries from "./ResolvedQueries";

const renderScene = ({ route, pendingRefresh, setPendingRefresh, index, setIndex }) => {
  switch (route.key) {
    case "first":
      return <PendingQueries pendingRefresh={pendingRefresh} setPendingRefresh={setPendingRefresh} setIndex={setIndex} />;
    case "second":
      return <ResolvedQueries pendingRefresh={pendingRefresh} />;
    default:
      return null;
  }
};

const AllQuerysAndSupport = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [pendingRefresh, setPendingRefresh] = React.useState(false);

  const routes = [
    { key: "first", title: "Pending" },
    { key: "second", title: "Resolved" },
  ];

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={(props) => renderScene({ ...props, pendingRefresh, setPendingRefresh, index, setIndex })}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "green", height: 3 }}
          style={{ backgroundColor: "white" }}
          activeColor="green"
          inactiveColor="gray"
          labelStyle={{ fontWeight: "600", textTransform: "capitalize", color: "black" }}
        />
      )}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      style={{ backgroundColor: "#fff" }}
    />
  );
};

export default AllQuerysAndSupport;
