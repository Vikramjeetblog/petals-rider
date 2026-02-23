import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';

export default function OfflineBanner() {
  const { state } = useAppStore();
  const { theme } = useTheme();

  if (!state.network.isOffline) {
    return null;
  }

  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.warning }]}> 
      <Text style={[theme.typography.caption, styles.label]}>You are offline. Some actions are disabled.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  label: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
  },
});
