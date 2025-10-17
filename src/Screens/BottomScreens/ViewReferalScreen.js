import React, { useRef, useState, useEffect, useContext } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator } from "react-native";
import ReferralCard from "../../Components/Cards/RefralCard";
import Searchbarwithmic from "../../Components/Searchbarwithmic";
import { FAB } from "react-native-paper";
import { useTheme } from "../../Constants/Theme";
import { MaterialIcons } from "@expo/vector-icons/";
import { readApi, formatDate } from "../../Util/UtilApi";
import UserDataContext from "../../Store/UserDataContext";
import { useIsFocused } from "@react-navigation/native";
import NoDataFound from "../../UI/NoDataFound";
import FilterModal from "../../Components/Modal/FilterModal";

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
 const buildApiUrl = (pageNum = 1) => {
      let url = `refferal?refferedBy=${userData?.user?.id}&page=${pageNum}`;
  if (isAdmin) url = `refferal?page=${pageNum}&limit=5`;
   if (sortBy&&!sortBy=="datewise") url += `&dateRange=${sortBy}`;
   if (loanTypeFilter) url += `&loantypefk=${loanTypeFilter}`;
   if (statusFilter) url += `&statusfk=${statusFilter}`;
   if (dateRange?.startDate && dateRange?.endDate)
   { 
     console.log(dateRange)
     url += `&startDate=${formatDateWithoutTime(dateRange.startDate)}&endDate=${formatDateWithoutTime(dateRange.endDate)}`;
   }
   if (searchQuery) url += `&searchTerm=${searchQuery}`;
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
      <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={() => {}}
        setTranscript={() => {}}
        placeholderText="Search referrals..."
        refuser={searchBarRef}
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
                justifyContent: "center",
                marginVertical: 120,
                alignItems: "center",
              }}
            >
              <NoDataFound textString={"No Referrals Found"} />
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
