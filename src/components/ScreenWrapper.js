import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import useTheme from '../hooks/useTheme';

export default function ScreenWrapper({ children, contentStyle, style }) {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }, style]}>
      <View style={[styles.content, { paddingHorizontal: theme.spacing.lg }, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1 },
});
