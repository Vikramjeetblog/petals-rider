import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../hooks/useTheme';

export default function SectionHeader({ title, rightNode }) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[theme.typography.headingMD, { color: theme.colors.textPrimary }]}>{title}</Text>
      {rightNode}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
