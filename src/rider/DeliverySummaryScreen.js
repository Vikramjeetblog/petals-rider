import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DeliverySummaryScreen({ navigation, route }) {
  const order = route?.params?.order;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.popToTop()} hitSlop={10} style={styles.backBtn}>
            <Icon name="close" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Delivery Summary</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <Icon name="checkmark-circle" size={40} color="#16A34A" />
          <Text style={styles.cardTitle}>Delivery Completed</Text>
          <Text style={styles.cardSub}>Order #{order?.id ?? '—'} has been delivered.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Earnings</Text>
          <Text style={styles.earning}>₹90</Text>
          <Text style={styles.cardSub}>Will reflect in your wallet shortly.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn} onPress={() => navigation.popToTop()}>
          <Text style={styles.primaryText}>Back to Deliveries</Text>
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
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  cardTitle: { marginTop: 10, fontWeight: '700', color: '#111827' },
  cardSub: { marginTop: 6, color: '#6B7280', textAlign: 'center' },
  earning: { marginTop: 10, fontSize: 24, fontWeight: '800', color: '#16A34A' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800' },
});
