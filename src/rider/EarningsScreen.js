import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { fetchEarningsSummary } from '../services/riderApi';

export default function EarningsScreen({ navigation }) {
  const [summary, setSummary] = useState({ today: 0, deliveries: 0, weekly: 0, averagePerJob: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchEarningsSummary();
      setSummary({
        today: data?.today ?? data?.todayEarning ?? 0,
        deliveries: data?.deliveries ?? 0,
        weekly: data?.weekly ?? 0,
        averagePerJob: data?.averagePerJob ?? 0,
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <Text style={styles.headerLabel}>Today Earnings</Text>
        <Text style={styles.headerAmount}>₹{summary.today}</Text>
        <Text style={styles.headerSub}>{summary.deliveries} deliveries completed</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadSummary(); }} />}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="calendar" size={20} color="#16A34A" />
            <Text style={styles.cardTitle}>Weekly Earnings</Text>
          </View>
          <Text style={styles.cardValue}>₹{summary.weekly}</Text>
        </View>

        <Pressable onPress={() => navigation.navigate('Payout')} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Icon name="cash-outline" size={20} color="#16A34A" />
              <Text style={styles.cardTitle}>Payouts</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
          <Text style={styles.cardHint}>View payout history, pending payouts & withdrawals</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F9FAFB' }, header: { padding: 24, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }, headerLabel: { color: '#ECFDF5', fontSize: 14 }, headerAmount: { color: '#fff', fontSize: 36, fontWeight: '900', marginVertical: 6 }, headerSub: { color: '#DCFCE7' }, content: { padding: 16 }, card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, elevation: 2 }, pressed: { opacity: 0.85 }, row: { flexDirection: 'row', alignItems: 'center' }, rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, cardTitle: { marginLeft: 8, fontWeight: '700' }, cardValue: { marginTop: 10, fontSize: 24, fontWeight: '800', color: '#16A34A' }, cardHint: { marginTop: 10, color: '#6B7280', fontSize: 12 } });
