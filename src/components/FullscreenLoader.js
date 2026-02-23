import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import useTheme from '../hooks/useTheme';

export default function FullscreenLoader() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.mode === 'dark' ? 'rgba(11,18,32,0.65)' : 'rgba(255,255,255,0.7)' }]}> 
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
