// Device service for managing smart plugs in Firebase
import { database } from './firebase';

export async function getDevices(userId) {
  const snapshot = await database().ref(`/users/${userId}/devices`).once('value');
  return snapshot.val() || {};
}

export async function setDeviceState(deviceId, state) {
  return database().ref(`/devices/${deviceId}`).update({ state });
}

export async function listenToDevice(deviceId, callback) {
  return database()
    .ref(`/devices/${deviceId}`)
    .on('value', snapshot => callback(snapshot.val()));
}
