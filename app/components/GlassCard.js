import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GlassCard({ children, style }) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.35)", "rgba(255,255,255,0.20)"]}
      style={[styles.glass, style]}
    >
      <View style={styles.inner}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    margin: 8,
  },
  inner: {
    backdropFilter: 'blur(12px)', // for web, ignored on native
  },
});
