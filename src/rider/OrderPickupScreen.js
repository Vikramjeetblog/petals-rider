import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function OrderPickupScreen({ navigation, route }) {
  const order = route?.params?.order;
  const [pickupOtpVerified, setPickupOtpVerified] = useState(false);

  const verifyPickupOtp = () => {
    setPickupOtpVerified(true);
    Alert.alert('Pickup OTP verified', 'You can now proceed to customer location.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Pickup Order</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Order #{order?.id ?? '—'}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pickup Checklist</Text>
          <Text style={styles.cardSub}>Verify items and confirm pickup.</Text>
          <View style={styles.checkRow}>
            <Icon name="checkmark-circle" size={18} color="#16A34A" />
            <Text style={styles.checkText}>Items collected from store</Text>
          </View>
          <View style={styles.checkRow}>
            <Icon name="checkmark-circle" size={18} color="#16A34A" />
            <Text style={styles.checkText}>Packaging is sealed</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pickup OTP</Text>
          <Text style={styles.cardSub}>Ask store staff for pickup OTP.</Text>
          <Pressable style={[styles.secondaryBtn, pickupOtpVerified && styles.secondaryBtnVerified]} onPress={verifyPickupOtp}>
            <Text style={[styles.secondaryText, pickupOtpVerified && styles.secondaryTextVerified]}>
              {pickupOtpVerified ? 'OTP Verified' : 'Enter OTP'}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.primaryBtn, !pickupOtpVerified && styles.primaryBtnDisabled]}
          onPress={() => navigation.navigate('OrderEnRoute', { order })}
          disabled={!pickupOtpVerified}
        >
          <Text style={styles.primaryText}>Confirm Pickup</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerSub: { color: '#DCFCE7', marginTop: 10 },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: { fontWeight: '700', color: '#111827' },
  cardSub: { color: '#6B7280', marginTop: 6 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  checkText: { marginLeft: 8, color: '#111827' },
  secondaryBtn: {
    marginTop: 12,
    backgroundColor: '#DCFCE7',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnVerified: { backgroundColor: '#16A34A' },
  secondaryText: { color: '#16A34A', fontWeight: '700' },
  secondaryTextVerified: { color: '#fff' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnDisabled: { backgroundColor: '#9CA3AF' },
  primaryText: { color: '#fff', fontWeight: '800' },
});
