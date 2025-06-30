import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const colorSets = [
  ['#f9d423', '#ff4e50', '#e0c3fc', '#8ec5fc'],
  ['#43c6ac', '#191654', '#6dd5ed', '#2193b0'],
  ['#e0eafc', '#cfdef3', '#f7971e', '#ffd200'],
];

export default function AnimatedGradientBackground({ children }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 8000, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 2, duration: 8000, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 8000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const inputRange = [0, 1, 2];
  const bgColors = colorSets.map(set => set);
  const colors = anim.interpolate({
    inputRange,
    outputRange: bgColors,
  });

  // For MVP, just cycle through color sets
  const idx = anim.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 1, 2] });
  const currentColors = colorSets[Math.floor(Math.random() * colorSets.length)];

  return (
    <LinearGradient colors={currentColors} style={styles.bg}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
