import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DeliveryProofScreen({ route, navigation }) {

  const order = route?.params?.order;
  const inputRef = useRef(null);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = otp.length === 4;

  const handleComplete = async () => {
    Keyboard.dismiss();

    if (!isValid) return;

    try {
      setLoading(true);

      // 🔥 DEV OTP
      if (__DEV__ && otp !== '1234') {
        Alert.alert('Invalid OTP', 'Use 1234');
        setLoading(false);
        return;
      }

      // simulate backend delay
      await new Promise(res => setTimeout(res, 900));

      Alert.alert(
        'Delivery Completed ✅',
        'Order marked as delivered.',
        [
          {
            text: 'OK',
            onPress: () => navigation.popToTop(),
          },
        ]
      );

    } catch {
      Alert.alert('Error', 'Delivery verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>

        {/* Header */}
        <LinearGradient
          colors={['#16A34A', '#22C55E']}
          style={styles.header}
        >
          <Icon name="shield-checkmark" size={40} color="#fff" />

          <Text style={styles.headerTitle}>
            Delivery Verification
          </Text>

          <Text style={styles.headerSub}>
            Order #{order?.id ?? '—'}
          </Text>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>

          <Icon
            name="key-outline"
            size={50}
            color="#16A34A"
            style={{ marginBottom: 14 }}
          />

          <Text style={styles.title}>
            Enter Customer OTP
          </Text>

          <Text style={styles.subtitle}>
            Ask customer for delivery code
          </Text>

          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.otpInput}
            placeholder="• • • •"
            autoFocus
          />

          <Text style={styles.hint}>
            Dev OTP: 1234
          </Text>

        </View>

        {/* Sticky Button */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              !isValid && styles.disabledBtn,
            ]}
            disabled={!isValid || loading}
            onPress={handleComplete}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.actionText}>
                  Confirm Delivery
                </Text>
                <Icon
                  name="checkmark-circle"
                  size={18}
                  color="#fff"
                />
              </>
            )}
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  header: {
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 6,
  },

  headerSub: {
    color: '#DCFCE7',
    marginTop: 4,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  subtitle: {
    color: '#6B7280',
    marginBottom: 12,
  },

  otpInput: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 60,
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 16,
    marginTop: 10,
  },

  hint: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
  },

  actions: {
    padding: 14,
    backgroundColor: '#fff',
  },

  primaryBtn: {
    backgroundColor: '#16A34A',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledBtn: {
    backgroundColor: '#D1D5DB',
  },

  actionText: {
    color: '#fff',
    fontWeight: '700',
    marginRight: 6,
  },

});
