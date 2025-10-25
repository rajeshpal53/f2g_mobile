import React, { useRef, useEffect, useContext, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import GenericDropdown from "../../UI/DropDown/GenericDropDown";
import { useTheme } from "../../Constants/Theme";
import {
  loanTypes,
  statusOptions,
  statusfkByValues,
  valuesByStatusfk,
  createApi,
  updateApi,
  selectLoanFromValuesById,
} from "../../Util/UtilApi";
import UserDataContext from "../../Store/UserDataContext";
import { useSnackbar } from "../../Store/SnackbarContext";

const ReferralFormSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),
  loanAmount: Yup.number()
    .typeError("Loan Amount must be a number")
    .positive("Loan Amount must be positive")
    .required("Loan Amount is required"),
  loanType: Yup.string().required("Loan Type is required"),
  street: Yup.string()
    .max(100, "Street / Area must be less than 100 words")
    .required("Street / Area is required"),
  city: Yup.string()
    .max(50, "City must be less than 50 characters")
    .required("City is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Enter valid 6-digit pincode")
    .required("Pincode is required"),
  remark: Yup.string().max(1000, "Remark should be less than 1000 characters"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
});


const ReferralForm = ({ navigation, route }) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { userData } = useContext(UserDataContext);
  const { showSnackbar } = useSnackbar();
  const { editReferral } = route?.params || {};
  const { isAdmin } = route?.params || false;
  const styles = refralStyle(colors);

  const [initialValues, setInitialValues] = useState({
    name: "",
    loanAmount: "",
    loanType: "",
    street: "",
    city: "",
    pincode: "",
    remark: "",
    mobile: "",
    status: "",
  });

  // Fade In Animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Dynamic title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: editReferral ? "Edit Referral" : "Add New Referral",
    });
  }, [navigation, editReferral]);

  // Pre-fill fields when editing
  useEffect(() => {
    if (editReferral) {
      const [street, city, pincode] = editReferral?.address
        ?.split(",")
        ?.map((p) => p.trim()) || [];
      setInitialValues({
        name: editReferral?.name || "",
        loanAmount: editReferral?.loanAmount || "",
        loanType: selectLoanFromValuesById[editReferral?.loantypefk] || "",
        street: street || "",
        city: city || "",
        pincode: pincode || editReferral?.user?.pincode || "",
        remark: editReferral?.remark || "",
        mobile: editReferral?.user?.mobile || "",
        status: valuesByStatusfk[editReferral?.statusfk] || "",
      });
    }
  }, [editReferral]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors?.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={ReferralFormSchema}
            onSubmit={async (values, { resetForm }) => {
              const loantypefk =
                loanTypes.find((t) => t.value === values.loanType)?.id || null;

              const payload = {
                address: [values.street, values.city, values.pincode]
                  .filter(Boolean)
                  .join(", "),
                loantypefk,
                name: values.name,
                remark: values.remark,
                loanAmount: values.loanAmount,
                refferedBy: editReferral
                  ? editReferral?.refferedBy
                  : userData?.user?.id,
                statusfk: values.status
                  ? statusfkByValues[values.status]
                  : 2,
                mobile: values.mobile,
              };

              try {
                if (editReferral) {
                  const response = await updateApi(
                    `refferal/${editReferral?.id}`,
                    payload
                  );
                  if (response) {
                    if (isAdmin) {
                      navigation.navigate("adminViewReferral", { isAdmin: true });
                    } else {
                      navigation.navigate("Bottom", { screen: "Refer" });
                    }
                    showSnackbar("Referral updated successfully", "success");
                    resetForm();
                  }
                } else {
                  const response = await createApi("refferal", payload);
                  if (response) {
                    if (isAdmin) {
                      navigation.navigate("adminViewReferral", { isAdmin: true });
                    } else {
                      navigation.navigate("Bottom", { screen: "Refer" });
                    }
                    showSnackbar("Referral added successfully", "success");
                    resetForm();
                  }
                }
              } catch (err) {
                showSnackbar(
                  `Failed to ${
                    editReferral ? "update" : "add"
                  } referral: ${err?.err}`,
                  "error"
                );
              }
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
              <View>
                {/* Name */}
                <TextInput
                  label="Full Name *"
                  mode="outlined"
                  style={styles.input}
                  activeOutlineColor={colors.primary}
                   onChangeText={(text) => {
    if (text.length <= 100) setFieldValue("name", text);
  }}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  error={touched.name && errors.name}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}

                {/* Mobile */}
                <TextInput
                  disabled={!!editReferral}
                  placeholder="Mobile number"
                  mode="outlined"
                  activeOutlineColor={colors.primary}
                  keyboardType="number-pad"
                  value={values.mobile}
                  style={styles.input}
                  onBlur={handleBlur("mobile")}
                  onChangeText={(text) => {
                    if (/^\d{0,10}$/.test(text)) setFieldValue("mobile", text);
                  }}
                />
                {touched.mobile && errors.mobile && (
                  <Text style={styles.errorText}>{errors.mobile}</Text>
                )}

                {/* Loan Amount */}
                <TextInput
                  label="Loan Amount *"
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  activeOutlineColor={colors.primary}
 onChangeText={(text) => {
    if (/^\d*$/.test(text)) setFieldValue("loanAmount", text);
  }}                  onBlur={handleBlur("loanAmount")}
                  value={values.loanAmount}
                  error={touched.loanAmount && errors.loanAmount}
                />
                {touched.loanAmount && errors.loanAmount && (
                  <Text style={styles.errorText}>{errors.loanAmount}</Text>
                )}

                {/* Loan Type */}
                <GenericDropdown
                  placeholder="Select Loan Type"
                  options={loanTypes}
                  selectedValue={values.loanType}
                  onValueChange={(val) => setFieldValue("loanType", val)}
                  pickerContainerStyle={{
                    ...styles.pickerContainerStyle,
                    borderColor: values.loanType ? colors.primary : "grey",
                  }}
                      EditMode={editReferral ? true :false}

                />

                {/* Admin Status Dropdown */}
                {userData?.user?.roles === "admin" && isAdmin && (
                  <GenericDropdown
                    placeholder="Select Status"
                    options={statusOptions}
                    selectedValue={values.status}
                    onValueChange={(val) => setFieldValue("status", val)}
                    pickerContainerStyle={{
                      ...styles.pickerContainerStyle,
                      borderColor: values.status ? colors.primary : "grey",
                    }}
                     EditMode={editReferral ? true :false}

                  />
                )}

                {/* Address Section */}
                <Text style={styles.sectionTitle}>Customer Address</Text>

                <TextInput
                  label="Street / Area *"
                  mode="outlined"
                  style={styles.input}
                  activeOutlineColor={colors.primary}
                  onChangeText={handleChange("street")}
                  onBlur={handleBlur("street")}
                  value={values.street}
                  error={touched.street && errors.street}
                />
                {touched.street && errors.street && (
                  <Text style={styles.errorText}>{errors.street}</Text>
                )}

                <TextInput
                  label="City *"
                  mode="outlined"
                  style={styles.input}
                  activeOutlineColor={colors.primary}
                   onChangeText={(text) => {
    if (text.length <= 50) setFieldValue("city", text);
  }}
                  onBlur={handleBlur("city")}
                  value={values.city}
                  error={touched.city && errors.city}
                />
                {touched.city && errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}

                <TextInput
                  label="Pincode *"
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  activeOutlineColor={colors.primary}
                  onChangeText={(text) => {
    if (/^\d{0,6}$/.test(text)) setFieldValue("pincode", text);
  }}
                  onBlur={handleBlur("pincode")}
                  value={values.pincode}
                  error={touched.pincode && errors.pincode}
                />
                {touched.pincode && errors.pincode && (
                  <Text style={styles.errorText}>{errors.pincode}</Text>
                )}

                {/* Remark */}
                <TextInput
                  label="Remark / Notes (Optional)"
                  mode="outlined"
                  style={[styles.input, { maxHeight: 150 }]}
                  multiline
                  numberOfLines={4}
                  activeOutlineColor={colors.primary}
                  onChangeText={handleChange("remark")}
                  onBlur={handleBlur("remark")}
                  value={values.remark}
                  error={touched.remark && errors.remark}
                  maxLength={1000}
                />

                {/* Submit Button */}
                <Pressable style={{ marginTop: 20 }}>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={{
                      borderRadius: 10,
                      padding: 5,
                      backgroundColor: colors.main,
                    }}
                  >
                    {editReferral ? "Edit Referral" : "Add Referral"}
                  </Button>
                </Pressable>
              </View>
            )}
          </Formik>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ReferralForm;

const refralStyle = (colors) =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      paddingVertical: 10,
      backgroundColor: colors?.background,
    },
    formContainer: {
      backgroundColor: colors?.background,
      padding: 20,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 15,
      marginBottom: 10,
      color: colors?.muted,
    },
    input: {
      backgroundColor: colors?.background,
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
      height: 55,
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
  });
