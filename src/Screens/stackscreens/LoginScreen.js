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
  ScrollView
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* HEADER */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color={colors.text} />
        </TouchableOpacity>
      </View> */}

      {/* MAIN */}
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
          <View style={[styles.contentContainer]}>
            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <Image
                source={require('../../../assets/welcomeback.png')}
                style={styles.illustration}
              />
            </View>

            {/* Text */}
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back!</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to access your F2G account.
            </Text>

            {/* PHONE INPUT */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Phone</Text>
            <View
              style={[
                styles.inputGroup,
                { backgroundColor: colors.surface, borderColor: colors.border },
                phoneFocus && { borderColor: colors.accent },
              ]}
            >
              <MaterialIcons name="phone" size={22} color={colors.textSecondary} />
              <Text style={[styles.countryCode, { color: colors.text, borderColor: colors.border }]}>
                +91
              </Text>
              <TextInput
                placeholder="Mobile number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                style={[styles.inputField, { color: colors.text }]}
                onFocus={() => setPhoneFocus(true)}
                onBlur={() => setPhoneFocus(false)}
              />
            </View>

            {/* PASSWORD INPUT */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
            <View
              style={[
                styles.inputGroup,
                { backgroundColor: colors.surface, borderColor: colors.border },
                passwordFocus && { borderColor: colors.accent },
              ]}
            >
              <MaterialIcons name="lock" size={22} color={colors.textSecondary} />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                style={[styles.inputField, { color: colors.text }]}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={22}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* FORGOT PASSWORD */}
            <TouchableOpacity style={styles.linkButton}>
              <Text style={[styles.linkText, { color: colors.accent }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER BUTTONS */}
          <View style={[styles.footer]}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.main }]}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={[styles.primaryButtonText, { color: colors.card }]}>Log In</Text>
            </TouchableOpacity>

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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
 illustrationContainer: {
  alignItems: 'center',
  marginBottom: -10, // 🔥 added: pull text closer without shrinking image
},
illustration: {
  width: 340,
  height: 340,
  resizeMode: 'contain',
},
title: {
  fontSize: 26,
  fontWeight: '700',
  alignSelf: 'flex-start',
  marginTop: -20, // 🔥 added: nudge closer to image
  marginBottom: 4,
},

  subtitle: {
    fontSize: 14,
    alignSelf: 'flex-start',
    marginBottom: 10,
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
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
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
