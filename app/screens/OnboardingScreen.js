import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';

export default function OnboardingScreen({ navigation }) {
  return (
    <LinearGradient colors={["#e0c3fc", "#8ec5fc"]} style={styles.container}>
      <View style={styles.glassCard}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Set up your Smart Load Shedding Manager in a few easy steps.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Auth')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 28,
    padding: 36,
    margin: 18,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#444',
    marginBottom: 22,
    textAlign: 'center',
  },
  button: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.11,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
  },
});
