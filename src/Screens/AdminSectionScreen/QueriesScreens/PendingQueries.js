import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { readApi, updateApi } from "../../../Util/UtilApi";
import UserDataContext from "../../../Store/UserDataContext";
import { useSnackbar } from "../../../Store/SnackbarContext";
import QueryCard from "./QueryCard";
import ConfirmModal from "../../../modals/ConfirmModal";
import ViewQueryDetailModal from "./ViewQueryDetailModal";
import NoDataFound from "../../../Components/NoDataFound";

const PendingQueries = ({ pendingRefresh, setPendingRefresh, setIndex }) => {
  const [pendingQueries, setPendingQueries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const PAGE_SIZE = 3;
  const [isLoading, setIsLoading] = useState(false);
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const [resolvedQuery, setResolvedQuery] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [queryDetailModalVisible, setQueryDetailModalVisible] = useState(false);
  const [viewDetailsItem, setViewDetailsItem] = useState(null);

  const { userData } = useContext(UserDataContext);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchData(page);
  }, [page, pendingRefresh]);

  const fetchData = async (pageNum) => {
    const url = `https://reservemyevent.com/fapi/feedback/getAllUnResolvedByPagination?page=${pageNum}&limit=${PAGE_SIZE}`;
    try {
      setIsLoading(true);
      const response = await readApi(url, { Authorization: `Bearer ${userData?.token}` });
      if (pageNum === 1) setPendingQueries(response?.data || []);
      else if (response?.data?.length > 0) setPendingQueries((prev) => [...prev, ...response.data]);

      if (!response?.data || response?.data?.length === 0) setHasMorePages(false);
    } catch (error) {
      showSnackbar("No Pending Queries Found", "error");
      setPendingQueries([]);
      setHasMorePages(false);
    } finally {
      setIsLoading(false);
      setPullRefreshing(false);
    }
  };

  const loadMoreData = () => {
    if (hasMorePages && !isLoading) setPage((prev) => prev + 1);
  };

  const handleQueryResolved = async () => {
    try {
      await updateApi(`https://reservemyevent.com/fapi/feedback/updateFeedback/${resolvedQuery?.id}`, { isResolved: true }, { Authorization: `Bearer ${userData?.token}` });
      setPage(1);
      setHasMorePages(true);
      setPendingRefresh((prev) => !prev);
      setConfirmModalVisible(false);
      showSnackbar("Query Resolved Successfully", "success");
      setIndex(1);
    } catch (error) {
      showSnackbar("Something went wrong", "error");
    }
  };

  const toggleQueryDetailModal = () => setQueryDetailModalVisible((prev) => !prev);

  const onRefresh = () => {
    setPage(1);
    setHasMorePages(true);
    setPendingRefresh((prev) => !prev);
    setPullRefreshing(true);
  };

  return (
    <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
      <FlatList
        data={pendingQueries}
        renderItem={({ item }) => (
          <QueryCard
            item={item}
            setQueryToAct={setResolvedQuery}
            setConfirmModalVisible={setConfirmModalVisible}
            setItem={setViewDetailsItem}
            toggleModal={toggleQueryDetailModal}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={pullRefreshing} onRefresh={onRefresh} colors={["#0a6846"]} progressBackgroundColor="#fff" />}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading && <ActivityIndicator size="large" style={{ paddingVertical: 20 }} />}
        ListEmptyComponent={<NoDataFound textString="No Queries Found" />}
      />

      {confirmModalVisible && (
        <ConfirmModal
          visible={confirmModalVisible}
          message="Are you sure you want to mark this query as resolved?"
          heading="Confirmation Message"
          setVisible={setConfirmModalVisible}
          handlePress={handleQueryResolved}
          buttonTitle="Resolved"
        />
      )}

      {queryDetailModalVisible && (
        <ViewQueryDetailModal item={viewDetailsItem} queryDetailModalVisible={queryDetailModalVisible} toggleModal={toggleQueryDetailModal} />
      )}
    </View>
  );
};

export default PendingQueries;
