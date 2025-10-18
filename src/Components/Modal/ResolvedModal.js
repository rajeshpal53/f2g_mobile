import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Button, Dialog, Portal, Paragraph, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
const ResolvedModal = ({
  visible,
  setVisible,
  handlePress,
  message,
  heading,
  buttonTitle,
  TextMessage,
  onchangeText
}) => {
  const { t } = useTranslation();

  const hideDialog = () => {
    setVisible(false);
    onchangeText(""); // clear old text when closing
  };

  return (
    <View style={[styles.container, { flex: visible ? 1 : 0 }]}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title
            style={{
              color: "#000",
              fontFamily: "",
              alignSelf: "center",
              fontSize: 16,
            }}
          >
            {t(heading)}
          </Dialog.Title>

          <Dialog.Content style={{ paddingBottom: 0 }}>
            <Paragraph
              style={{
                fontFamily: "",
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              {t(message)}
            </Paragraph>

            {/* Long text input */}
           <TextInput
  mode="outlined"
  label={t("Query Resolve")}
  placeholder={t("Write resolution details...")}
  value={TextMessage}
  onChangeText={onchangeText}
  multiline
  numberOfLines={6}              // initial height (like a textarea)
  style={{
    backgroundColor: "#fff",
    fontSize: 15,
    fontFamily: "",
    marginBottom:10
  }}
  theme={{
    colors: {
      primary: "#0a6846",        // focused border
      outline: "#cfcfcf",        // unfocused border
      placeholder: "#8a8a8a",    // placeholder color
    },
  }}
  maxLength={1000}
/>

          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={hideDialog} mode="outlined" style={{ flex: 1, marginRight: 5 }}>
              {t("Cancel")}
            </Button>
            <Button
              onPress={handlePress}
              mode="contained"
              style={{ flex: 1, marginLeft: 5 }}
            >
              {t(buttonTitle)}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#fff",
    // shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    // elevation for Android
    elevation: 0,
  },
});

export default ResolvedModal;
