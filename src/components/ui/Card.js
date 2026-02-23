import React from 'react';
import { StyleSheet, View } from 'react-native';

import useTheme from '../../hooks/useTheme';

export default function Card({ children, style }) {
  const { theme } = useTheme();
  return <View style={[styles.base, { backgroundColor: theme.colors.card, borderRadius: theme.radius.card, borderColor: theme.colors.border }, theme.shadows.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    padding: 16,
  },
});
