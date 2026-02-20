import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { setAuthToken, verifyRiderOtp } from '../../services/riderApi';

export default function RiderOtpScreen({
  route,
  onLogin,
}) {
  const { phone } = route.params || {};

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = otp.length === 4;

  const handleVerify = async () => {
    if (!phone) {
      Alert.alert('Error', 'Phone missing');
      return;
    }

    if (!isValid) return;

    try {
      setLoading(true);

      const response = await verifyRiderOtp({
        phone,
        otp,
      });

      const token = response?.data?.token;

      if (!token) {
        Alert.alert('Verification Failed', 'Missing auth token in response');
        return;
      }

      setAuthToken(token);
      await onLogin(token);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'OTP verification failed. Please try again.';
      Alert.alert('Verification Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#16A34A', '#22C55E']}
        style={styles.header}
      >
        <Icon name="shield-checkmark" size={40} color="#fff" />
        <Text style={styles.headerTitle}>OTP Verification</Text>
        <Text style={styles.headerSub}>
          Sent to +91 {phone}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>

        <TextInput
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={4}
          style={styles.otpInput}
          placeholder="• • • •"
        />

        <TouchableOpacity
          style={[
            styles.button,
            !isValid && styles.buttonDisabled,
          ]}
          disabled={!isValid || loading}
          onPress={handleVerify}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>
                Verify OTP
              </Text>
              <Icon name="arrow-forward" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 10,
  },

  headerSub: { color: '#ECFDF5', marginTop: 4 },

  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 18,
  },

  otpInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 60,
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 16,
  },

  button: {
    marginTop: 22,
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDisabled: { backgroundColor: '#D1D5DB' },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 6,
  },
});
