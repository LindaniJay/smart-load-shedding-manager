import React, { useState } from 'react';
import { Platform } from 'react-native';
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { registerUser, loginUser } from '../services/localAuth';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [autoLoggingIn, setAutoLoggingIn] = useState(true);
  const [authMode, setAuthMode] = useState('local'); // 'local' or 'firebase'

  useEffect(() => {
    async function checkAutoLogin() {
      try {
        const user = await require('../services/localAuth').getLoggedInUser();
        if (user) {
          navigation.replace('Home');
        }
      } catch {}
      setAutoLoggingIn(false);
    }
    checkAutoLogin();
  }, []);

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (authMode === 'local') {
        if (isSignup) {
          await registerUser(email, password);
          navigation.replace('Home');
        } else {
          await loginUser(email, password);
          navigation.replace('Home');
        }
      } else {
        if (isSignup) {
          await auth().createUserWithEmailAndPassword(email, password);
          navigation.replace('Home');
        } else {
          await signInWithEmailAndPassword(auth, email, password);
          navigation.replace('Home');
        }
      }
    } catch (e) {
      setError(e.message || 'Authentication failed');
    }
    setLoading(false);
  };


  if (autoLoggingIn) {
    return (
      <AnimatedGradientBackground>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#43c6ac" />
        </View>
      </AnimatedGradientBackground>
    );
  }
  return (
    <AnimatedGradientBackground>
      <View style={styles.glassCard}>
        {/* Login Mode Switcher */}
        <View style={styles.modeSwitcher}>
          <TouchableOpacity
            style={[styles.modeBtn, authMode === 'local' && styles.modeBtnActive]}
            onPress={() => setAuthMode('local')}
          >
            <Text style={[styles.modeBtnText, authMode === 'local' && styles.modeBtnTextActive]}>Local</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, authMode === 'firebase' && styles.modeBtnActive]}
            onPress={() => setAuthMode('firebase')}
          >
            <Text style={[styles.modeBtnText, authMode === 'firebase' && styles.modeBtnTextActive]}>Firebase</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#8ec5fc"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#8ec5fc"
        />
        {error ? (
          <Text style={{ color: '#ff4e50', textAlign: 'center', marginBottom: 10 }}>{error}</Text>
        ) : null}
        <AnimatedTouchable style={styles.button} onPress={handleAuth} disabled={loading} activeOpacity={0.8}>
          <LinearGradient colors={["#43c6ac", "#191654"]} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>{loading ? (isSignup ? 'Signing up...' : 'Signing in...') : isSignup ? 'Sign Up' : 'Sign In'}</Text>
          </LinearGradient>
        </AnimatedTouchable>
        <TouchableOpacity style={styles.link} onPress={() => setIsSignup(!isSignup)}>
          <Text style={styles.linkText}>{isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => Alert.alert('Coming Soon', 'Google Sign-In coming soon!')}>
          <Text style={styles.linkText}>Sign in with Google</Text>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    fontSize: 17,
    color: '#222',
    borderWidth: 1.5,
    borderColor: '#8ec5fc',
    shadowColor: '#43c6ac',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 7,
  },
  button: {
    marginTop: 22,
    borderRadius: 22,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#43c6ac',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1.1,
    textShadowColor: '#19165499',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  link: {
    marginTop: 14,
    alignItems: 'center',
  },
  linkText: {
    color: '#ff4e50',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  modeSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 16,
    padding: 4,
  },
  modeBtn: {
    paddingVertical: 7,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginHorizontal: 4,
  },
  modeBtnActive: {
    backgroundColor: 'rgba(67,198,172,0.18)',
    borderColor: '#43c6ac',
    borderWidth: 1.5,
  },
  modeBtnText: {
    color: '#191654',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
    opacity: 0.7,
  },
  modeBtnTextActive: {
    color: '#43c6ac',
    opacity: 1,
  },
});
