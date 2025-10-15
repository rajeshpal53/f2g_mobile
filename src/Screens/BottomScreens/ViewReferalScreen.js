import React, { useRef, useState,useEffect, useContext } from "react";
import { FlatList,  StyleSheet,View} from "react-native";
import ReferralCard from "../../Components/Cards/RefralCard";
import Searchbarwithmic from "../../Components/Searchbarwithmic";
import { FAB } from "react-native-paper";
import { useTheme } from "../../Constants/Theme";
import {MaterialIcons} from "@expo/vector-icons/"
import { readApi,selectLoanFrom } from "../../Util/UtilApi";
import UserDataContext from "../../Store/UserDataContext";
import { useIsFocused } from "@react-navigation/native";
import NoDataFound from "../../UI/NoDataFound";
  // you can add more data here


const ViewReferalScreen = ({navigation}) => {
    const[searchQuery,setSearchQuery]=useState("")
    const [searchModal,setSeachModal]=useState("")
    const [transcript,setTranscript]=useState("")
    const [referral,setReferral]= useState([])
    const searchBarRef=useRef();
    const {userData}=useContext(UserDataContext)
    const isFocused= useIsFocused()
    const fetchSearchedData=async()=>{
       const respons = await readApi(`refferal?searchTerm=${searchQuery}`)
          setReferral(respons?.refferals)
    }


    const{colors}=useTheme()


    const fetchefralData=async()=>{
      try{
          console.log(`refferal?refferedBy=${userData?.user?.id}`)
         const respons = await readApi(`refferal?refferedBy=${userData?.user?.id}`)
          setReferral(respons?.refferals)

          console.log(respons.refferals,"xyz")
      }catch(err){
        console.error("failed to search",err)
      }
     
    }
    useEffect(()=>{
      if(searchQuery){
        fetchSearchedData()
      }
    },[searchQuery])

    useEffect(()=>{
        fetchefralData();
    },[isFocused])
  return (
    <View style={styles.container}>
          <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={setSeachModal}
        setTranscript={setTranscript}
        placeholderText="Search refrals..."
        refuser={searchBarRef}
        searchData={fetchSearchedData}
      />
      <FlatList
        data={referral}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ReferralCard referral={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ flex:1,justifyContent:"flex",   marginVertical:140,paddingVertical: 50,alignItems: "center"}}>
                      <NoDataFound textString={"No Referrals Found"}/>

            </View>
  }
      />
        <FAB
      icon={() => <MaterialIcons name="add" size={24} color="#fff" />}
      style={styles.fab}
      color="#fff"
      onPress={()=>{navigation.navigate("ReferralForm")}}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },

 fab: {
    position: "absolute",
    bottom: 30,
    right: 16,
    backgroundColor: "#007BFF", // deep blue (or your theme color)
    borderRadius: 13,
    elevation: 5,
  },
});

export default ViewReferalScreen;
