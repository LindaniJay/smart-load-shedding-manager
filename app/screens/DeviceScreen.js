import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Animated } from 'react-native';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import { getDevice, setDeviceState, setDeviceSchedule } from '../services/devices';

export default function DeviceScreen({ route, navigation }) {
  const { deviceId } = route.params || {};
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!deviceId) return;
    setLoading(true);
    const unsubscribe = listenToDevice(deviceId, data => {
      setDevice(data);
      setLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, [deviceId]);

  const handleToggle = async () => {
    if (!device) return;
    setToggling(true);
    await setDeviceState(deviceId, device.state === 'on' ? 'off' : 'on');
    setToggling(false);
  };

  return (
    <LinearGradient colors={["#f8ffae", "#43c6ac"]} style={styles.container}>
          <ScrollView>
            {loading || !device ? (
              <ActivityIndicator size="large" color="#43c6ac" />
            ) : (
              <View>
                <Text style={styles.deviceName}>{device?.name || deviceId}</Text>
                <Text style={styles.deviceStatus}>Status: {device?.state || 'off'}</Text>
                <TouchableOpacity style={styles.button} onPress={handleToggle} disabled={toggling} activeOpacity={0.85}>
                  <Animated.View style={styles.buttonGradientWrap}>
                    <Text style={styles.buttonText}>{toggling ? 'Toggling...' : device?.state === 'on' ? 'Turn Off' : 'Turn On'}</Text>
                  </Animated.View>
                <Text style={styles.scheduleLabel}>Set On Time (HH:MM):</Text>
                <TextInput
                  style={styles.scheduleInput}
                  placeholder="e.g. 18:00"
                  value={onTime}
                  onChangeText={setOnTime}
                />
                <Text style={styles.scheduleLabel}>Set Off Time (HH:MM):</Text>
                <TextInput
                  style={styles.scheduleInput}
                  placeholder="e.g. 22:00"
                  value={offTime}
                  onChangeText={setOffTime}
                />
                <TouchableOpacity style={styles.button} onPress={handleSetSchedule}>
                  <Text style={styles.buttonText}>Save Schedule</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            {/* Device Prioritization */}
            <View style={styles.prioCard}>
              <Text style={styles.scheduleTitle}>Priority</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 8 }}>
                {['High', 'Medium', 'Low'].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[styles.prioBtn, device.priority === level ? styles.prioBtnActive : null]}
                    onPress={async () => await handleSetPriority(level)}
                  >
                    <Text style={styles.buttonText}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Remove Device */}
            <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4e50', marginTop: 24 }]} onPress={handleRemoveDevice}>
              <Text style={[styles.buttonText, { color: '#fff' }]}>Remove Device</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
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
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 24,
    padding: 32,
    margin: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 14,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  button: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
  scheduleCard: {
    marginTop: 26,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
