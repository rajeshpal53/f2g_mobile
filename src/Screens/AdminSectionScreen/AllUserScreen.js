
import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Searchbar, FAB } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
// import Voice from "@react-native-voice/voice"; // Import Voice for speech recognition
import UserDataContext from "../../Store/UserDataContext";
import { fontSize, readApi } from "../../Util/UtilApi";
import { NORM_URL } from "../../Util/UtilApi";
import { getRandomImage } from "../../Util/UtilApi";
import UserCard from "../../Components/Cards/UserCard";
import Searchbarwithmic from "../../Components/Searchbarwithmic";
import OpenMicModal from "../../Components/Modal/Openmicmodal";
import NoDataFound from "../../UI/NoDataFound";
const AllUser = ({ navigation }) => {
  const { userData } = useContext(UserDataContext);
  const searchBarRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // const [isRecording, setIsRecording] = useState(false); // Mic recording state
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const PAGE_SIZE = 5;

  useEffect(() => {
    
    if(searchQuery?.length <= 0) {
      setSearchedData([]);
      setSearchCalled(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchData(page);
  }, [page]);

 
  // Fetch data from API
  const fetchData = async (pageNum) => {
    const url = `users?page=${pageNum}&size=${PAGE_SIZE}`;
    try {
      setIsLoading(true);
      const response = await readApi(url, {
        Authorization: `Bearer ${userData.token}`,
      });
      console.log(JSON.stringify(response));

      //  const image = response.users[1].profilePicurl
      //   console.log("image is jayesh 1 ", image)

      if (response?.users?.length > 0) {
        setUsersData((prevData) => [...prevData, ...response.users]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsersData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchedData = async () => {
    try {
      setSearchCalled(true);
      setIsLoading(true);
      const trimmedQuery = searchQuery?.trim();

      let api = `users/searchUser?searchTerm=${trimmedQuery}`;

      const response = await readApi(api, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.token}`,
      });

      if (response?.users?.length > 0) {
        setSearchedData(response?.users);
      } else {
        setSearchedData([]);
      }
    } catch (error) {
      if (error?.status === 404) {
        setSearchedData([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("usersData is changed , ", usersData);
  // }, [usersData])

  // Load more data when reaching the end
  const loadMoreData = () => {
    if (searchedData?.length <= 0 && !isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment Page number
    }
  };

  const handleDataFromEditProfile = (updatedData, index) => {
    console.log("updated data is , ", updatedData);
    console.log("updated index is , ", index);

    if (updatedData && index >= 0) {
      console.log("Under if the if ");
      const dataForUpdating = [...usersData];

      dataForUpdating[index] = updatedData;

      console.log("data 12 , ", dataForUpdating);

      try {
        setUsersData(dataForUpdating);
      } catch (error) {
        console.log("error is the , updata , ", error);
      }

      console.log("data 13 , ", dataForUpdating);
    }
  };

  const handleEditProfile = (item, index) => {
    navigation.navigate("EditProfile", {
      item: item,
      onGoBack: (updatedData) => handleDataFromEditProfile(updatedData, index),
      isAdmin: true,
    });
  };

  const handleSearchBar = () => {
    searchBarRef.current.blur();
  };

  const Loader = () => {
    if (!isLoading) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Searchbar
        placeholder="Search User by name or mobile"
        style={styles.searchbar}
        onChangeText={setSearchQuery}
        value={searchQuery}
        iconColor="rgba(0,0,0,0.5)"
        placeholderTextColor={"rgba(0,0,0,0.5)"}
        right={() => (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => {
              if (isRecording) {
                stopRecording();
              } else {
                startRecording();
              }
            }}
          >
            <MaterialIcons
              name={isRecording ? "mic" : "mic-none"}
              size={24}
              color="rgba(0,0,0,0.4)"
            />
          </TouchableOpacity>
        )}
      /> */}

      <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={setsearchmodal}
        setTranscript={setTranscript}
        placeholderText="Search User by name ..."
        refuser={searchBarRef}
        searchData={fetchSearchedData}
      />

      {usersData.length > 0 ? (
        <FlatList
          data={( searchQuery?.length > 0 && searchCalled ) ? searchedData : usersData}
          renderItem={({ item, index }) => (
            <UserCard
              item={item}
              index={index}
              navigation={navigation}
              handleEditProfile={handleEditProfile}
            />
          )}
          // renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          onScrollBeginDrag={handleSearchBar}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={Loader}
          ListEmptyComponent={
            // <View style={styles.empty}><Text>No Data Found</Text></View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: "40%",
              }}
            >
              <NoDataFound textString={"No Users Found"} />
            </View>
          }

          // ListFooterComponent={
          //   isLoading && (
          //     <ActivityIndicator
          //       size="large"
          //       color="#0000ff"
          //       style={styles.loader}
          //     />
          //   )
          // }
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <NoDataFound textString={"No Users Found"} />
        </View>
      )}

      {searchmodal && (
        <OpenMicModal
          modalVisible={searchmodal}
          setModalVisible={setsearchmodal}
          transcript={transcript}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
  },

  // searchbar: {
  //   marginBottom: 18,
  //   borderRadius: 10,
  //   backgroundColor: "#EDEDED",

  // },
  searchbar: {
    marginBottom: 18,
    borderRadius: 10,
    backgroundColor: "#EDEDED",
    height: 45, // Reduced height
    paddingHorizontal: 8,
    marginHorizontal: 2,
  },
  searchbarInput: {
    fontSize: 15, // Adjusted font size
    fontFamily: "Poppins-Medium",
    alignSelf: "center",
    padding: 0, // Remove extra padding
  },
  micButton: {
    marginRight: 10,
    justifyContent: "center", // Center the icon vertically
  },
  cardContainer: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 3,
    shadowOffset: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  userDetailsContainer: {
    flex: 1,
    marginLeft: 18,
    marginBottom: 1,
  },
  userName: {
    fontFamily: "Poppins-Bold",
    // fontWeight: "bold",
    fontSize: 15,
    color: "rgba(0,0,0,0.7)",
    marginBottom: 5,
  },
  userPhone: {
    fontSize: fontSize.label,
    fontFamily: "Poppins-Bold",
    color: "rgba(0,0,0,0.3)",

    marginBottom: 3,
    marginLeft: 5,
  },
  address: {
    fontSize: fontSize.label,
    fontFamily: "Poppins-Medium",
    color: "rgba(0,0,0,0.3)",

    marginLeft: 5,
    marginRight: 8,
  },
  loader: {
    marginVertical: 10,
  },
  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    backgroundColor: "#1bd18f",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AllUser;
