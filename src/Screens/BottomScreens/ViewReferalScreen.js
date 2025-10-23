import React, { useRef, useState, useEffect, useContext } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator } from "react-native";
import ReferralCard from "../../Components/Cards/RefralCard";
import Searchbarwithmic from "../../Components/Searchbarwithmic";
import { Button, FAB } from "react-native-paper";
import { useTheme } from "../../Constants/Theme";
import { MaterialIcons } from "@expo/vector-icons/";
import { readApi, formatDate } from "../../Util/UtilApi";
import UserDataContext from "../../Store/UserDataContext";
import { useIsFocused } from "@react-navigation/native";
import NoDataFound from "../../UI/NoDataFound";
import FilterModal from "../../Components/Modal/FilterModal";
import OpenMicModal from "../../Components/Modal/Openmicmodal";
import DownloadMenuButton from "../../Components/DownloadMenuButton";
import { useDownloadReferralBooking } from "../../Util/useDownloadReferralBooking";
const ViewReferralScreen = ({ navigation,route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [referral, setReferral] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [dateRange, setDateRange] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [loanTypeFilter, setLoanTypeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const {isAdmin}=route?.params||false
const [transcript, setTranscript] = useState("");
  const [searchmodal, setsearchmodal] = useState(false);
  const [filterAdded,setFilterAdded]=useState(false)
  const {DownloadLoading}=useDownloadReferralBooking()
  // pagination states
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [apiError, setApiError] = useState(false);

  const searchBarRef = useRef();
  const { userData } = useContext(UserDataContext);
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  

  // Build API URL dynamically
 const buildApiUrl = (pageNum = 1, downloadUrl = false) => {
  let url = "";

  if (downloadUrl) {
    // Download endpoint
    url = `refferal/downloadRefferals?page=1`;
  } else if (isAdmin) {
    // Admin view
    url = `refferal?page=${pageNum}&limit=5`;
  } else {
    // Normal user view
    url = `refferal?refferedBy=${userData?.user?.id}&page=${pageNum}`;
  }

  // Apply filters to all (including download)
  if (sortBy && sortBy !== "datewise") url += `&dateRange=${sortBy}`;
  if (loanTypeFilter) url += `&loantypefk=${loanTypeFilter}`;
  if (statusFilter) url += `&statusfk=${statusFilter}`;

  if (dateRange?.startDate && dateRange?.endDate) {
    url += `&startDate=${formatDateWithoutTime(dateRange.startDate)}&endDate=${formatDateWithoutTime(dateRange.endDate)}`;
  }

  if (searchQuery) url += `&searchTerm=${searchQuery}`;

  // Add page for download only if not already handled
  if (downloadUrl && !isAdmin) url += `&page=${pageNum}`;

  return url;
};


  // 🔹 Fetch data from API
  const fetchReferrals = async (pageNum = 1, force = false) => {
    if (!force && pageNum === 1 && !mainLoading) return;
    if (pageNum === 1) {
      setMainLoading(true);
      setHasMore(true);
      setApiError(false);
    }
    setIsLoading(true);
    try {
      const api = buildApiUrl(pageNum);
      console.log(api,"api")
      const response = await readApi(api);

      if (pageNum === 1) {
        setReferral(response.refferals || []);
      } else if (response?.refferals?.length > 0) {
        setReferral((prev) => [...prev, ...response.refferals]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setApiError(true);
      if (pageNum === 1) setReferral([]);
      console.error("API fetch failed:", err);
    } finally {
      setIsLoading(false);
      setMainLoading(false);
    }
  };
   useEffect(() => {
    const hasFilters =
      (sortBy && sortBy !== "datewise") ||
      (dateRange?.startDate && dateRange?.endDate) ||
      !!statusFilter ||
      !!loanTypeFilter ||
      !!typeFilter ||
      (searchQuery && searchQuery.trim() !== "");
  
    setFilterAdded(hasFilters);
  }, [sortBy, dateRange, statusFilter, loanTypeFilter, typeFilter, searchQuery]);
  

  // 🔹 Initial or filter change load
  useEffect(() => {
    if (!apiError) {
      setPage(1);
      setHasMore(true);
      fetchReferrals(1, true);
    }
  }, [sortBy, typeFilter, statusFilter, dateRange, isFocused]);

  // 🔹 Pagination loader
  useEffect(() => {
    if (page > 1) {
      fetchReferrals(page);
    }
  }, [page]);

  // 🔹 Search handler
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        setPage(1);
        fetchReferrals(1, true);
      } else if (searchQuery === "") {
        fetchReferrals(1, true);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // 🔹 Load more data
  const loadMoreData = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  

  return (
    <View style={styles.container}>
     <View style={{ backgroundColor: "red" }}>
  {isAdmin && (
    DownloadLoading ? (
      <ActivityIndicator />
    ) : (
      <DownloadMenuButton
        buildApiUrl={buildApiUrl}
        mode={"referral"}
        filterAdded={filterAdded}
      />
    )
  )}
</View>
      {/* <Button style={{position:"absolute" ,top:-50 , right:5, zIndex:120, height:100}}> <MaterialIcons name="download" size={35} /></Button> */}
      <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={() => {}}
        placeholderText="Search referrals..."
        refuser={searchBarRef}
        setTranscript={setTranscript}
        searchData={() => fetchReferrals(1, true)}
      />

      <FlatList
        data={referral}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ReferralCard referral={item} navigation={navigation} isAdmin={isAdmin} />
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : null
        }
        ListEmptyComponent={
          !mainLoading && (
            <View
              style={{
                flex: 1,
                marginVertical: 140,
                paddingVertical: 50,
                alignItems: "center",
              }}
            >
              <NoDataFound textString={"No Referral Found"} />
            </View>
          )
        }
      />

      {/* Filter FAB */}
      <FAB
        style={styles.filterFab}
        icon="filter"
        onPress={() => setModalVisible(true)}
        color="#fff"
      />

      {/* Add FAB */}
      <FAB
        icon={() => <MaterialIcons name="add" size={24} color="#fff" />}
        style={styles.fab}
        color="#fff"
        onPress={() => navigation.navigate("ReferralForm")}
      />

      {/* Filter Modal */}
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
          setStatusFilter={setStatusFilter}
          setLoanTypeFilter={setLoanTypeFilter}
          statusFilter={statusFilter}
          loanTypeFilter={loanTypeFilter}
          setFilterAdded={setFilterAdded}
        />
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
    paddingVertical: 10,
  },
  filterFab: {
    position: "absolute",
    margin: 16,
    right: 3,
    bottom: 90,
    backgroundColor: "#26a0df",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 16,
    backgroundColor: "#007BFF",
    borderRadius: 13,
    elevation: 5,
  },
});

export default ViewReferralScreen;
