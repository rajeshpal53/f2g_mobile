import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../Constants/Theme';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createApi } from '../../Util/UtilApi';
import { useSnackbar } from '../../Store/SnackbarContext';
import UserDataContext from '../../Store/UserDataContext';


const LoginScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const{showSnackbar}=useSnackbar("")
  const {saveUserData}=useContext(UserDataContext)
  const[phoneFocus,setPhoneFocus]=useState(false)
  // ✅ Yup Validation Schema
  const validationSchema = Yup.object().shape({
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit number'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const handleLogin =async (values,resetForm) => {
    try {
      console.log('Form Data:', values);
      const response = await createApi("users/loginUser",values)
      if(response){
        showSnackbar("Login Successfully","success")
        saveUserData(response)
         navigation.navigate('Bottom');
      resetForm();
      }
    } catch (err) {
       showSnackbar(`Login failed ${err?.err}`,"error")
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#fff' }]}>
  <StatusBar
    barStyle="dark-content"
    backgroundColor="#fff"
  />


      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <Image
                source={require('../../../assets/welcomeback.png')}
                style={styles.illustration}
              />
            </View>

      {/* PHONE INPUT */}
     

            {/* ✅ Formik Form */}
            <Formik
              initialValues={{ mobile: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values,{resetForm})=>{ handleLogin(values,resetForm)}}
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
                <>
                  {/* PHONE INPUT */}
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Phone</Text>
                  <View
                    style={[
                      styles.inputGroup,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      touched.mobile && errors.mobile && { borderColor: 'red' },
                    ]}
                  >
                    <MaterialIcons name="phone" size={22} color={colors.textSecondary} />
                    <Text
                      style={[
                        styles.countryCode,
                        { color: colors.text, borderColor: colors.border },
                      ]}
                    >
                      +91
                    </Text>
                    <TextInput
                      placeholder="Mobile number"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="number-pad"
                      value={values.mobile}
                      style={[styles.inputField, { color: colors.text }]}
                      onBlur={handleBlur('mobile')}
                      onChangeText={(text) => {
                        // ✅ Allow only digits up to 10 characters
                        if (/^\d{0,10}$/.test(text)) {
                          setFieldValue('mobile', text);
                        }
                      }}
                    />
                  </View>
                  {touched.mobile && errors.mobile && (
                    <Text style={styles.errorText}>{errors.mobile}</Text>
                  )}

                  {/* PASSWORD INPUT */}
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
                  <View
                    style={[
                      styles.inputGroup,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      touched.password && errors.password && { borderColor: 'red' },
                    ]}
                  >
                    <MaterialIcons name="lock" size={22} color={colors.textSecondary} />
                    <TextInput
                      placeholder="••••••••"
                      placeholderTextColor={colors.textSecondary}
                      style={[styles.inputField, { color: colors.text }]}
                      secureTextEntry={!showPassword}
                      value={values.password}
                      onBlur={handleBlur('password')}
                      onChangeText={handleChange('password')}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <MaterialIcons
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={22}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  {/* FORGOT PASSWORD */}
                  <TouchableOpacity style={styles.linkButton}>
                    <Text style={[styles.linkText, { color: colors.accent }]}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  {/* LOGIN BUTTON */}
                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.main }]}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.primaryButtonText, { color: colors.card }]}>
                      Log In
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <View style={styles.signUpTextContainer}>
              <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: colors.accent }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentContainer: { paddingHorizontal: 32, alignItems: 'center' },
  illustrationContainer: { alignItems: 'center', marginBottom: -10 },
  illustration: { width: 340, height: 340, resizeMode: 'contain' },
  title: {
    fontSize: 26,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginTop: -20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 56,
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    paddingRight: 12,
    marginRight: 12,
    borderRightWidth: 1,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
  },
  linkButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  primaryButton: {
    height: 56,
    width:100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  signUpTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
});

export default LoginScreen;
