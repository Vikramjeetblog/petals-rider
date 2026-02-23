import React from 'react';
import { StyleSheet, View } from 'react-native';
import useTheme from '../../hooks/useTheme';

export default function Divider({ style }) {
  const { theme } = useTheme();
  return <View style={[styles.base, { backgroundColor: theme.colors.border }, style]} />;
}

const styles = StyleSheet.create({
  base: { height: 1, width: '100%' },
});
