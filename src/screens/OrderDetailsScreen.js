import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function OrderDetailsScreen({ route, navigation }) {

  const { order } = route.params || {};

  if (!order) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No order data</Text>
      </SafeAreaView>
    );
  }

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.drop)}`;
    Linking.openURL(url);
  };

  const renderAlert = () => {
    if (!order.alert) return null;

    const isLive = order.alert === 'LIVE';

    return (
      <View style={[
        styles.alert,
        isLive ? styles.alertRed : styles.alertOrange,
      ]}>
        <Icon name="warning" size={16} color="#fff" />
        <Text style={styles.alertText}>
          {isLive
            ? 'LIVE ANIMAL – HANDLE CAREFULLY'
            : 'FRAGILE ITEMS'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <LinearGradient
        colors={['#16A34A', '#22C55E']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          Order #{order.id}
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Alert */}
        {renderAlert()}

        {/* Pickup */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pickup</Text>
          <View style={styles.row}>
            <Icon name="storefront" size={18} color="#16A34A" />
            <Text style={styles.text}>
              {order.pickup}
            </Text>
          </View>
        </View>

        {/* Drop */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery</Text>
          <View style={styles.row}>
            <Icon name="location" size={18} color="#16A34A" />
            <Text style={styles.text}>
              {order.drop}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>

          {(order.items || []).map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.qty} × {item.name}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.actions}>

        <TouchableOpacity
          style={styles.mapBtn}
          onPress={openMaps}
        >
          <Icon name="navigate" size={18} color="#fff" />
          <Text style={styles.actionText}>
            Navigate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            navigation.navigate('DeliveryProof', { order })
          }
        >
          <Text style={styles.actionText}>
            Complete Delivery
          </Text>
          <Icon name="checkmark-circle" size={18} color="#fff" />
        </TouchableOpacity>

      </View>

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
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  text: {
    marginLeft: 8,
    color: '#374151',
  },

  itemRow: {
    paddingVertical: 4,
  },

  itemText: {
    color: '#374151',
  },

  alert: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
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
    fontWeight: '600',
    fontSize: 12,
  },

  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 8,
  },

  mapBtn: {
    backgroundColor: '#6B7280',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  primaryBtn: {
    backgroundColor: '#16A34A',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '700',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
