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
import NoDataFound from "../../UI/NoDataFound";
import FilterModal from "../../Components/Modal/FilterModal";
import { formatDate } from "../../Util/UtilApi";

const ViewBookingScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchModal, setSeachModal] = useState("");
  const [transcript, setTranscript] = useState("");
  const [bookings,setBookings]=useState([])
  const searchBarRef = useRef();
      const {userData}=useContext(UserDataContext)
const [isModalVisible,setModalVisible]=useState(false)
const [sortBy, setSortBy] = useState("");
  const [dateRange, setDateRange] = useState({});
    const [typeFilter, setTypeFilter] = useState("");


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
         ListEmptyComponent={
          <View style={{ flex:1,justifyContent:"flex",   marginVertical:140,paddingVertical: 50,alignItems: "center"}}>
                      <NoDataFound textString={"No Bookings Found"}/>

            </View>
  }
      />

      <FAB
            style={{
              position: "absolute",
              margin: 16,
              right: 3,
              bottom: 90,
              backgroundColor: "#26a0df",
            }}
            icon="filter"
            onPress={() => setModalVisible(true)}
            color="#fff"
          />
      <FAB
        icon={() => <MaterialIcons name="add" size={24} color="#fff" />}
        style={styles.fab}
        color="#fff"
        onPress={() => {
          navigation.navigate("BookingScreen");
        }}
      />

      
            {isModalVisible && (
        <FilterModal
          setModalVisible={setModalVisible}
          isModalVisible={isModalVisible}
          setSortBy={setSortBy}
          sortBy={sortBy}
          dateRange={dateRange}
          setDateRange={setDateRange}
          formatDate={formatDate}
          setTypeFilter={setTypeFilter}

        />)}
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
