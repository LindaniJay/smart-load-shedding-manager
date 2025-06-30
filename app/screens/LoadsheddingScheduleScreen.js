import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { fetchLoadsheddingSchedule } from '../services/eskomApi';

const LoadsheddingScheduleScreen = ({ navigation }) => {
  const [area, setArea] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [showPlugPrompt, setShowPlugPrompt] = useState(false);

  const getSchedule = async (areaName) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchLoadsheddingSchedule(areaName);
      setSchedule(data);
      setShowPlugPrompt(true);
    } catch (err) {
      setError('Could not fetch schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocation = async () => {
    setLocationLoading(true);
    setError('');
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLocationLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      // Reverse geocode to area name (simplified)
      let address = await Location.reverseGeocodeAsync(location.coords);
      if (address && address.length > 0) {
        setArea(address[0].suburb || address[0].city || '');
        getSchedule(address[0].suburb || address[0].city || '');
      } else {
        setError('Could not determine area from location');
      }
    } catch (err) {
      setError('Error fetching location');
    } finally {
      setLocationLoading(false);
    }
  };

  const handlePlugSchedule = (action) => {
    setShowPlugPrompt(false);
    navigation.navigate('DeviceScreen', { action, schedule });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loadshedding Schedule</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your area name"
        value={area}
        onChangeText={setArea}
      />
      <Button title="Find Schedule" onPress={() => getSchedule(area)} disabled={loading || !area} />
      <TouchableOpacity style={styles.locationBtn} onPress={handleLocation} disabled={locationLoading}>
        <Text style={styles.locationText}>{locationLoading ? 'Detecting location...' : 'Use My Location'}</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {schedule && (
        <View style={styles.scheduleBox}>
          <Text style={styles.scheduleTitle}>Schedule for {area}</Text>
          {/* Example: Displaying schedule details */}
          {schedule.stages && schedule.stages.length > 0 ? (
            schedule.stages.map((stage, idx) => (
              <Text key={idx} style={styles.scheduleItem}>
                Stage {stage.stage}: {stage.times.join(', ')}
              </Text>
            ))
          ) : (
            <Text>No schedule data available.</Text>
          )}
        </View>
      )}
      {showPlugPrompt && (
        <View style={styles.promptBox}>
          <Text style={styles.promptText}>Do you want to schedule ON or OFF of plugs for these times?</Text>
          <View style={styles.promptBtns}>
            <Button title="Schedule ON" onPress={() => handlePlugSchedule('on')} />
            <Button title="Schedule OFF" onPress={() => handlePlugSchedule('off')} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  locationBtn: { marginTop: 10, marginBottom: 10, alignItems: 'center' },
  locationText: { color: '#007bff', fontWeight: 'bold' },
  error: { color: 'red', marginTop: 10 },
  scheduleBox: { marginTop: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8 },
  scheduleTitle: { fontWeight: 'bold', marginBottom: 10 },
  scheduleItem: { marginBottom: 5 },
  promptBox: { marginTop: 20, padding: 15, backgroundColor: '#e0f7fa', borderRadius: 8 },
  promptText: { fontWeight: 'bold', marginBottom: 10 },
  promptBtns: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default LoadsheddingScheduleScreen;
