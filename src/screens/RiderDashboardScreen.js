import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DraggableFlatList from 'react-native-draggable-flatlist';

import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import FullscreenLoader from '../components/FullscreenLoader';
import ScreenWrapper from '../components/ScreenWrapper';
import colors from '../constants/colors';
import spacing from '../constants/spacing';
import typography from '../constants/typography';
import { fetchAssignedOrders } from '../services/riderApi';

export default function RiderDashboardScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [online, setOnline] = useState(true);
  const [shiftSeconds, setShiftSeconds] = useState(0);

  const earnings = { today: 540, deliveries: 6 };

  const loadOrders = async () => {
    try {
      const res = await fetchAssignedOrders();
      const enriched = (Array.isArray(res) ? res : res?.items || []).map((order, index) => ({
        ...order,
        status: order.status || 'Pending',
        deadline: Date.now() + (5 + index * 2) * 60 * 1000,
        priority: index === 0 ? 'HIGH' : index === 1 ? 'MEDIUM' : 'LOW',
        queuePosition: index + 1,
      }));
      setOrders(enriched);
    } catch (err) {
      console.log('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (!online) return;
    const interval = setInterval(() => setShiftSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [online]);

  const formatShift = () => {
    const h = Math.floor(shiftSeconds / 3600);
    const m = Math.floor((shiftSeconds % 3600) / 60);
    const s = shiftSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const expireOrder = (order) => {
    setOrders((prev) => prev.filter((entry) => entry.id !== order.id));
    Alert.alert('Delivery Expired', `Order #${order.id} timed out`);
  };

  const Countdown = ({ order }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
      const update = () => {
        const diff = Math.max(0, Math.floor((order.deadline - Date.now()) / 1000));
        setTimeLeft(diff);
        if (diff === 0) expireOrder(order);
      };

      update();
      const timer = setInterval(update, 1000);
      return () => clearInterval(timer);
    }, [order]);

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return (
      <Text style={[styles.timer, timeLeft < 120 && styles.timerDanger]}>
        ⏱ {mins}:{secs.toString().padStart(2, '0')}
      </Text>
    );
  };

  const renderBadge = (label, style) => (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );

  const renderOrder = ({ item, drag, isActive }) => (
    <TouchableOpacity onLongPress={drag} style={[styles.card, isActive && styles.dragActive]}>
      <View style={styles.rowBetween}>
        {renderBadge(item.queuePosition === 1 ? 'ACTIVE' : item.queuePosition === 2 ? 'NEXT' : `#${item.queuePosition}`,
          item.queuePosition === 1 ? styles.queueActive : item.queuePosition === 2 ? styles.queueNext : styles.queuePending)}
        {renderBadge(item.priority, item.priority === 'HIGH' ? styles.priorityHigh : item.priority === 'MEDIUM' ? styles.priorityMedium : styles.priorityLow)}
      </View>

      <Text style={styles.orderId}>Order #{item.id}</Text>
      <Text style={styles.route}>{item.pickup} → {item.drop}</Text>
      <Countdown order={item} />

      {item.status !== 'Accepted' ? (
        <View style={styles.actionRow}>
          <AppButton
            title="Accept"
            style={[styles.actionButton, styles.firstActionButton]}
            onPress={() => {
              setOrders((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, status: 'Accepted' } : entry)));
              navigation.navigate('OrderDetails', { order: item });
            }}
          />
          <AppButton
            title="Reject"
            variant="danger"
            style={styles.actionButton}
            onPress={() => setOrders((prev) => prev.filter((entry) => entry.id !== item.id))}
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper contentStyle={styles.content}>
      <LinearGradient colors={[colors.success, '#22C55E']} style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Active Deliveries</Text>
          <Text style={styles.shiftTimer}>Shift: {formatShift()}</Text>
        </View>
        <TouchableOpacity style={[styles.statusPill, online ? styles.onlinePill : styles.offlinePill]} onPress={() => setOnline((prev) => !prev)}>
          <Text style={styles.statusText}>{online ? '🟢 Online' : '🔴 Offline'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.earningsCard}>
        <Text style={styles.earningsAmount}>₹{earnings.today}</Text>
        <Text style={styles.earningsSub}>{earnings.deliveries} deliveries today</Text>
      </View>

      {orders.length === 0 && !loading ? (
        <EmptyState
          icon="bicycle-outline"
          title="No active deliveries"
          subtitle="You're all caught up. Pull down to refresh for new assignments."
          actionLabel="Refresh"
          onAction={() => {
            setRefreshing(true);
            loadOrders();
          }}
        />
      ) : (
        <DraggableFlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOrders(); }} />}
          onDragEnd={({ data }) => {
            setOrders(data.map((order, index) => ({ ...order, queuePosition: index + 1 })));
          }}
        />
      )}

      {loading ? <FullscreenLoader /> : null}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 0,
  },
  header: {
    padding: spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.heading,
    color: '#FFFFFF',
  },
  shiftTimer: {
    ...typography.caption,
    color: colors.successSoft,
    marginTop: spacing.xs,
  },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  onlinePill: { backgroundColor: colors.successSoft },
  offlinePill: { backgroundColor: '#FEE2E2' },
  statusText: { fontWeight: '700', color: colors.textPrimary },
  earningsCard: {
    backgroundColor: colors.card,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    elevation: 2,
  },
  earningsAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.success,
  },
  earningsSub: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
  },
  dragActive: { opacity: 0.85 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  orderId: { ...typography.subheading, color: colors.textPrimary, marginTop: spacing.sm },
  route: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  timer: { marginTop: spacing.sm, fontWeight: '700', color: colors.textPrimary },
  timerDanger: { color: colors.danger },
  actionRow: { flexDirection: 'row', marginTop: spacing.md },
  actionButton: { flex: 1 },
  firstActionButton: { marginRight: spacing.sm },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 12 },
  queueActive: { backgroundColor: colors.success },
  queueNext: { backgroundColor: colors.warning },
  queuePending: { backgroundColor: colors.textSecondary },
  priorityHigh: { backgroundColor: colors.danger },
  priorityMedium: { backgroundColor: colors.warning },
  priorityLow: { backgroundColor: colors.success },
  badgeText: { color: '#FFFFFF', ...typography.caption },
});
