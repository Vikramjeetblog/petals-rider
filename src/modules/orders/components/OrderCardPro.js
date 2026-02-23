import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AppButton from '../../../components/AppButton';
import StatusBadge from '../../../components/StatusBadge';
import Card from '../../../components/ui/Card';
import AnimatedPressable from '../../../components/ui/AnimatedPressable';
import useTheme from '../../../hooks/useTheme';

function OrderCardPro({
  order,
  online,
  isOffline,
  onAccept,
  onReject,
  acceptDisabled,
  onLongPress,
}) {
  const { theme } = useTheme();

  return (
    <AnimatedPressable onPress={() => null} onLongPress={onLongPress} style={styles.pressable}>
      <Card style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={[theme.typography.headingMD, { color: theme.colors.textPrimary }]}>#{order.id}</Text>
          <StatusBadge status={order.status} />
        </View>

        <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>Pickup</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]} numberOfLines={2}>
          {order.pickup}
        </Text>

        <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>Drop</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]} numberOfLines={2}>
          {order.drop}
        </Text>

        <View style={styles.metaRow}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Distance: {order.distance || '2.4 km'}</Text>
          <Text style={[theme.typography.headingMD, { color: theme.colors.primary }]}>₹{order.earning || order.payout || 90}</Text>
        </View>

        <View style={styles.actions}>
          <AppButton
            title={isOffline ? 'Offline' : online ? 'Accept' : 'Go online'}
            disabled={acceptDisabled}
            style={[styles.button, styles.gap]}
            onPress={() => onAccept(order)}
          />
          <AppButton
            title="Reject"
            variant="danger"
            disabled={isOffline}
            style={styles.button}
            onPress={() => onReject(order)}
          />
        </View>
      </Card>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pressable: { marginBottom: 12 },
  card: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  actions: { flexDirection: 'row', marginTop: 14 },
  button: { flex: 1 },
  gap: { marginRight: 8 },
});

export default memo(OrderCardPro);
