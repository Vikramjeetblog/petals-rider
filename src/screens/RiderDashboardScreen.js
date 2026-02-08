import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { fetchAssignedOrders } from '../services/riderApi';

export default function RiderDashboardScreen({ navigation }) {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [online, setOnline] = useState(true);
  const [shiftSeconds, setShiftSeconds] = useState(0);

  const earnings = { today: 540, deliveries: 6 };

  // ================= FETCH ORDERS =================

  const loadOrders = async () => {
    try {
      const res = await fetchAssignedOrders();

      const enriched = (res?.data || []).map((o, i) => {

        const deadline =
          Date.now() + (5 + i * 2) * 60 * 1000;

        let priority = 'LOW';
        if (i === 0) priority = 'HIGH';
        else if (i === 1) priority = 'MEDIUM';

        return {
          ...o,
          status: o.status || 'Pending',
          deadline,
          priority,
          queuePosition: i + 1,
        };
      });

      setOrders(enriched);

    } catch (err) {
      console.log('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ SAFE EFFECT
  useEffect(() => {
    loadOrders();
  }, []);

  // ================= SHIFT TIMER =================

  useEffect(() => {

    let interval;

    if (online) {
      interval = setInterval(() => {
        setShiftSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };

  }, [online]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  // ================= SHIFT FORMAT =================

  const formatShift = () => {
    const h = Math.floor(shiftSeconds / 3600);
    const m = Math.floor((shiftSeconds % 3600) / 60);
    const s = shiftSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // ================= ORDER ACTIONS =================

  const acceptOrder = order => {
    setOrders(prev =>
      prev.map(o =>
        o.id === order.id
          ? { ...o, status: 'Accepted' }
          : o
      )
    );

    navigation.navigate('OrderDetails', { order });
  };

  const rejectOrder = order => {
    setOrders(prev =>
      prev.filter(o => o.id !== order.id)
    );
  };

  const expireOrder = order => {

    setOrders(prev =>
      prev.filter(o => o.id !== order.id)
    );

    Alert.alert(
      'Delivery Expired',
      `Order #${order.id} timed out`
    );
  };

  // ================= COUNTDOWN =================

  const Countdown = ({ order }) => {

    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {

      const deadline = order.deadline;

      const update = () => {

        const diff = Math.max(
          0,
          Math.floor((deadline - Date.now()) / 1000)
        );

        setTimeLeft(diff);

        if (diff === 0) expireOrder(order);
      };

      update();

      const timer =
        setInterval(update, 1000);

      return () => {
        clearInterval(timer);
      };

    }, [order.deadline]);

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return (
      <Text
        style={[
          styles.timer,
          timeLeft < 120 &&
            styles.timerDanger,
        ]}
      >
        ⏱ {mins}:{secs
          .toString()
          .padStart(2, '0')}
      </Text>
    );
  };

  // ================= BADGES =================

  const renderPriority = p => {

    const map = {
      HIGH: styles.priorityHigh,
      MEDIUM: styles.priorityMedium,
      LOW: styles.priorityLow,
    };

    return (
      <View
        style={[
          styles.priorityBadge,
          map[p],
        ]}
      >
        <Text style={styles.badgeText}>
          {p}
        </Text>
      </View>
    );
  };

  const renderQueue = pos => {

    let label = `#${pos}`;
    let style = styles.queuePending;

    if (pos === 1) {
      label = 'ACTIVE';
      style = styles.queueActive;
    } else if (pos === 2) {
      label = 'NEXT';
      style = styles.queueNext;
    }

    return (
      <View
        style={[
          styles.queueBadge,
          style,
        ]}
      >
        <Text style={styles.badgeText}>
          {label}
        </Text>
      </View>
    );
  };

  // ================= ORDER CARD =================

  const renderOrder = ({
    item,
    drag,
    isActive,
  }) => (

    <TouchableOpacity
      onLongPress={drag}
      style={[
        styles.card,
        isActive &&
          styles.dragActive,
      ]}
    >

      <View style={styles.row}>
        {renderQueue(
          item.queuePosition
        )}
        {renderPriority(
          item.priority
        )}
      </View>

      <Text style={styles.orderId}>
        #{item.id}
      </Text>

      <Text style={styles.route}>
        {item.pickup} → {item.drop}
      </Text>

      <Countdown order={item} />

      {item.status !==
        'Accepted' && (
        <View style={styles.actionRow}>

          <TouchableOpacity
            style={
              styles.acceptBtn
            }
            onPress={() =>
              acceptOrder(item)
            }
          >
            <Text
              style={
                styles.actionText
              }
            >
              Accept
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.rejectBtn
            }
            onPress={() =>
              rejectOrder(item)
            }
          >
            <Text
              style={
                styles.actionText
              }
            >
              Reject
            </Text>
          </TouchableOpacity>

        </View>
      )}

    </TouchableOpacity>
  );

  // ================= UI =================

  return (
    <SafeAreaView
      style={styles.container}
    >

      <LinearGradient
        colors={[
          '#16A34A',
          '#22C55E',
        ]}
        style={styles.header}
      >
        <View>
          <Text
            style={
              styles.headerTitle
            }
          >
            Active Deliveries
          </Text>

          <Text
            style={
              styles.shiftTimer
            }
          >
            Shift:{' '}
            {formatShift()}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
          ]}
          onPress={() =>
            setOnline(!online)
          }
        >
          <Text
            style={
              styles.statusText
            }
          >
            {online
              ? 'Online'
              : 'Offline'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <View
        style={styles.earningsCard}
      >
        <Text
          style={
            styles.earningsAmount
          }
        >
          ₹{earnings.today}
        </Text>

        <Text
          style={
            styles.earningsSub
          }
        >
          {
            earnings.deliveries
          }{' '}
          deliveries
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />
      ) : orders.length === 0 ? (

        <View
          style={
            styles.emptyContainer
          }
        >
          <Text>
            No active deliveries
          </Text>
        </View>

      ) : (

        <DraggableFlatList
          data={orders}
          keyExtractor={item =>
            item.id.toString()
          }
          renderItem={
            renderOrder
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                onRefresh
              }
            />
          }
          onDragEnd={({
            data,
          }) => {
            const updated =
              data.map(
                (o, i) => ({
                  ...o,
                  queuePosition:
                    i + 1,
                })
              );
            setOrders(updated);
          }}
        />

      )}

    </SafeAreaView>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  header: {
    padding: 18,
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  shiftTimer: {
    color: '#DCFCE7',
    fontSize: 12,
  },

  toggleBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor:
      '#DCFCE7',
  },

  statusText: {
    fontWeight: '700',
  },

  earningsCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 18,
  },

  earningsAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#16A34A',
  },

  earningsSub: {
    color: '#6B7280',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 10,
  },

  dragActive: {
    opacity: 0.8,
  },

  row: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },

  orderId: {
    fontWeight: '800',
    marginTop: 8,
  },

  route: {
    marginTop: 4,
  },

  timer: {
    marginTop: 6,
    fontWeight: '700',
  },

  timerDanger: {
    color: '#DC2626',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },

  acceptBtn: {
    flex: 1,
    backgroundColor:
      '#16A34A',
    padding: 10,
    borderRadius: 8,
    marginRight: 6,
    alignItems: 'center',
  },

  rejectBtn: {
    flex: 1,
    backgroundColor:
      '#DC2626',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  actionText: {
    color: '#fff',
    fontWeight: '700',
  },

  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  priorityHigh: {
    backgroundColor:
      '#DC2626',
  },

  priorityMedium: {
    backgroundColor:
      '#EA580C',
  },

  priorityLow: {
    backgroundColor:
      '#16A34A',
  },

  queueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  queueActive: {
    backgroundColor:
      '#16A34A',
  },

  queueNext: {
    backgroundColor:
      '#EA580C',
  },

  queuePending: {
    backgroundColor:
      '#6B7280',
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
  },

  emptyContainer: {
    flex: 1,
    justifyContent:
      'center',
    alignItems: 'center',
  },

});
