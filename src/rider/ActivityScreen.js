import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import EmptyState from '../components/EmptyState';
import FullscreenLoader from '../components/FullscreenLoader';
import ScreenWrapper from '../components/ScreenWrapper';
import colors from '../constants/colors';
import spacing from '../constants/spacing';
import typography from '../constants/typography';
import { fetchEarningsActivity } from '../services/riderApi';

export default function ActivityScreen() {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = useCallback(async () => {
    try {
      setError('');
      const data = await fetchEarningsActivity();
      setHistory(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      const message = err?.response?.status === 500
        ? 'Our server is having trouble loading your activity right now.'
        : 'Unable to load delivery history.';
      setError(message);
      setHistory([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.orderId}>#{item.id || item.orderId}</Text>
      <Text style={styles.location}>{item.customer || item.location || 'Delivery'}</Text>
      <View style={styles.rowBetween}>
        <Text style={styles.time}>{item.time || item.createdAt || '-'}</Text>
        <Text style={styles.earning}>₹{item.earning || item.amount || 0}</Text>
      </View>
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  return (
    <ScreenWrapper>
      {error ? (
        <EmptyState
          icon="warning-outline"
          title="Activity unavailable"
          subtitle={error}
          actionLabel="Try Again"
          onAction={loadHistory}
        />
      ) : history.length === 0 && !loading ? (
        <EmptyState
          icon="list-outline"
          title="No earnings yet"
          subtitle="Completed deliveries will appear here. Pull to refresh after finishing your first order."
          actionLabel="Refresh"
          onAction={loadHistory}
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => String(item.id || item.orderId)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      {loading ? <FullscreenLoader /> : null}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  orderId: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  location: {
    ...typography.body,
    color: '#374151',
    marginTop: spacing.xs,
  },
  time: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  earning: {
    ...typography.subheading,
    color: colors.success,
  },
});
