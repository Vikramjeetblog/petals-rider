import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import colors from '../constants/colors';

export default function FullscreenLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.success} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});
