import React, { useState } from "react";
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
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { fontFamily, statusOptions, loanTypes } from "../../Util/UtilApi"; // Import your options

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
}) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(sortBy || "");
  const [selectedStatus, setSelectedStatus] = useState(""); // New state for status
  const [selectedLoanType, setSelectedLoanType] = useState(""); // New state for loan type
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const dateFilters = [
    { label: "1 Month", value: "1month" },
    { label: "3 Months", value: "3months" },
    { label: "6 Months", value: "6months" },
    { label: "Date Wise", value: "datewise" },
  ];

  const typeFilters = [
    { label: "Gst", value: "gst" },
    { label: "Provisional", value: "provisional" },
  ];

  const handleRemoveFilter = () => {
    setSelectedValue("");
    setSortBy("");
  
    setStatusFilter("");
    setLoanTypeFilter("");
    setSelectedStatus("");
    setSelectedLoanType("");
    setDateRange({ startDate: null, endDate: null });
  };

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

    setDateRange(prev => {
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
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>

              {/* Remove Filter Button */}
              <TouchableOpacity
                style={styles.removeFilterButton}
                onPress={handleRemoveFilter}
              >
                <Text style={styles.removeFilterText}>{t("Remove Filter")}</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>{t("Select Filter")}</Text>

              {/* Date Filters */}
              <View style={styles.optionList}>
                {dateFilters.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
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
                        selectedValue === option.value && {
                          fontWeight: "bold",
                          color: "#6200EA",
                        },
                      ]}
                    >
                      {t(option.label)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Type Filter */}
             
              {/* Status Filter */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={(value) => {
                    setSelectedStatus(value);
                    setStatusFilter(value);
                  }}
                >
                  <Picker.Item label={t("Select Status")} value="" />
                  {statusOptions.map((option, index) => (
                    <Picker.Item key={index} label={t(option.label)} value={option.value} />
                  ))}
                </Picker>
              </View>

              {/* Loan Type Filter */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedLoanType}
                  onValueChange={(value) => {
                    setSelectedLoanType(value);
                    setLoanTypeFilter(value);
                  }}
                >
                  <Picker.Item label={t("Select Loan Type")} value="" />
                  {loanTypes.map((option, index) => (
                    <Picker.Item key={index} label={t(option.label)} value={option.value} />
                  ))}
                </Picker>
              </View>

              {/* Date Pickers */}
              {selectedValue === "datewise" && (
                <>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={dateRange.startDate ? new Date(dateRange.startDate) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(e, date) => handleDateChange(e, date, "startDate")}
                    />
                  )}
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={dateRange.endDate ? new Date(dateRange.endDate) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(e, date) => handleDateChange(e, date, "endDate")}
                    />
                  )}

                  {dateRange.startDate && dateRange.endDate && (
                    <View style={styles.dateDisplayContainer}>
                      <Text style={styles.dateText}>
                        Start Date: {formatDate(dateRange.startDate)}
                      </Text>
                      <Text style={styles.dateText}>
                        End Date: {formatDate(dateRange.endDate)}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity style={styles.okayButton} onPress={handleSubmit}>
                    <Text style={styles.okayButtonText}>OK</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 250,
    alignItems: "center",
    position: "relative",
  },
  closeButton: { position: "absolute", top: 15, right: 15 },
  removeFilterButton: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#f44336",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  removeFilterText: { color: "white", fontWeight: "bold" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  optionList: { width: "100%", marginBottom: 10 },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  optionText: { fontSize: 16 },
  pickerContainer: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  dateDisplayContainer: { marginTop: 10, alignItems: "center" },
  dateText: { fontSize: 16, marginBottom: 5 },
  okayButton: {
    marginTop: 20,
    backgroundColor: "#6200EA",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  okayButtonText: { color: "white", fontSize: 16 },
});

export default FilterModal;
