import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function OrderCard({ order, onPress }) {
  if (!order) return null;

  return (
    <Pressable
      onPress={() => onPress?.(order)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.rowBetween}>
        <Text style={styles.orderId}>#{order.id}</Text>
        <Text style={styles.status}>{order.status}</Text>
      </View>

      <Text style={styles.route}>
        {order.pickup} → {order.drop}
      </Text>

      {order.eta ? (
        <View style={styles.row}>
          <Icon name="time-outline" size={14} color="#6B7280" />
          <Text style={styles.eta}>ETA: {order.eta}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  orderId: {
    fontWeight: '800',
    color: '#111827',
  },
  status: {
    fontWeight: '700',
    color: '#16A34A',
  },
  route: {
    marginTop: 8,
    color: '#374151',
  },
  eta: {
    marginLeft: 6,
    color: '#6B7280',
    fontSize: 12,
  },
});
