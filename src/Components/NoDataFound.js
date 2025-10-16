import React from "react";
import { View, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function NoDataFound({ textString, home = false }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../../assets/noDataFound.png")}
        style={{ width: 300, height: 230 }}
      />
      <Text
        style={{
          fontSize: 23,
          color: "rgba(0, 0, 0, 0.5)",
          fontStyle: "bold",
          textAlign: "center",
        }}
      >
        {textString}
      </Text>

      {home && (
        <Button
          mode="outlined"
          style={{ marginTop: 20 }}
          onPress={() => {
            navigation.navigate("locationSearch", {
              navigationName: "Home",
            });
          }}
        >
          Try different location
        </Button>
      )}
    </View>
  );
}

export default NoDataFound;
