import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../Constants/Theme';

const LoginScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleLogin = () => navigation.navigate('Bottom');

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
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../../../assets/welcomeback.png')}
          style={styles.illustration}
        />
      </View>

      {/* Text */}
      <Text style={[styles.title, { color: '#000' }]}>Welcome Back!</Text>
      <Text style={[styles.subtitle, { color: '#666' }]}>
        Sign in to access your F2G account.
      </Text>

      {/* PHONE INPUT */}
      <Text style={[styles.label, { color: '#666' }]}>Phone</Text>
      <View style={[styles.inputGroup, phoneFocus && { borderColor: '#007AFF' }]}>
        <MaterialIcons name="phone" size={22} color="#999" />
        <Text style={[styles.countryCode, { color: '#000', borderColor: '#ccc' }]}>+91</Text>
        <TextInput
          placeholder="Mobile number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          style={[styles.inputField, { color: '#000' }]}
          onFocus={() => setPhoneFocus(true)}
          onBlur={() => setPhoneFocus(false)}
        />
      </View>

      {/* PASSWORD INPUT */}
      <Text style={[styles.label, { color: '#666' }]}>Password</Text>
      <View style={[styles.inputGroup, passwordFocus && { borderColor: '#007AFF' }]}>
        <MaterialIcons name="lock" size={22} color="#999" />
        <TextInput
          placeholder="••••••••"
          placeholderTextColor="#999"
          style={[styles.inputField, { color: '#000' }]}
          secureTextEntry={!showPassword}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={22}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      {/* FORGOT PASSWORD */}
      <TouchableOpacity style={styles.linkButton}>
        <Text style={[styles.linkText, { color: '#007AFF' }]}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: '#007AFF' }]}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={[styles.primaryButtonText, { color: '#fff' }]}>Log In</Text>
      </TouchableOpacity>

      {/* SIGN UP */}
      <View style={styles.signUpTextContainer}>
        <Text style={[styles.signUpText, { color: '#666' }]}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text style={[styles.linkText, { color: '#007AFF' }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  </KeyboardAvoidingView>
</SafeAreaView>

  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: -20,
  },
  illustration: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    alignSelf: 'flex-start',
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
    marginBottom: 14,
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
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  signUpTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 14,
  },
});

export default LoginScreen;
