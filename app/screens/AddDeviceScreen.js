import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import { addDevice } from '../services/devices';

export default function AddDeviceScreen({ navigation }) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleAddDevice = async () => {
    if (!name) {
      Alert.alert('Error', 'Device name is required.');
      return;
    }
    setLoading(true);
    try {
      const newDeviceRef = database().ref('/devices').push();
      await newDeviceRef.set({
        name,
        priority,
        state: 'off',
        schedule: {},
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  return (
    <AnimatedGradientBackground>
      <View style={styles.container}>
        <Animated.View style={[styles.glassCard, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }]}> 
          <Text style={styles.title}>Add Device</Text>
          <TextInput
            style={styles.input}
            placeholder="Device Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#8ec5fc"
          />
          <TextInput
            style={styles.input}
            placeholder="Priority (High, Medium, Low)"
            value={priority}
            onChangeText={setPriority}
            placeholderTextColor="#8ec5fc"
          />
          <TouchableOpacity style={styles.button} onPress={handleAddDevice} disabled={loading} activeOpacity={0.85}>
            <Animated.View style={styles.buttonGradientWrap}>
              <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Device'}</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Back</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </AnimatedGradientBackground>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    color: '#222',
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
