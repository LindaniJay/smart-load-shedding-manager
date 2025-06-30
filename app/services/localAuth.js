// Local authentication service using expo-secure-store for credential storage
import * as SecureStore from 'expo-secure-store';

const USERS_KEY = 'LOCAL_USERS';

export async function registerUser(email, password) {
  let users = await getAllUsers();
  if (users[email]) {
    throw new Error('User already exists');
  }
  users[email] = { password };
  await SecureStore.setItemAsync(USERS_KEY, JSON.stringify(users));
  return true;
}

export async function loginUser(email, password) {
  let users = await getAllUsers();
  if (!users[email] || users[email].password !== password) {
    throw new Error('Invalid credentials');
  }
  await SecureStore.setItemAsync('LOGGED_IN_USER', email);
  return true;
}

export async function getLoggedInUser() {

  return await SecureStore.getItemAsync('LOGGED_IN_USER');
}

export async function logoutUser() {

  await SecureStore.deleteItemAsync('LOGGED_IN_USER');
}

async function getAllUsers() {
  const usersStr = await SecureStore.getItemAsync(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : {};
}
