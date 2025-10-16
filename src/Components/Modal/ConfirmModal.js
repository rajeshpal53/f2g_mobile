import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Dialog, Portal, Paragraph } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../Constants/Theme";

const ConfirmModal = ({
  visible,
  setVisible,
  handlePress,
  message,
  heading,
  buttonTitle,
}) => {
  const { colors } = useTheme();
  const hideDialog = () => setVisible(false);

  return (
    <View
      style={[
        styles.container,
        { flex: visible ? 1 : 0, backgroundColor: colors?.background },
      ]}
    >
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{ backgroundColor: colors?.background }}
        >
          <Dialog.Title
            style={{
              color: colors?.text,
              alignSelf: "center",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {heading}
          </Dialog.Title>

          <Dialog.Content
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Optional Icon */}
            {/* <Icon name="warning-sharp" size={40} color={"#FFD700"} /> */}
            <View
              style={{
                justifyContent: "center",
                flex: 1,
                paddingLeft: 10,
              }}
            >
              <Paragraph
                style={{
                  fontSize: 14,
                  flexWrap: "wrap",
                  textAlign: "flex-start",
                }}
              >
                {message}
              </Paragraph>
            </View>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              labelStyle={{ color: colors?.main }}
              onPress={hideDialog}
              style={{
                backgroundColor: colors?.background,
                borderRadius: 12,
                width: "50%",
              }}
              mode="outlined"
            >
              Cancel
            </Button>

            <Button
              onPress={handlePress}
              style={{
                borderRadius: 12,
                width: "50%",
                backgroundColor: colors?.main,
              }}
              mode="contained"
            >
              {buttonTitle}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

export default ConfirmModal;
