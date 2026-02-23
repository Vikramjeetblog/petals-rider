import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';

export default function ToastHost() {
  const { state, dispatch } = useAppStore();
  const { theme } = useTheme();
  const y = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (!state.toast?.message) return;

    Animated.sequence([
      Animated.timing(y, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(y, { toValue: 80, duration: 200, useNativeDriver: true }),
    ]).start(() => dispatch({ type: 'CLEAR_TOAST' }));
  }, [dispatch, state.toast, y]);

  if (!state.toast?.message) return null;

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View style={[styles.toast, { backgroundColor: theme.colors.textPrimary, transform: [{ translateY: y }] }]}>
        <Text style={[theme.typography.caption, styles.label]}>{state.toast.message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  toast: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  label: {
    color: '#FFFFFF',
  },
});
