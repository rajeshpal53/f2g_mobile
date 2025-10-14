import React, { useRef, useState,useEffect, useContext } from "react";
import { FlatList,  StyleSheet,View} from "react-native";
import ReferralCard from "../../Components/Cards/RefralCard";
import Searchbarwithmic from "../../Components/Searchbarwithmic";
import { FAB } from "react-native-paper";
import { useTheme } from "../../Constants/Theme";
import {MaterialIcons} from "@expo/vector-icons/"
import { readApi,selectLoanFrom } from "../../Util/UtilApi";
import UserDataContext from "../../Store/UserDataContext";
const sampleData = [
  {
    id: 1,
    name: "Rajesh Sharma",
    usersfk: 8,
    refferedBy: 3,
    loanAmount: 250000.0,
    loanType: "Home Loan ",
    address:
      "45 Green Valley Apartments, Andheri West, Mumbai, Maharashtra, India",
    remark: "Customer referred by existing client for business loan.",
    refId: "REF-20251013-008",
    createdAt: "2025-10-13T10:30:00.000Z",
    updatedAt: "2025-10-13T10:30:00.000Z",
    status:"Approved"
  },
  {
    id: 2,
    name: "Yogesh Sharma",
    usersfk: 8,
    refferedBy: 3,
    loanAmount: 250000.0,
    loanType: "Personal Loan ",
    address:
      "45 Green Valley Apartments, Andheri West, Mumbai, Maharashtra, India",
    remark: "Customer referred by existing client for business loan.",
    refId: "REF-20251013-009",
    createdAt: "2025-10-13T10:30:00.000Z",
    updatedAt: "2025-10-13T10:30:00.000Z",
    status:"Disbursed"
    
  },
  // you can add more data here
];

const ViewReferalScreen = ({navigation}) => {
    const[searchQuery,setSearchQuery]=useState("")
    const [searchModal,setSeachModal]=useState("")
    const [transcript,setTranscript]=useState("")
    const [referral,setReferral]= useState([])
    const searchBarRef=useRef();
    const {userData}=useContext(UserDataContext)
    const fetchSearchedData=async()=>{
       const respons = await readApi(`refferal?searchTerm=${searchQuery}`)
          setReferral(respons?.refferals)
    }


    const{colors}=useTheme()


    const fetchefralData=async()=>{
      try{
         const respons = await readApi(`refferal?refferedBy=${userData?.user?.id}`)
          setReferral(respons?.refferals)

          console.log(respons.refferals)
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
    },[])
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
