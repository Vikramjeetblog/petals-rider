import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import EmptyState from '../../../components/EmptyState';
import FullscreenLoader from '../../../components/FullscreenLoader';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Card from '../../../components/ui/Card';
import useTheme from '../../../hooks/useTheme';
import { fetchEarningsActivity } from '../../../services/riderApi';
import { useAppStore } from '../../../store/AppStore';

const PAGE_SIZE = 10;

const dedupeById = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const id = String(item?.id || item?.orderId || '');
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

export default function ActivityScreen() {
  const { theme } = useTheme();
  const { state, dispatch } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const isMountedRef = useRef(true);

  const history = state.earnings.activity;
  const isOffline = state.network.isOffline;

  const loadHistory = useCallback(
    async ({ nextPage = 1, append = false } = {}) => {
      const controller = new AbortController();

      try {
        if (isOffline) {
          setError('You are offline. Connect to internet and retry.');
          return;
        }

        setError('');
        const data = await fetchEarningsActivity({ page: nextPage, limit: PAGE_SIZE }, { signal: controller.signal });
        if (!isMountedRef.current) return;

        const incoming = Array.isArray(data) ? data : data?.items || [];
        const merged = append ? dedupeById([...history, ...incoming]) : dedupeById(incoming);
        dispatch({ type: 'SET_EARNINGS_ACTIVITY', payload: merged });
        setPage(nextPage);
        setHasMore(incoming.length >= PAGE_SIZE);
      } catch (err) {
        if (!isMountedRef.current || err?.name === 'CanceledError' || err?.name === 'AbortError') return;

        setError(err?.response?.status === 500 ? 'Server issue while fetching activity.' : 'Unable to load activity.');
        if (!append) {
          dispatch({ type: 'SET_EARNINGS_ACTIVITY', payload: [] });
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
        }
      }

      return () => controller.abort();
    },
    [dispatch, history, isOffline]
  );

  useEffect(() => {
    isMountedRef.current = true;
    loadHistory();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadHistory]);

  const totalEarned = useMemo(
    () => history.reduce((sum, item) => sum + Number(item.earning || item.amount || 0), 0),
    [history]
  );

  return (
    <ScreenWrapper>
      {error ? (
        <EmptyState
          icon="warning-outline"
          title="Activity unavailable"
          subtitle={error}
          actionLabel="Retry"
          onAction={() => loadHistory({ nextPage: 1, append: false })}
        />
      ) : history.length === 0 && !loading ? (
        <EmptyState
          icon="receipt-outline"
          title="No earnings yet"
          subtitle="Completed orders will appear here."
          actionLabel="Refresh"
          onAction={() => loadHistory({ nextPage: 1, append: false })}
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => String(item.id || item.orderId)}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={[theme.typography.headingMD, { color: theme.colors.textPrimary }]}>#{item.id || item.orderId}</Text>
              <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: 4 }]}>
                {item.customer || item.location || 'Delivery'}
              </Text>
              <View style={styles.rowBetween}>
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>{item.time || item.createdAt || '-'}</Text>
                <Text style={[theme.typography.headingMD, { color: theme.colors.primary }]}>₹{item.earning || item.amount || 0}</Text>
              </View>
            </Card>
          )}
          ListHeaderComponent={
            <Card style={styles.summary}>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Loaded Total</Text>
              <Text style={[theme.typography.headingLG, { color: theme.colors.primary }]}>₹{totalEarned}</Text>
            </Card>
          }
          initialNumToRender={8}
          windowSize={8}
          removeClippedSubviews
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (loading || refreshing || loadingMore || !hasMore || isOffline) return;
            setLoadingMore(true);
            loadHistory({ nextPage: page + 1, append: true });
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setHasMore(true);
                loadHistory({ nextPage: 1, append: false });
              }}
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <Text style={[theme.typography.caption, styles.footer, { color: theme.colors.textSecondary }]}>Loading more...</Text>
            ) : null
          }
        />
      )}
      {loading ? <FullscreenLoader /> : null}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  summary: { marginVertical: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  footer: { textAlign: 'center', paddingVertical: 8 },
});
