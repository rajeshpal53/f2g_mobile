import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Button, Dialog, Portal, Paragraph } from "react-native-paper";
import { fontFamily,fontSize,log} from "../Util/UtilApi";
const ConfirmModal = ({
  visible,
  setVisible,
  handlePress,
  message,
  heading,
  buttonTitle,
}) => {
  const hideDialog = () => setVisible(false);
  const{t}=useTranslation()
  return (
    <View style={[styles.container, { flex: visible ? 1 : 0 }]}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title style={{color:"#000",fontFamily:"Poppins-Bold",alignSelf:"center", fontSize:fontSize.heading}}>{t(heading)}</Dialog.Title>
          <Dialog.Content
  style={{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", // Align items parallel to each other
  }}
>
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
        fontFamily:fontFamily.regular,
        fontSize: fontSize.labelLarge,
        flexWrap: "wrap", 
        textAlign: "flex-start",
      }}
    >
      {t(message)}
    </Paragraph>
  </View>
</Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} style={{color:"#fff",borderRadius:12,width:"50%", fontFamily:fontFamily.bold}} mode="outlined">{t("Cancel")}</Button>
            <Button onPress={handlePress} style={{ fontFamily: fontFamily.bold,borderRadius:12,width:"50%",}} mode="contained">{t(buttonTitle)}</Button>
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
});

export default ConfirmModal;
