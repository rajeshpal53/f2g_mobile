import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../../Constants/Theme";
import { statusOptions, loanTypes } from "../../Util/UtilApi";

const FilterModal = ({
  isModalVisible,
  setModalVisible,
  setSortBy,
  sortBy,
  dateRange,
  setDateRange,
  formatDate,
  setTypeFilter,
  setStatusFilter,
  setLoanTypeFilter,
  statusFilter,
  loanTypeFilter,
  setFilterAdded,
}) => {
  const { colors, isDark } = useTheme();

  const [selectedValue, setSelectedValue] = useState(sortBy || "");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLoanType, setSelectedLoanType] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const dateFilters = [
    { label: "1 Month", value: "1month" },
    { label: "3 Months", value: "3months" },
    { label: "6 Months", value: "6months" },
    { label: "Date Wise", value: "datewise" },
  ];

  const handleRemoveFilter = () => {
    setSelectedValue("");
    setSortBy("");
    setStatusFilter("");
    setLoanTypeFilter("");
    setSelectedStatus("");
    setSelectedLoanType("");
    setDateRange({ startDate: null, endDate: null });
    setFilterAdded(false);
  };

  useEffect(() => {
    if (isModalVisible) {
      setSelectedStatus(statusFilter || "");
      setSelectedLoanType(loanTypeFilter || "");
      setSelectedValue(sortBy || "");
    }
  }, [isModalVisible, statusFilter, loanTypeFilter, sortBy]);

  const handleSubmit = () => {
    if (selectedValue === "datewise") {
      setSortBy("datewise");
    }
    setModalVisible(false);
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (!selectedDate) {
      if (type === "startDate") setShowStartDatePicker(false);
      if (type === "endDate") setShowEndDatePicker(false);
      return;
    }

    setDateRange((prev) => {
      const newRange = { ...prev };
      if (type === "startDate") {
        newRange.startDate = selectedDate;
        if (prev.endDate && prev.endDate < selectedDate) newRange.endDate = null;
        setShowStartDatePicker(false);
        setTimeout(() => setShowEndDatePicker(true), 100);
      } else if (type === "endDate") {
        newRange.endDate = selectedDate;
        setShowEndDatePicker(false);
      }
      return newRange;
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.modalBackground },
          ]}
        >
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.surface, shadowColor: colors.shadow },
              ]}
            >
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={24} color={colors.text} />
              </TouchableOpacity>

              {/* Remove Filter Button */}
              <TouchableOpacity
                style={[
                  styles.removeFilterButton,
                  { backgroundColor: colors.danger },
                ]}
                onPress={handleRemoveFilter}
              >
                <Text style={[styles.removeFilterText, { color: colors.surface }]}>
                  Remove Filter
                </Text>
              </TouchableOpacity>

              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Filter
              </Text>

              {/* Date Filters */}
              <View style={styles.optionList}>
                {dateFilters.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionItem,
                      {
                        backgroundColor:
                          selectedValue === option.value
                            ? colors.selected
                            : colors.itemBackground,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => {
                      setSelectedValue(option.value);
                      if (option.value === "datewise") setShowStartDatePicker(true);
                      else {
                        setSortBy(option.value);
                        setTypeFilter("");
                        setModalVisible(false);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            selectedValue === option.value
                              ? colors.primary
                              : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Status Filter */}
              <View
                style={[
                  styles.pickerContainer,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.itemBackground,
                  },
                ]}
              >
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={(value) => {
                    setSelectedStatus(value);
                    setStatusFilter(value);
                  }}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item
                    label="Select Status"
                    value=""
                    color={colors.textSecondary}
                  />
                  {statusOptions.map((option, index) => (
                    <Picker.Item
                      key={index}
                      label={option.label}
                      value={option.id}
                      color={colors.text}
                    />
                  ))}
                </Picker>
              </View>

              {/* Loan Type Filter */}
              <View
                style={[
                  styles.pickerContainer,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.itemBackground,
                  },
                ]}
              >
                <Picker
                  selectedValue={selectedLoanType}
                  onValueChange={(value) => {
                    setSelectedLoanType(value);
                    setLoanTypeFilter(value);
                  }}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item
                    label="Select Loan Type"
                    value=""
                    color={colors.textSecondary}
                  />
                  {loanTypes.map((option, index) => (
                    <Picker.Item
                      key={index}
                      label={option.label}
                      value={option.id}
                      color={colors.text}
                    />
                  ))}
                </Picker>
              </View>

              {/* Date Pickers */}
              {selectedValue === "datewise" && (
                <>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={
                        dateRange.startDate
                          ? new Date(dateRange.startDate)
                          : new Date()
                      }
                      mode="date"
                      display="default"
                      onChange={(e, date) => handleDateChange(e, date, "startDate")}
                    />
                  )}
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={
                        dateRange.endDate ? new Date(dateRange.endDate) : new Date()
                      }
                      mode="date"
                      display="default"
                      onChange={(e, date) => handleDateChange(e, date, "endDate")}
                    />
                  )}

                  {dateRange.startDate && dateRange.endDate && (
                    <View style={styles.dateDisplayContainer}>
                      <Text style={[styles.dateText, { color: colors.text }]}>
                        Start Date: {formatDate(dateRange.startDate)}
                      </Text>
                      <Text style={[styles.dateText, { color: colors.text }]}>
                        End Date: {formatDate(dateRange.endDate)}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.okayButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleSubmit}
                  >
                    <Text style={[styles.okayButtonText, { color: colors.surface }]}>
                      OK
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  closeButton: { position: "absolute", top: 15, right: 15 },
  removeFilterButton: {
    position: "absolute",
    top: 15,
    left: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeFilterText: { fontWeight: "bold" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  optionList: { width: "100%", marginBottom: 12 },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  optionText: { fontSize: 16 },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  dateDisplayContainer: { marginTop: 10, alignItems: "center" },
  dateText: { fontSize: 15, marginBottom: 4 },
  okayButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  okayButtonText: { fontSize: 16, fontWeight: "600" },
});

export default FilterModal;
