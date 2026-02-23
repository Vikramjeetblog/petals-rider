import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import colors from '../constants/colors';
import spacing from '../constants/spacing';

export default function ScreenWrapper({ children, contentStyle, style }) {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});
