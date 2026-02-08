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

export default function RiderOtpScreen({
  route,
  setIsLoggedIn,
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

      // DEV OTP
      if (__DEV__ && otp !== '1234') {
        Alert.alert('Invalid OTP', 'Use 1234');
        setLoading(false);
        return;
      }

      await new Promise(res => setTimeout(res, 800));

      // ✅ SWITCH ROOT NAVIGATOR
      setIsLoggedIn(true);

    } catch {
      Alert.alert('Verification Failed');
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

        <Text style={styles.hint}>Dev OTP: 1234</Text>

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

  hint: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
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
