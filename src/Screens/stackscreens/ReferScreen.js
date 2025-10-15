import React, { useRef, useEffect, useContext } from "react";
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
import{loanTypes,createApi} from "../../Util/UtilApi"
import UserDataContext from "../../Store/UserDataContext";
import { useSnackbar } from "../../Store/SnackbarContext";

const ReferralFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  loanAmount: Yup.number()
    .typeError("Loan Amount must be a number")
    .required("Loan Amount is required"),
  loanType: Yup.string().required("Loan Type is required"),
  street: Yup.string().required("Street / Area is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Enter valid 6-digit pincode")
    .required("Pincode is required"),
  remark: Yup.string().max(1000, "Remark should be less than 1000 characters"),
   mobile: Yup.string()
        .required('Mobile number is required')
        .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit number'), 
});


const ReferralForm = ({navigation}) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {userData} =useContext(UserDataContext)

  const {showSnackbar}=useSnackbar()
   useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const styles= refralStyle(colors)


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              loanAmount: "",
              loanType: "",
              street: "",
              city: "",
              pincode: "",
              remark: "",
              mobile:""
            }}
            validationSchema={ReferralFormSchema}
            onSubmit={ async (values,{resetForm}) => {
              console.log("Referral Form Submitted: ", values);
//               {
            //   "city": "dewas",
            //   "loanAmount": "25000",
              // "loanType": "personal",
              // "name": "Faizan shaukh",
              // "pincode": "455001",
              // "remark": "faizan",
              // "street": "123 itawa"
            // }



          const loantypefk = loanTypes.find(t => t.value === values.loanType)?.id || null;

console.log("Selected loan type from form:", values.loanType);
console.log("Available loan types:", loanTypes.map(t => t.value));
console.log("loantypefk:", loantypefk);


              const payload ={
address: [values?.street, values?.city, values?.pincode].filter(Boolean).join(", "), // removes undefined or empty valuesjoin(", "),
                loantypefk:loantypefk,
                name:values?.name,
                remark:values?.remark,
                loanAmount:values?.loanAmount,
                refferedBy:userData?.user?.id,
                statusfk:2,
                mobile:values?.mobile
              }
              console.log("payload is ",payload)
              try{
                const response = await createApi("refferal",payload)
                if(response){
                  navigation.navigate("Refer")
                   showSnackbar("Add refral successfully","success")
                   resetForm();
                }
              }catch(err){
                  showSnackbar(`failed to add  refral,${err?.err} `,"error")
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
                {/* <Text style={styles.title}>Referral Form</Text> */}

                {/* Name */}
                <TextInput
                  label="First Name + Last Name *"
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
                {/* Loan Amount */}
                <TextInput
                  label="Loan Amount *"
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  activeOutlineColor={colors.primary}
                  onChangeText={handleChange("loanAmount")}
                  onBlur={handleBlur("loanAmount")}
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

                {/* Address Fields */}
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
                {touched.remark && errors.remark && (
                  <Text style={styles.errorText}>{errors.remark}</Text>
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
                    Submit Referral
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

const refralStyle =(colors)=> StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "",
    paddingVertical: 10,
    // backgroundColor: "#f7f7f7",
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
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
