import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../Constants/Theme';

const { height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  const handleSignUp = () => navigation.navigate('EnterNumberScreen');
  const handleLogIn = () => navigation.navigate('LoginScreen');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.illustrationWrapper}>
          <Image
            source={require('../../../assets/coinpay_credit_cards.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textBlock}>
          <Text style={[styles.mainHeading, { color: colors.text }]}>Create your</Text>

          <View style={styles.iconTitleRow}>
            <Text style={[styles.mainHeading, { color: colors.text }]}>F2G account</Text>
            <FontAwesome5
              name="medal"
              size={26}
              color={colors.accent}
              style={{ marginLeft: 8, marginTop: 3 }}
            />
          </View>

          <Text style={[styles.subText, { color: colors.textSecondary }]}>
            F2G is a powerful tool that allows you to easily send, receive, and track all your
            transactions.
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.accent }]}
          onPress={handleSignUp}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: colors.card }]}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.secondaryButton,
            { borderColor: colors.accent },
          ]}
          onPress={handleLogIn}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: colors.accent }]}>Log in</Text>
        </TouchableOpacity>

        <Text style={[styles.termsText, { color: colors.muted }]}>
          By continuing you accept our{' '}
          <Text style={[styles.linkText, { color: colors.accent }]}>Terms of Service</Text> and{' '}
          <Text style={[styles.linkText, { color: colors.accent }]}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationWrapper: {
    width: '100%',
    height: screenHeight * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 10,
  },
  mainHeading: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 38,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  subText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 0,
    marginTop: 5,
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionButton: {
    width: '100%',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButton: {
    elevation: 5,
  },
  secondaryButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
