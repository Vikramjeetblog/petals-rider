import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, LayoutAnimation, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import LinearGradient from 'react-native-linear-gradient';

import EmptyState from '../../../components/EmptyState';
import FullscreenLoader from '../../../components/FullscreenLoader';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Card from '../../../components/ui/Card';
import SectionHeader from '../../../components/ui/SectionHeader';
import { ACCEPTABLE_ORDER_STATUSES, normalizeOrderStatus, ORDER_STATUS } from '../../../constants/orderStatus';
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

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetchAssignedOrders();
      const normalized = (Array.isArray(res) ? res : res?.items || []).map((order, index) => ({
        ...order,
        status: normalizeOrderStatus(order.status),
        queuePosition: index + 1,
      }));
      dispatch({ type: 'SET_ORDERS', payload: normalized });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!online) return;
    const interval = setInterval(() => setShiftSeconds((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, [online]);

  const toggleOnline = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch({ type: 'SET_ONLINE', payload: !online });
  };

  const onAccept = useCallback((order) => {
    if (!online || !ACCEPTABLE_ORDER_STATUSES.includes(normalizeOrderStatus(order.status))) {
      Alert.alert('Action blocked', 'This order cannot be accepted in the current state.');
      return;
    }

    const next = orders.map((item) => (item.id === order.id ? { ...item, status: ORDER_STATUS.ACCEPTED } : item));
    dispatch({ type: 'SET_ORDERS', payload: next });
    navigation.navigate('OrderDetails', { order: { ...order, status: ORDER_STATUS.ACCEPTED } });
  }, [dispatch, navigation, online, orders]);

  const onReject = useCallback((order) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch({ type: 'SET_ORDERS', payload: orders.filter((item) => item.id !== order.id) });
  }, [dispatch, orders]);

  const totalEarning = useMemo(() => orders.reduce((sum, item) => sum + Number(item.earning || item.payout || 0), 0), [orders]);

  const shiftText = useMemo(() => {
    const h = Math.floor(shiftSeconds / 3600);
    const m = Math.floor((shiftSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  }, [shiftSeconds]);

  return (
    <ScreenWrapper contentStyle={styles.content}>
      <LinearGradient colors={[theme.colors.primaryDark, theme.colors.primary]} style={styles.hero}>
        <View>
          <Text style={[theme.typography.headingLG, { color: '#FFFFFF' }]}>Rider Dashboard</Text>
          <Text style={[theme.typography.caption, { color: '#DCFCE7', marginTop: 4 }]}>Shift active: {shiftText}</Text>
        </View>
        <TouchableOpacity onPress={toggleOnline} style={[styles.statusPill, { backgroundColor: online ? theme.colors.successSoft : '#FEE2E2' }]}> 
          <Text style={[theme.typography.caption, { color: theme.colors.textPrimary }]}>{online ? '🟢 Online' : '🔴 Offline'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}><Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Today Earnings</Text><Text style={[theme.typography.headingLG, { color: theme.colors.primary }]}>₹{totalEarning}</Text></Card>
        <Card style={styles.statCard}><Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Active Orders</Text><Text style={[theme.typography.headingLG, { color: theme.colors.textPrimary }]}>{orders.length}</Text></Card>
      </View>

      <SectionHeader title="Assigned Orders" />

      {orders.length === 0 && !loading ? (
        <EmptyState icon="bicycle-outline" title="No orders available" subtitle="Pull to refresh or wait for new assignments." actionLabel="Refresh" onAction={() => { setRefreshing(true); loadOrders(); }} />
      ) : (
        <DraggableFlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, drag }) => (
            <OrderCardPro
              order={item}
              online={online}
              onLongPress={drag}
              acceptDisabled={!online || !ACCEPTABLE_ORDER_STATUSES.includes(normalizeOrderStatus(item.status))}
              onAccept={onAccept}
              onReject={onReject}
            />
          )}
          initialNumToRender={6}
          windowSize={8}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOrders(); }} />}
          onDragEnd={({ data }) => dispatch({ type: 'SET_ORDERS', payload: data.map((item, index) => ({ ...item, queuePosition: index + 1 })) })}
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
  statusPill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  statsRow: { flexDirection: 'row', padding: 16 },
  statCard: { flex: 1 },
});
