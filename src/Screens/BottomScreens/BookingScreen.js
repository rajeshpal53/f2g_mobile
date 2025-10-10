import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import GenericDropdown from "../../UI/DropDown/GenericDropDown";

const loanTypes = [
  { label: "Home Loan", value: "home" },
  { label: "Personal Loan", value: "personal" },
  { label: "Car Loan", value: "car" },
  { label: "Business Loan", value: "business" },
];

const BookingFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  bookingAmount: Yup.number()
    .typeError("Booking Amount must be a number")
    .required("Booking Amount is required"),
  loanType: Yup.string().required("Loan Type is required"),
  addressLine1: Yup.string().required("Address Line 1 is required"),
  addressLine2: Yup.string(),
  tentativeBill: Yup.number()
    .typeError("Tentative Bill must be a number")
    .required("Tentative Bill is required"),
  loanAccountNumber: Yup.string().required("Loan Account Number is required"),
});

const BookingScreen = () => {
  const theme = useTheme();

  return (
    <Formik
      initialValues={{
        name: "",
        bookingAmount: "",
        loanType: "",
        addressLine1: "",
        addressLine2: "",
        tentativeBill: "",
        loanAccountNumber: "",
      }}
      validationSchema={BookingFormSchema}
      onSubmit={(values) => {
        console.log("Booking Form Submitted: ", values);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ padding: 15, paddingBottom: 50 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              Booking Form
            </Text>

            {/* Name */}
            <TextInput
              label="First Name + Last Name *"
              mode="outlined"
              style={styles.input}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              error={touched.name && errors.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            {/* Booking Amount */}
            <TextInput
              label="Booking Amount *"
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={handleChange("bookingAmount")}
              onBlur={handleBlur("bookingAmount")}
              value={values.bookingAmount}
              error={touched.bookingAmount && errors.bookingAmount}
            />
            {touched.bookingAmount && errors.bookingAmount && (
              <Text style={styles.errorText}>{errors.bookingAmount}</Text>
            )}

            {/* Loan Type Dropdown */}
            <GenericDropdown
              label={"Loan Type *"}
              options={loanTypes}
              selectedValue={values.loanType}
              onValueChange={(val) => setFieldValue("loanType", val)}
              pickerContainerStyle={styles.pickerContainerStyle}
            />
            {touched.loanType && errors.loanType && (
              <Text style={styles.errorText}>{errors.loanType}</Text>
            )}

            {/* Address Line 1 */}
            <TextInput
              label="Customer Address Line 1 *"
              mode="outlined"
              style={styles.input}
              onChangeText={handleChange("addressLine1")}
              onBlur={handleBlur("addressLine1")}
              value={values.addressLine1}
              error={touched.addressLine1 && errors.addressLine1}
            />
            {touched.addressLine1 && errors.addressLine1 && (
              <Text style={styles.errorText}>{errors.addressLine1}</Text>
            )}

            {/* Address Line 2 */}
            <TextInput
              label="Customer Address Line 2"
              mode="outlined"
              style={styles.input}
              onChangeText={handleChange("addressLine2")}
              onBlur={handleBlur("addressLine2")}
              value={values.addressLine2}
              error={touched.addressLine2 && errors.addressLine2}
            />

            {/* Tentative Bill Amount */}
            <TextInput
              label="Tentative Bill Amount *"
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={handleChange("tentativeBill")}
              onBlur={handleBlur("tentativeBill")}
              value={values.tentativeBill}
              error={touched.tentativeBill && errors.tentativeBill}
            />
            {touched.tentativeBill && errors.tentativeBill && (
              <Text style={styles.errorText}>{errors.tentativeBill}</Text>
            )}

            {/* Loan Account Number */}
            <TextInput
              label="Loan Account Number *"
              mode="outlined"
              style={styles.input}
              onChangeText={handleChange("loanAccountNumber")}
              onBlur={handleBlur("loanAccountNumber")}
              value={values.loanAccountNumber}
              error={touched.loanAccountNumber && errors.loanAccountNumber}
            />
            {touched.loanAccountNumber && errors.loanAccountNumber && (
              <Text style={styles.errorText}>{errors.loanAccountNumber}</Text>
            )}

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={{ borderRadius: 10, padding: 8 }}
              >
                Submit Booking
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFF",
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerContainerStyle: {
    marginBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});
