import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { fetchEarningsActivity } from '../services/riderApi';

export default function ActivityScreen() {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchEarningsActivity();
      setHistory(Array.isArray(data) ? data : data?.items || []);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}><Text style={styles.orderId}>#{item.id || item.orderId}</Text></View>
      <Text style={styles.location}>{item.customer || item.location || 'Delivery'}</Text>
      <View style={styles.rowBetween}>
        <Text style={styles.time}>{item.time || item.createdAt || '-'}</Text>
        <Text style={styles.earning}>₹{item.earning || item.amount || 0}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {history.length === 0 ? (
        <View style={styles.empty}><Icon name="list-outline" size={70} color="#9CA3AF" /><Text style={styles.emptyTitle}>No Delivery History</Text></View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => String(item.id || item.orderId)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadHistory(); }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F9FAFB' }, card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, elevation: 2 }, row: { flexDirection: 'row', justifyContent: 'space-between' }, rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }, orderId: { fontWeight: '700' }, location: { marginTop: 6, color: '#374151' }, time: { color: '#6B7280', fontSize: 12 }, earning: { color: '#16A34A', fontWeight: '700' }, empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }, 
                                  emptyTitle: { fontSize: 18, 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      fontWeight: '700',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      marginTop: 12 } });
