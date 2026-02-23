import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

const AnimatedView = Animated.createAnimatedComponent(Pressable);

export default function AnimatedPressable({ style, children, onPress, disabled }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 25,
      bounciness: 0,
    }).start();
  };

  return (
    <AnimatedView
      onPressIn={() => animateTo(0.98)}
      onPressOut={() => animateTo(1)}
      onPress={onPress}
      disabled={disabled}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedView>
  );
}
