import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Menu, Button, IconButton } from "react-native-paper";
import { Feather } from "@expo/vector-icons"; // clean modern icon set
import { useTheme } from "../Constants/Theme";
import{useDownloadReferralBooking} from "../Util/useDownloadReferralBooking"
import { API_BASE_URL } from "../Util/UtilApi";
import UserDataContext from "../Store/UserDataContext";
const DownloadMenuButton = ({buildApiUrl,mode,filterAdded}) => {
  const [visible, setVisible] = useState(false);
    const{colors}=useTheme()
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
    const {downloadPdfHandler, downloadExcelHandler,DownloadLoading }=useDownloadReferralBooking()
    const {userData} =useContext(UserDataContext)
  const handleSelect = async (type) => {
    try{

         let url= buildApiUrl(1,true)
    url+= filterAdded?`&type=${type}`:`&type=${type}`
    console.log(url,"url")
    if(type==="pdf"){
    downloadPdfHandler(`${API_BASE_URL}${url}`,mode,userData?.token)

    }else{
        downloadExcelHandler(`${API_BASE_URL}${url}`,mode, userData?.token)
    }
    setVisible(false)
    
    }
    catch(err){
        console.error("failed to close" ,err)
    }
   
  };
  

  return (
    <View style={styles.container}>
      <Menu
      contentStyle={{backgroundColor:colors?.background}}
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon={() => <Feather name="download-cloud" size={25} color="white" />}
            style={[styles.downloadButton,{backgroundColor:colors?.main}]}
            onPress={openMenu}
          />
        }
      >
        <Menu.Item onPress={() => handleSelect("pdf")} title="Download as PDF" />
        <Menu.Item onPress={() => handleSelect("excel")} title="Download as Excel" />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -65,
    right: 10,
    zIndex: 100,
  },
  downloadButton: {
   
    borderRadius: 25,
    elevation: 4,
  },
});

export default DownloadMenuButton;
