import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { readApi } from "../../../Util/UtilApi";
import UserDataContext from "../../../Store/UserDataContext";
import { useSnackbar } from "../../../Store/SnackbarContext";
import QueryCard from "./QueryCard";
import ViewQueryDetailModal from "./ViewQueryDetailModal";
import NoDataFound from "../../../Components/NoDataFound";
import { useTheme } from "../../../Constants/Theme";

const PAGE_SIZE = 3;

const ResolvedQueries = ({ pendingRefresh }) => {
  const { colors } = useTheme();
  const [queries, setQueries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const [viewDetailsItem, setViewDetailsItem] = useState(null);
  const [queryDetailModalVisible, setQueryDetailModalVisible] = useState(false);

  const { userData } = useContext(UserDataContext);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchData(1, true);
  }, [pendingRefresh]);

  const fetchData = async (pageNum, reset = false) => {
    const url = `feedback/getAllResolvedByPagination?page=${pageNum}&limit=${PAGE_SIZE}`;
    try {
      setIsLoading(true);
      const response = await readApi(url, {
        Authorization: `Bearer ${userData?.token}`,
      });

      const list = response?.data || [];
      if (reset) setQueries(list);
      else setQueries((prev) => [...prev, ...list]);

      setHasMorePages(!(list.length < PAGE_SIZE || pageNum >= response?.totalPages));
    } catch (error) {
      showSnackbar("Failed to load resolved queries", "error");
      setQueries([]);
      setHasMorePages(false);
    } finally {
      setIsLoading(false);
      setPullRefreshing(false);
    }
  };

  const loadMoreData = () => {
    if (hasMorePages && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    }
  };

  const toggleQueryDetailModal = () =>
    setQueryDetailModalVisible((prev) => !prev);

  const onRefresh = () => {
    setPullRefreshing(true);
    setPage(1);
    setHasMorePages(true);
    fetchData(1, true);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: colors.background }}>
      <FlatList
        data={queries}
        renderItem={({ item }) => (
          <QueryCard
            item={item}
            setItem={setViewDetailsItem}
            toggleModal={toggleQueryDetailModal}
            isResolved
            themeColors={colors}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={pullRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading && page > 1 && (
            <ActivityIndicator size="large" style={{ paddingVertical: 20 }} color={colors.primary} />
          )
        }
        ListEmptyComponent={<NoDataFound textString="No Resolved Queries Found" />}
      />

      {queryDetailModalVisible && (
        <ViewQueryDetailModal
          item={viewDetailsItem}
          queryDetailModalVisible={queryDetailModalVisible}
          toggleModal={toggleQueryDetailModal}
        />
      )}
    </View>
  );
};

export default ResolvedQueries;
