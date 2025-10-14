import React, { useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Pressable,
} from "react-native";
import { TextInput, Button,  } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import GenericDropdown from "../../UI/DropDown/GenericDropDown";
import { useTheme } from "../../Constants/Theme";
import { loanTypes } from "../../Util/UtilApi";
import UserDataContext from "../../Store/UserDataContext";
import { useSnackbar } from "../../Store/SnackbarContext";
import { createApi } from "../../Util/UtilApi";
const BookingFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  bookingAmount: Yup.number()
    .typeError("Booking Amount must be a number")
    .required("Booking Amount is required"),
  loanType: Yup.string().required("Loan Type is required"),
  street: Yup.string().required("Street / Area is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Enter a valid 6-digit pincode")
    .required("Pincode is required"),
  tentativeBill: Yup.number()
    .typeError("Tentative Bill must be a number")
    .required("Tentative Bill is required"),
  loanAccountNumber: Yup.string().required("Loan Account Number is required"),
  mobile: Yup.string()
          .required('Mobile number is required')
          .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit number'), 
});

const BookingScreen = ({navigation}) => {
  const {colors} = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const styles= Bookstyles(colors)
  const{userData}=useContext(UserDataContext)
  const {showSnackbar}=useSnackbar()
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
          <Formik
            initialValues={{
              name: "",
              bookingAmount: "",
              loanType: "",
              street: "",
              city: "",
              pincode: "",
              tentativeBill: "",
              loanAccountNumber: "",
              mobile:""
            }}
            validationSchema={BookingFormSchema}
            onSubmit={async (values,{resetForm}) => {

                 const loantypefk = loanTypes.find(t => t.value === values.loanType)?.id || null;
                
                console.log("Selected loan type from form:", values.loanType);
                console.log("Available loan types:", loanTypes.map(t => t.value));
                console.log("loantypefk:", loantypefk);
                
                 const payload ={
address: [values?.street, values?.city, values?.pincode].filter(Boolean).join(", "), // removes undefined or empty valuesjoin(", "),
                loantypefk:loantypefk,
                name:values?.name,
                remark:values?.remark,
                bookingAmount:values?.bookingAmount,
                refferedBy:userData?.user?.id,
                statusfk:2,
                mobile:values?.mobile,
                loanAccountNumber:values?.loanAccountNumber,
                tentativeBillAmount:values?.tentativeBill,

              
              }
              console.log("Booking Form Submitted: ", payload);
               try{
                              const response = await createApi("booking",payload)
                              if(response){
                                navigation.navigate("Bottom",{screen:"Booking"})
                                 showSnackbar("Add Booking successfully","success")
                                 resetForm();
                              }
                            }catch(err){
                              console.error(err)
                                showSnackbar(`failed to add  Booking,${err?.err} `,"error")
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
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  error={touched.name && errors.name}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
                 <TextInput
                                 placeholder="Mobile number"
                                  mode="outlined"
                                   activeOutlineColor={colors.primary}
                                 keyboardType="number-pad"
                                 value={values.mobile}
                                  style={styles.input}
                                 onBlur={handleBlur('mobile')}
                                 onChangeText={(text) => {
                                   // ✅ Allow only digits up to 10 characters
                                   if (/^\d{0,10}$/.test(text)) {
                setFieldValue('mobile', text);
                                   }
                                 }}
                               />
                                    
                      {touched.mobile && errors.mobile && (
                        <Text style={styles.errorText}>{errors.mobile}</Text>
                      )}

                {/* Booking Amount */}
                <TextInput
                  label="Booking Amount *"
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  activeOutlineColor={colors.primary}
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
  placeholder="Select Loan Type"
  options={loanTypes}
  selectedValue={values.loanType} // now this should be an object
  onValueChange={(val) => setFieldValue("loanType", val)}
  pickerContainerStyle={{
    ...styles.pickerContainerStyle,
    borderColor: values.loanType ? colors.primary : "grey",
  }}
/>
                {touched.loanType && errors.loanType && (
                  <Text style={styles.errorText}>{errors.loanType}</Text>
                )}

                {/* Customer Address */}
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
                  onChangeText={handleChange("city")}
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
                  onChangeText={handleChange("pincode")}
                  onBlur={handleBlur("pincode")}
                  value={values.pincode}
                  error={touched.pincode && errors.pincode}
                />
                {touched.pincode && errors.pincode && (
                  <Text style={styles.errorText}>{errors.pincode}</Text>
                )}

                {/* Tentative Bill Amount */}
                <TextInput
                  label="Tentative Bill Amount *"
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  activeOutlineColor={colors.primary}
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
                  activeOutlineColor={colors.primary}
                  onChangeText={handleChange("loanAccountNumber")}
                  onBlur={handleBlur("loanAccountNumber")}
                  value={values.loanAccountNumber}
                  error={touched.loanAccountNumber && errors.loanAccountNumber}
                />
                {touched.loanAccountNumber && errors.loanAccountNumber && (
                  <Text style={styles.errorText}>
                    {errors.loanAccountNumber}
                  </Text>
                )}

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
                    Submit Booking
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

export default BookingScreen;

const Bookstyles =(colors)=> StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "",
    paddingVertical: 20,
    backgroundColor: colors?.background,
  },
  formContainer: {
    backgroundColor: colors?.background,
    padding: 20,
    borderRadius: 12,
    shadowColor:  colors?.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
    color: "#444",
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
