import React, { useRef, useState, useContext, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../Constants/Theme";
import { useIsFocused } from "@react-navigation/native";
import { readApi,formatDateWithoutTime } from "../../Util/UtilApi";
import BookingCard from "../../Components/Cards/BookingCard";
import Searchbarwithmic from "../../Components/Searchbarwithmic";
import NoDataFound from "../../UI/NoDataFound";
import FilterModal from "../../Components/Modal/FilterModal";
import { formatDate,} from "../../Util/UtilApi";
import UserDataContext from "../../Store/UserDataContext";
import { useSnackbar } from "../../Store/SnackbarContext";
import Loader from "../../UI/Loader"; // ✅ add your loader component
import OpenMicModal from "../../Components/Modal/Openmicmodal";
import DownloadMenuButton from "../../Components/DownloadMenuButton";
import { useDownloadReferralBooking } from "../../Util/useDownloadReferralBooking";

const ViewBookingScreen = ({ navigation,route }) => {
  const searchBarRef = useRef();
  const { userData } = useContext(UserDataContext);
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();
  const isFocused = useIsFocused();
  const {isAdmin}=route?.params||false

  // 🔹 States
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchModal, setSeachModal] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [dateRange, setDateRange] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [loanTypeFilter, setLoanTypeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchCalled, setSearchCalled] = useState(false);
  const [transcript, setTranscript] = useState("");
    const [searchmodal, setsearchmodal] = useState(false);
const [filterAdded,setFilterAdded]=useState(false)
const{DownloadLoading}= useDownloadReferralBooking();


const styles=Bookingstyles(colors)
  const buildApiUrl = (pageNum = 1, downloadUrl = false) => {
  let url = "";

  if (downloadUrl) {
    // Download endpoint
    url = `booking/downloadBookings?page=1`;
  } else if (isAdmin) {
    // Admin view
    url = `booking?page=${pageNum}&limit=5`;
  } else {
    // Normal user view
    url = `booking?bookedBy=${userData?.user?.id}&page=${pageNum}&limit=5`;
  }

  // Apply filters for both normal and download cases
  if (sortBy && sortBy !== "datewise") url += `&dateRange=${sortBy}`;
  if (loanTypeFilter) url += `&loantypefk=${loanTypeFilter}`;
  if (statusFilter) url += `&statusfk=${statusFilter}`;

  if (dateRange?.startDate && dateRange?.endDate) {
    url += `&startDate=${formatDateWithoutTime(dateRange.startDate)}&endDate=${formatDateWithoutTime(dateRange.endDate)}`;
  }

  if (searchQuery) url += `&searchTerm=${searchQuery}`;

  // Add pagination for download URLs if needed
  if (downloadUrl && !isAdmin) url += `&page=${pageNum}&limit=5`;

  return url;
};


  // 🔹 Build API URL dynamically
  const fetchBookings = async (pageNum = 1, force = false) => {
  if (apiError && !force) return;
  if (!force && pageNum === 1 && mainLoading) return;
  if (force) setApiError(false);

  if (pageNum === 1) {
    setMainLoading(true);
    setHasMore(true);
    if (force) setBookings([]);
  }
  setIsLoading(true);

  try {
    const api = buildApiUrl(pageNum);
    console.log(api, pageNum, "api and page");
    const response = await readApi(api);

    if (pageNum === 1) {
      setBookings(response.bookings || []);
    } else if (response?.bookings?.length > 0) {
      setBookings((prev) => [...prev, ...response.bookings]);
    } else {
      setHasMore(false);
    }
  } catch (err) {
    // mark API error and stop further pagination attempts
    setApiError(true);
    setHasMore(false);

    if (pageNum === 1) setBookings([]);
    console.error("API fetch failed:", err);
    showSnackbar("Failed to fetch bookings", "error");
  } finally {
    setIsLoading(false);
    setMainLoading(false);
  }
};

// 🔹 Pagination: Load More
const loadMoreData = () => {
  // don't load more if currently loading, no more items, or we've hit an API error
  if (!isLoading && hasMore && !apiError) {
    setPage((prev) => prev + 1);
  }
};

// 🔹 Fetch more data when page changes
useEffect(() => {
  if (page > 1) {
    if (searchQuery?.length > 0 && searchCalled) {
      fetchSearchedData(searchQuery, page);
    } else {
      fetchBookings(page);
    }
  }
}, [page]);

// 🔹 Handle filters, type changes, or error reset
useEffect(() => {
  // when filters change we want to explicitly force a refresh.
  // If apiError is true we won't fetch — keep that guard so the UI can surface the error,
  // but if you want automatic retry on filter-change remove the apiError check.
  if (!apiError) {
    setPage(1);
    setSearchCalled(false);
    setHasMore(true);
    fetchBookings(page, true); // force = true => explicit refresh, clears apiError if set
  }
}, [sortBy, typeFilter, loanTypeFilter, dateRange, statusFilter,searchQuery]);
  // 🔹 Refresh data when screen refocuses
  useEffect(() => {
    if (isFocused) 
       setPage(1);
    fetchBookings(1, true);
  }, [isFocused]);

  // 🔹 Handle search
  const fetchSearchedData = async (query = searchQuery, pageNum = 1) => {
    if (!query.trim()) return;
    setSearchCalled(true);
    try {
      const response = await readApi(
        `booking?bookedBy=${userData?.user?.id}&searchTerm=${query}&page=${pageNum}`
      );
      if (pageNum === 1) {
        setBookings(response.bookings || []);
      } else if (response?.bookings?.length > 0) {
        setBookings((prev) => [...prev, ...response.bookings]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Search failed:", err);
      showSnackbar("Search failed", "error");
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


  return (
    <View style={[styles.container,{backgroundColor:colors?.background}]}>
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
      {/* 🔍 Search Bar */}
      <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={setSeachModal}
        setTranscript={setTranscript}
        placeholderText="Search bookings..."
        refuser={searchBarRef}
 searchData={()=>
        {
           setSearchCalled(true);
    setPage(1);
    fetchBookings(1, true);
        }
        }
        fetchData={() => {
  setSearchQuery("");
  setPage(1)
  setSearchCalled(false);
  setApiError(false);
  setHasMore(true);
}}
      />

      {/* 🔹 Booking List */}
      <FlatList
        data={bookings}
        keyExtractor={(item,index) => index}
        renderItem={({ item }) => (
          <BookingCard booking={item} navigation={navigation} isAdmin={isAdmin} />
        )}
        showsVerticalScrollIndicator={false}
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
              <NoDataFound textString={"No Bookings Found"} />
            </View>
          )
        }
        ListFooterComponent={isLoading ? <Loader /> : null}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
      />

      {/* 🔹 Filter FAB */}
      <FAB
        style={styles.filterFab}
        icon="filter"
        onPress={() => setModalVisible(true)}
        color="#fff"
      />

      {/* 🔹 Add Booking FAB */}
      <FAB
        icon={() => <MaterialIcons name="add" size={24} color="#fff" />}
        style={styles.addFab}
        color="#fff"
        onPress={() => navigation.navigate("BookingScreen")}
      />

      {/* 🔹 Filter Modal */}
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
          loanTypeFilter={loanTypeFilter}
          statusFilter={statusFilter}
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

const Bookingstyles =(colors)=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.backgroundColor,
    paddingVertical: 10,
  },
  addFab: {
    position: "absolute",
    bottom: 30,
    right: 16,
    backgroundColor: colors?.main,
    borderRadius: 13,
    elevation: 5,
  },
  filterFab: {
    position: "absolute",
    margin: 16,
    right: 3,
    bottom: 90,
    backgroundColor: colors?.fab,
  },
});

export default ViewBookingScreen;
