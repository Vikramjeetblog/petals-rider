import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import useTheme from '../hooks/useTheme';
import { normalizeOrderStatus, STATUS_COLOR_MAP } from '../constants/orderStatus';

export default function StatusBadge({ status }) {
  const { theme } = useTheme();
  const normalized = normalizeOrderStatus(status);

  return (
    <View style={[styles.badge, { backgroundColor: STATUS_COLOR_MAP[normalized] || theme.colors.muted }]}>
      <Text style={[theme.typography.small, styles.label]}>{normalized.replace(/_/g, ' ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
