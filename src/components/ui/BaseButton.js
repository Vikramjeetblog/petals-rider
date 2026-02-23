import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import useTheme from '../../hooks/useTheme';
import AnimatedPressable from './AnimatedPressable';

export default function BaseButton({ title, onPress, loading, disabled, palette, style }) {
  const { theme } = useTheme();

  return (
    <AnimatedPressable
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderRadius: theme.radius.button,
        },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} size="small" />
      ) : (
        <Text style={[theme.typography.buttonText, { color: palette.text }]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.55,
  },
});
