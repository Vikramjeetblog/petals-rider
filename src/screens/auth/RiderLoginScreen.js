import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RiderLoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (text) => {
    const digits = text.replace(/[^0-9]/g, '');
    setPhone(digits);
  };

  const isValid = phone.length === 10;

  const handleContinue = () => {
    if (!isValid) return;

    Keyboard.dismiss();

    navigation.navigate('RiderOtp', {
      phone: phone.trim(),
      role: 'RIDER',
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Gradient Header */}
      <LinearGradient
        colors={['#16A34A', '#22C55E']}
        style={styles.header}
      >
        <Icon name="bicycle" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Rider Login</Text>
        <Text style={styles.headerSub}>
          Deliver fast. Earn more.
        </Text>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>

        <Text style={styles.title}>
          Enter mobile number
        </Text>

        {/* Phone Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.code}>+91</Text>

          <TextInput
            placeholder="Mobile number"
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={handlePhoneChange}
            style={styles.input}
          />

          <Icon name="call" size={18} color="#6B7280" />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.button,
            !isValid && styles.buttonDisabled,
          ]}
          disabled={!isValid}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>
            Continue
          </Text>

          <Icon name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Footer Info */}
        <Text style={styles.footer}>
          By continuing, you agree to Rider Terms.
        </Text>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

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

  headerSub: {
    color: '#ECFDF5',
    marginTop: 4,
  },

  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 18,
    color: '#111827',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 56,
  },

  code: {
    fontWeight: '700',
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  button: {
    marginTop: 20,
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 6,
  },

  footer: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 12,
    color: '#6B7280',
  },

});
