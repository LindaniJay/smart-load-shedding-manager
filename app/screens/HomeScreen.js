import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Animated, Dimensions } from 'react-native';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import { getDevices, setDeviceState } from '../services/devices';

import { logoutUser } from '../services/localAuth';

export default function HomeScreen({ navigation }) {
  const [devices, setDevices] = useState({});
  const [loading, setLoading] = useState(true);
  const userId = 'demo_user'; // Replace with actual auth user id

  useEffect(() => {
    async function fetchDevices() {
      setLoading(true);
      const devs = await getDevices(userId);
      setDevices(devs);
      setLoading(false);
    }
    fetchDevices();
    // Optionally, add real-time listeners here
  }, []);

  const handleToggle = async (deviceId, currentState) => {
    await setDeviceState(deviceId, currentState === 'on' ? 'off' : 'on');
    // Optimistic UI update
    setDevices(prev => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        state: currentState === 'on' ? 'off' : 'on',
      },
    }));
  };

  // Animation for device cards
  const cardAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
      delay: 200,
    }).start();
  }, [devices]);

  // Logout handler
  const handleLogout = async () => {
    await logoutUser();
    navigation.replace('Auth');
  };

  return (
    <AnimatedGradientBackground>
      <View style={styles.container}>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.glassCard}>
          <Text style={styles.title}>Smart Load Shedding</Text>
          <Text style={styles.subtitle}>Manage your devices efficiently during load shedding.</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#43c6ac" />
          ) : (
            <ScrollView style={styles.deviceList}>
              {Object.entries(devices).map(([id, device], idx) => (
                <Animated.View
                  key={id}
                  style={{
                    opacity: cardAnim,
                    transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
                  }}
                >
                  <TouchableOpacity
                    style={styles.deviceCard}
                    onPress={() => navigation.navigate('Device', { deviceId: id })}
                    onLongPress={() => handleToggle(id, device.state)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.deviceName}>{device.name || id}</Text>
                    <Text style={styles.deviceStatus}>Status: {device.state || 'off'}</Text>
                    <Text style={styles.deviceStatus}>Priority: {device.priority || 'Medium'}</Text>
                    <Text style={styles.deviceStatus}>(Long press to toggle)</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          )}
        </View>
        {/* Floating Action Button for Add Device */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddDevice')}
          activeOpacity={0.88}
        >
          <Animated.View style={styles.fabInner}>
            <Text style={styles.fabText}>+</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    padding: 28,
    margin: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 18,
    textAlign: 'center',
  },
  deviceList: {
    marginTop: 10,
  },
  deviceCard: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    shadowColor: '#43c6ac',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    borderWidth: 1.5,
    borderColor: '#8ec5fc',
    elevation: 7,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  deviceStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
