import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AlertBanner({ variant = 'warning', message }) {
  if (!message) return null;

  const stylesByVariant = {
    warning: { backgroundColor: '#EA580C', icon: 'warning' },
    danger: { backgroundColor: '#DC2626', icon: 'alert-circle' },
    info: { backgroundColor: '#2563EB', icon: 'information-circle' },
  };

  const selected = stylesByVariant[variant] || stylesByVariant.warning;

  return (
    <View style={[styles.container, { backgroundColor: selected.backgroundColor }]}>
      <Icon name={selected.icon} size={16} color="#fff" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '700',
    fontSize: 12,
  },
});
