import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import GenericDropdown from "../../UI/DropDown/GenericDropDown";

const loanTypes = [
  { label: "Home Loan", value: "home" },
  { label: "Personal Loan", value: "personal" },
  { label: "Car Loan", value: "car" },
  { label: "Business Loan", value: "business" },
];

const ReferralFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  loanAmount: Yup.number()
    .typeError("Loan Amount must be a number")
    .required("Loan Amount is required"),
  loanType: Yup.string().required("Loan Type is required"),
  addressLine1: Yup.string().required("Address Line 1 is required"),
  addressLine2: Yup.string(),
  remark: Yup.string().max(250, "Remark should be less than 250 characters"),
});

const ReferralForm = () => {
  return (
    <Formik
      initialValues={{
        name: "",
        loanAmount: "",
        loanType: "",
        addressLine1: "",
        addressLine2: "",
        remark: "",
      }}
      validationSchema={ReferralFormSchema}
      onSubmit={(values) => {
        console.log("Referral Form Submitted: ", values);
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
        <ScrollView style={{ flex: 1, padding: 15 }}>
          <Text style={styles.title}>Referral Form</Text>

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

          {/* Loan Amount */}
          <TextInput
            label="Loan Amount *"
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={handleChange("loanAmount")}
            onBlur={handleBlur("loanAmount")}
            value={values.loanAmount}
            error={touched.loanAmount && errors.loanAmount}
          />
          {touched.loanAmount && errors.loanAmount && (
            <Text style={styles.errorText}>{errors.loanAmount}</Text>
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

          {/* Remark */}
          <TextInput
            label="Remark"
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
            onChangeText={handleChange("remark")}
            onBlur={handleBlur("remark")}
            value={values.remark}
            error={touched.remark && errors.remark}
          />
          {touched.remark && errors.remark && (
            <Text style={styles.errorText}>{errors.remark}</Text>
          )}

          {/* Submit Button */}
          <Pressable style={{ marginTop: 20 }}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={{ borderRadius: 10, padding: 5 }}
            >
              Submit Referral
            </Button>
          </Pressable>
        </ScrollView>
      )}
    </Formik>
  );
};

export default ReferralForm;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
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
});
