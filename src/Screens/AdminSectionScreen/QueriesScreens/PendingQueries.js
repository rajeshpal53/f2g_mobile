import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { readApi, updateApi } from "../../../Util/UtilApi";
import UserDataContext from "../../../Store/UserDataContext";
import { useSnackbar } from "../../../Store/SnackbarContext";
import QueryCard from "./QueryCard";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import ViewQueryDetailModal from "./ViewQueryDetailModal";
import NoDataFound from "../../../Components/NoDataFound";
import { useTheme } from "../../../Constants/Theme";

const PAGE_SIZE = 3;

const PendingQueries = ({ pendingRefresh, setPendingRefresh, setIndex }) => {
  const { colors } = useTheme();
  const { userData } = useContext(UserDataContext);
  const { showSnackbar } = useSnackbar();

  const [pendingQueries, setPendingQueries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pullRefreshing, setPullRefreshing] = useState(false);

  const [resolvedQuery, setResolvedQuery] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false); // ✅ modal button loading
  const [queryDetailModalVisible, setQueryDetailModalVisible] = useState(false);
  const [viewDetailsItem, setViewDetailsItem] = useState(null);

  useEffect(() => {
    fetchData(1, true);
  }, [pendingRefresh]);

  const fetchData = async (pageNum, reset = false) => {
    const url = `feedback/getAllUnResolvedByPagination?page=${pageNum}&limit=${PAGE_SIZE}`;
    try {
      setIsLoading(true);
      const response = await readApi(url, {
        Authorization: `Bearer ${userData?.token}`,
      });

      const list = response?.data || [];
      if (reset) setPendingQueries(list);
      else setPendingQueries((prev) => [...prev, ...list]);

      setHasMorePages(!(list.length < PAGE_SIZE || pageNum >= response?.totalPages));
    } catch (error) {
      showSnackbar("Failed to load queries", "error");
      setPendingQueries([]);
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

  // ✅ Handle mark as resolved with modal loading
  const handleQueryResolved = async () => {
    try {
      setModalLoading(true);
      await updateApi(
        `feedback/updateFeedback/${resolvedQuery?.id}`,
        { isResolved: true },
        { Authorization: `Bearer ${userData?.token}` }
      );
      setConfirmModalVisible(false);
      setResolvedQuery(null);
      setIndex(1);
      setPendingRefresh((prev) => !prev);
      showSnackbar("Query marked as resolved", "success");
    } catch (error) {
      showSnackbar("Failed to resolve query", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const toggleQueryDetailModal = () => setQueryDetailModalVisible((prev) => !prev);

  const onRefresh = () => {
    setPullRefreshing(true);
    setPage(1);
    setHasMorePages(true);
    fetchData(1, true);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: colors.background }}>
      <FlatList
        data={pendingQueries}
        renderItem={({ item }) => (
          <QueryCard
            item={item}
            setQueryToAct={setResolvedQuery}
            setConfirmModalVisible={setConfirmModalVisible}
            setItem={setViewDetailsItem}
            toggleModal={toggleQueryDetailModal}
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
        ListEmptyComponent={<NoDataFound textString="No Pending Queries Found" />}
      />

      {/* ✅ Confirm Modal with loading state */}
      <ConfirmModal
        visible={confirmModalVisible}
        message="Mark this query as resolved?"
        heading="Confirm Action"
        setVisible={setConfirmModalVisible}
        handlePress={handleQueryResolved}
        buttonTitle="Mark Resolved"
        themeColors={colors}
        loading={modalLoading} // pass loading state to modal
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

export default PendingQueries;
