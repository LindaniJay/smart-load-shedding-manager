# ESP32 Smart Plug Firmware

This firmware controls the relay and communicates with the backend (Firebase) for automation and remote control.

## Features
- WiFi setup (via mobile app or serial)
- Relay on/off control
- Periodic status updates to backend
- Receives commands from backend

## Getting Started
1. Install Arduino IDE or PlatformIO.
2. Connect ESP32 to your PC via USB.
3. Flash firmware (source in this folder).
4. Configure WiFi credentials (see `/app`).

## Dependencies
- ESPAsyncWiFiManager
- Firebase Arduino Client (or HTTPClient for REST)

## Wiring
- Relay IN pin -> ESP32 GPIO (e.g., GPIO 5)
- Relay VCC/GND -> ESP32 3.3V/GND

More details and code samples coming soon.
