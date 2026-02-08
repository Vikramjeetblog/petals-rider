import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RiderDashboardScreen({ navigation }) {

  // 🔥 MOCK DATA — replace with backend later
  const mockOrders = [];

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [online] = useState(true);

  const loadOrders = async () => {
    try {
      setOrders(mockOrders);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setTimeout(loadOrders, 800);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  // 🔔 Alert banner renderer
  const renderAlert = (item) => {
    if (!item.alert) return null;

    const isLive = item.alert === 'LIVE';

    return (
      <View style={[
        styles.alert,
        isLive ? styles.alertRed : styles.alertOrange,
      ]}>
        <Icon name="warning" size={14} color="#fff" />
        <Text style={styles.alertText}>
          {isLive
            ? 'LIVE ANIMAL – HANDLE CAREFULLY'
            : 'FRAGILE ITEMS'}
        </Text>
      </View>
    );
  };

  // 📦 Order card renderer
  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('OrderDetails', { order: item })
      }
    >
      <View style={styles.row}>
        <Text style={styles.orderId}>#{item.id}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>

      <Text style={styles.route}>
        {item.pickup} → {item.drop}
      </Text>

      <Text style={styles.eta}>
        ETA: {item.eta}
      </Text>

      {renderAlert(item)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <LinearGradient
        colors={['#16A34A', '#22C55E']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          Active Deliveries
        </Text>

        <View style={styles.statusRow}>
          <View style={[
            styles.statusDot,
            online && styles.statusOnline,
          ]} />
          <Text style={styles.statusText}>
            {online ? 'Online' : 'Offline'}
          </Text>
        </View>
      </LinearGradient>

      {/* Loading */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#16A34A"
          style={{ marginTop: 40 }}
        />
      ) : orders.length === 0 ? (

        // 🔥 Production empty state
        <View style={styles.emptyContainer}>

          <Icon
            name="bicycle-outline"
            size={72}
            color="#9CA3AF"
          />

          <Text style={styles.emptyTitle}>
            You're Online & Ready
          </Text>

          <Text style={styles.emptySubtitle}>
            Waiting for delivery assignments.
            Pull down or tap refresh.
          </Text>

          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={loadOrders}
          >
            <Text style={styles.refreshText}>
              Refresh Orders
            </Text>
          </TouchableOpacity>

        </View>

      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  header: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9CA3AF',
    marginRight: 6,
  },

  statusOnline: {
    backgroundColor: '#4ADE80',
  },

  statusText: {
    color: '#fff',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  orderId: {
    fontWeight: '700',
  },

  status: {
    color: '#16A34A',
    fontWeight: '600',
  },

  route: {
    marginTop: 6,
    color: '#374151',
  },

  eta: {
    marginTop: 4,
    color: '#6B7280',
  },

  alert: {
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  alertRed: {
    backgroundColor: '#DC2626',
  },

  alertOrange: {
    backgroundColor: '#EA580C',
  },

  alertText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },

  emptySubtitle: {
    marginTop: 6,
    textAlign: 'center',
    color: '#6B7280',
  },

  refreshBtn: {
    marginTop: 18,
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  refreshText: {
    color: '#fff',
    fontWeight: '700',
  },

});
