import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import useTheme from '../hooks/useTheme';
import PrimaryButton from './ui/PrimaryButton';

export default function EmptyState({ icon = 'file-tray-outline', title, subtitle, actionLabel, onAction }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { padding: theme.spacing.xl }]}> 
      <Icon name={icon} size={64} color={theme.colors.muted} />
      <Text style={[theme.typography.headingMD, styles.center, { color: theme.colors.textPrimary, marginTop: theme.spacing.md }]}>{title}</Text>
      {!!subtitle && <Text style={[theme.typography.body, styles.center, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>{subtitle}</Text>}
      {actionLabel && onAction ? <PrimaryButton title={actionLabel} onPress={onAction} style={styles.button} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  center: { textAlign: 'center' },
  button: { minWidth: 160, marginTop: 16 },
});
