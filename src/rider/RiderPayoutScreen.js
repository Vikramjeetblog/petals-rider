import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchWallet, fetchPayouts, withdrawPayout } from '../services/riderApi';

export default function RiderPayoutScreen({ navigation }) {
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [walletData, payoutsData] = await Promise.all([fetchWallet(), fetchPayouts()]);
      setWallet(walletData || { available: 0, pending: 0 });
      setHistory(Array.isArray(payoutsData) ? payoutsData : payoutsData?.items || []);
    } catch (err) {
      console.log('Payout load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const requestPayout = () => {
    if (!wallet?.available) {
      Alert.alert('No balance available');
      return;
    }

    Alert.alert('Request payout?', `Withdraw ₹${wallet.available}`, [
      { text: 'Cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          await withdrawPayout({ amount: wallet.available });
          Alert.alert('Payout requested!');
          loadData();
        },
      },
    ]);
  };

  const renderHistory = ({ item }) => {
    const statusColor = item.status === 'Completed' ? '#16A34A' : '#EA580C';

    return (
      <View style={styles.historyCard}>
        <View>
          <Text style={styles.amount}>₹{item.amount || 0}</Text>
          <Text style={styles.date}>{item.date || item.createdAt || '-'}</Text>
        </View>

        <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Header with Back */}
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={styles.backBtn}
          >
            <Icon name="arrow-back" size={22} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Payout Wallet</Text>

          {/* spacer to keep title centered */}
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#16A34A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(i) => i.id.toString()}
          renderItem={renderHistory}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={() => (
            <View>
              {/* Wallet card */}
              <View style={styles.walletCard}>
                <View style={styles.walletRow}>
                  <Text style={styles.label}>Available</Text>
                  <Text style={styles.balance}>₹{wallet?.available || 0}</Text>
                </View>

                <View style={styles.walletRow}>
                  <Text style={styles.label}>Pending</Text>
                  <Text style={styles.pending}>₹{wallet?.pending || 0}</Text>
                </View>

                <TouchableOpacity style={styles.payoutBtn} onPress={requestPayout}>
                  <Text style={styles.btnText}>Request Payout</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Payout History</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text>No payout history</Text>
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: { padding: 14 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  walletCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
  },

  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: { color: '#6B7280' },

  balance: {
    fontSize: 20,
    fontWeight: '800',
    color: '#16A34A',
  },

  pending: { fontWeight: '700', color: '#EA580C' },

  payoutBtn: {
    marginTop: 14,
    backgroundColor: '#16A34A',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: { color: '#fff', fontWeight: '700' },

  sectionTitle: { fontWeight: '700', marginBottom: 10 },

  historyCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  amount: { fontWeight: '800' },

  date: { color: '#6B7280', fontSize: 12 },

  status: { fontWeight: '700' },

  empty: { alignItems: 'center', marginTop: 40 },
});
