import React from 'react';
import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';

import colors from '../constants/colors';
import spacing from '../constants/spacing';

const variants = {
  primary: {
    backgroundColor: colors.success,
    borderColor: colors.success,
    textColor: '#FFFFFF',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.success,
    textColor: colors.success,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
    textColor: '#FFFFFF',
  },
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  style,
  disabled,
  loading,
}) {
  const palette = variants[variant] || variants.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.backgroundColor, borderColor: palette.borderColor },
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.textColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: palette.textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
