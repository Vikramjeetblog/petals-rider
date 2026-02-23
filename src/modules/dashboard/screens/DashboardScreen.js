import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import LinearGradient from 'react-native-linear-gradient';

import EmptyState from '../../../components/EmptyState';
import FullscreenLoader from '../../../components/FullscreenLoader';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Card from '../../../components/ui/Card';
import SectionHeader from '../../../components/ui/SectionHeader';
import {
  canTransitionOrderStatus,
  normalizeOrderStatus,
  ORDER_STATUS,
} from '../../../constants/orderStatus';
import useTheme from '../../../hooks/useTheme';
import OrderCardPro from '../../orders/components/OrderCardPro';
import { fetchAssignedOrders } from '../../../services/riderApi';
import { useAppStore } from '../../../store/AppStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DashboardScreen({ navigation }) {
  const { theme } = useTheme();
  const { state, dispatch } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [shiftSeconds, setShiftSeconds] = useState(0);

  const orders = state.orders.items;
  const online = state.online;
  const isOffline = state.network.isOffline;

  const loadOrders = useCallback(async () => {
    const controller = new AbortController();
    try {
      const res = await fetchAssignedOrders(undefined, { signal: controller.signal });
      const normalized = (Array.isArray(res) ? res : res?.items || []).map((order, index) => ({
        ...order,
        status: normalizeOrderStatus(order.status),
        queuePosition: index + 1,
      }));
      dispatch({ type: 'SET_ORDERS', payload: normalized });
    } catch (error) {
      if (error?.name !== 'CanceledError' && error?.name !== 'AbortError') {
        dispatch({ type: 'SHOW_TOAST', payload: 'Unable to refresh orders.' });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }

    return () => controller.abort();
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const run = async () => {
      try {
        const res = await fetchAssignedOrders(undefined, { signal: controller.signal });
        if (!mounted) return;

        const normalized = (Array.isArray(res) ? res : res?.items || []).map((order, index) => ({
          ...order,
          status: normalizeOrderStatus(order.status),
          queuePosition: index + 1,
        }));
        dispatch({ type: 'SET_ORDERS', payload: normalized });
      } catch {
        if (mounted) dispatch({ type: 'SHOW_TOAST', payload: 'Unable to load orders.' });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!online) return;
    const interval = setInterval(() => setShiftSeconds((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, [online]);

  const toggleOnline = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch({ type: 'SET_ONLINE', payload: !online });
  };

  const onAccept = useCallback(
    (order) => {
      if (isOffline) {
        dispatch({ type: 'SHOW_TOAST', payload: 'You are offline. Connect to internet first.' });
        return;
      }

      const current = normalizeOrderStatus(order.status);
      if (!online || !canTransitionOrderStatus(current, ORDER_STATUS.ACCEPTED)) {
        Alert.alert('Action blocked', 'This order cannot be accepted in the current state.');
        return;
      }

      const next = orders.map((item) =>
        item.id === order.id ? { ...item, status: ORDER_STATUS.ACCEPTED } : item
      );
      dispatch({ type: 'SET_ORDERS', payload: next });
      navigation.navigate('OrderDetails', { order: { ...order, status: ORDER_STATUS.ACCEPTED } });
    },
    [dispatch, isOffline, navigation, online, orders]
  );

  const onReject = useCallback(
    (order) => {
      if (isOffline) {
        dispatch({ type: 'SHOW_TOAST', payload: 'You are offline. Connect to internet first.' });
        return;
      }

      const current = normalizeOrderStatus(order.status);
      if (!canTransitionOrderStatus(current, ORDER_STATUS.CANCELLED)) {
        Alert.alert('Action blocked', 'Order cannot be rejected from current state.');
        return;
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      dispatch({ type: 'SET_ORDERS', payload: orders.filter((item) => item.id !== order.id) });
    },
    [dispatch, isOffline, orders]
  );

  const totalEarning = useMemo(
    () => orders.reduce((sum, item) => sum + Number(item.earning || item.payout || 0), 0),
    [orders]
  );

  const shiftText = useMemo(() => {
    const h = Math.floor(shiftSeconds / 3600);
    const m = Math.floor((shiftSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  }, [shiftSeconds]);

  return (
    <ScreenWrapper contentStyle={styles.content}>
      <LinearGradient colors={[theme.colors.primaryDark, theme.colors.primary]} style={styles.hero}>
        <View>
          <Text style={[theme.typography.headingLG, styles.whiteText]}>Rider Dashboard</Text>
          <Text style={[theme.typography.caption, styles.softGreenText]}>Shift active: {shiftText}</Text>
        </View>
        <TouchableOpacity
          onPress={toggleOnline}
          style={[styles.statusPill, { backgroundColor: online ? theme.colors.successSoft : '#FEE2E2' }]}
        >
          <Text style={[theme.typography.caption, { color: theme.colors.textPrimary }]}>
            {online ? '🟢 Online' : '🔴 Offline'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Today Earnings</Text>
          <Text style={[theme.typography.headingLG, { color: theme.colors.primary }]}>₹{totalEarning}</Text>
        </Card>
        <View style={styles.cardGap} />
        <Card style={styles.statCard}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Active Orders</Text>
          <Text style={[theme.typography.headingLG, { color: theme.colors.textPrimary }]}>{orders.length}</Text>
        </Card>
      </View>

      <SectionHeader title="Assigned Orders" />

      {orders.length === 0 && !loading ? (
        <EmptyState
          icon="bicycle-outline"
          title="No orders available"
          subtitle="Pull to refresh or wait for new assignments."
          actionLabel="Refresh"
          onAction={() => {
            setRefreshing(true);
            loadOrders();
          }}
        />
      ) : (
        <DraggableFlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, drag }) => (
            <OrderCardPro
              order={item}
              online={online}
              isOffline={isOffline}
              onLongPress={drag}
              acceptDisabled={isOffline || !online || !canTransitionOrderStatus(item.status, ORDER_STATUS.ACCEPTED)}
              onAccept={onAccept}
              onReject={onReject}
            />
          )}
          initialNumToRender={6}
          windowSize={8}
          removeClippedSubviews
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadOrders();
              }}
            />
          }
          onDragEnd={({ data }) =>
            dispatch({
              type: 'SET_ORDERS',
              payload: data.map((item, index) => ({ ...item, queuePosition: index + 1 })),
            })
          }
        />
      )}

      {loading ? <FullscreenLoader /> : null}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 0 },
  hero: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  whiteText: { color: '#FFFFFF' },
  softGreenText: { color: '#DCFCE7', marginTop: 4 },
  statusPill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  statsRow: { flexDirection: 'row', padding: 16 },
  statCard: { flex: 1 },
  cardGap: { width: 12 },
});
