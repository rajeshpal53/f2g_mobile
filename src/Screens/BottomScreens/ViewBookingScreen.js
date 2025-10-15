import React, { useRef, useState,useContext,useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ReferralCard from "../../Components/Cards/RefralCard";
import Searchbarwithmic from "../../Components/Searchbarwithmic";
import { FAB } from "react-native-paper";
import { useTheme } from "../../Constants/Theme";
import { MaterialIcons } from "@expo/vector-icons/";
import BookingCard from "../../Components/Cards/BookingCard";
import UserDataContext from "../../Store/UserDataContext";
import { readApi } from "../../Util/UtilApi";
const sampleData = [
  {
    id: 1,
    name: "Yogesh Gahane",
    usersfk: 12,
    bookedBy: 5,
    loanAmount: 50000.0,
    tentativeBillAmount: 75000.0,
    loanAccountNumber: "LN20251013001",
    loanType: "1",
    address: "123 Celebration Street, Pune, Maharashtra, India",
    remark: "Booking confirmed for the wedding event scheduled next month.",
    bookId: "BK-20251013-001",
    createdAt: "2025-10-13T10:15:00.000Z",
    updatedAt: "2025-10-13T10:15:00.000Z",
  },
  {
    id: 2,
    name: "Mayur Lakhade",
    usersfk: 12,
    bookedBy: 5,
    loanAmount: 50000.0,
    tentativeBillAmount: 75000.0,
    loanAccountNumber: "LN20251013001",
    loanType: "1",
    address: "123 Celebration Street, Pune, Maharashtra, India",
    remark: "Booking confirmed for the wedding event scheduled next month.",
    bookId: "BK-20251013-001",
    createdAt: "2025-10-13T10:15:00.000Z",
    updatedAt: "2025-10-13T10:15:00.000Z",
  },
  // you can add more data here
];

const ViewBookingScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchModal, setSeachModal] = useState("");
  const [transcript, setTranscript] = useState("");
  const [bookings,setBookings]=useState([])
  const searchBarRef = useRef();
      const {userData}=useContext(UserDataContext)

  const fetchSearchedData = () => {};


   const fetchefralData=async()=>{
        try{
           const respons = await readApi(`booking?bookedBy=${userData?.user?.id}`)
            setBookings(respons?.bookings)
  
            console.log(respons.bookings)
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

  const { colors } = useTheme();
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
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BookingCard booking={item} />}
        showsVerticalScrollIndicator={false}
      />
      <FAB
        icon={() => <MaterialIcons name="add" size={24} color="#fff" />}
        style={styles.fab}
        color="#fff"
        onPress={() => {
          navigation.navigate("BookingScreen");
        }}
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

export default ViewBookingScreen;
