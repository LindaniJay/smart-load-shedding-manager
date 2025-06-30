# Smart Load Shedding Manager - Mobile App

A modern, animated app for controlling and scheduling smart plugs during load shedding. Designed for homes, clinics, and small businesses facing power interruptions, this app lets you automate, prioritize, and manage energy usage with ease.

## What is this app?
This app is part of the Smart Load Shedding Manager MVP. It connects to smart IoT plugs (ESP32-based) and enables users to:
- **Remotely control devices** (turn on/off)
- **Schedule device operation** (set on/off times)
- **Prioritize essential devices** (assign High/Medium/Low priority)
- **Add or remove smart plugs**
- **Authenticate securely** with either:
  - Local device credentials (offline, stored securely)
  - Firebase Auth (cloud, for multi-device sync)
- **Enjoy a premium experience** with animated glassmorphism UI and vibrant color themes

## Key Features
- Animated, glassy UI with beautiful gradients and transitions
- Onboarding, login, and signup (choose Local or Firebase authentication)
- Auto-login if credentials are saved
- Device list with real-time status and priority
- Device details: power toggle, schedule, and priority controls
- Add/remove devices easily
- Logout and switch authentication modes anytime

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Configure Firebase in `services/firebase.js` (for cloud mode).
3. Run the app:
   ```
   npx react-native run-android
   # or
   npx react-native run-ios
   ```

## Directory Structure
- `screens/` - Main screens (Home, Device, Auth, Onboarding, Add Device)
- `services/` - Auth, device, and backend logic
- `components/` - UI components (GlassCard, AnimatedGradientBackground)

## Requirements
- Node.js, npm
- React Native CLI
- Android Studio or Xcode

## Usage

### 1. First Launch & Onboarding
- On first launch, you'll see an onboarding screen introducing the app's features and benefits.
- Proceed to the authentication screen to log in or sign up.

### 2. Authentication Modes
- **Local Mode (default):**
  - Credentials are stored securely on your device only (offline, private).
  - Tap "Sign Up" to create a new local account, or "Sign In" to log in with saved credentials.
  - Auto-login is enabled if you have already signed in before.
- **Firebase Mode:**
  - Tap the "Firebase" button at the top of the login card to switch modes.
  - Sign up or sign in using Firebase Auth (cloud-based, for multi-device sync).

### 3. Switching Modes
- Use the toggle at the top of the login card to switch between Local and Firebase authentication at any time.
- Your login session is specific to the selected mode.

### 4. Home & Device Management
- After signing in, you'll see your devices on the Home screen.
- Add, remove, or prioritize devices as needed.
- Tap a device for details, scheduling, and power control.

### 5. Logout
- Tap the "Logout" button at the top right of the Home screen to securely log out and return to the authentication screen.

---

## Why use this app?
- Reduce energy waste and device damage during load shedding
- Prioritize critical equipment (e.g., medical, refrigeration)
- Seamlessly manage all your smart plugs from one place
- Enjoy a modern, eye-catching mobile experience

See the main project README for more details on backend and firmware.
