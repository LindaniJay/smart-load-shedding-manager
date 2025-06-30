# Hardware Sourcing & Setup

## Components for Each Smart Plug
- ESP32 Dev Board (WiFi)
- Relay module (10A or higher)
- Power monitoring sensor (optional for MVP)
- Buck converter (for safe ESP32 power)
- Plug enclosure (safety first)
- Wires, connectors

## Recommended Suppliers
- PiShop, RS South Africa, AliExpress

## Estimated Cost
- R150-R200 per plug (bulk discounts possible)

## Assembly Overview
1. Connect ESP32 to relay (GPIO control).
2. (Optional) Connect power sensor to ESP32.
3. Use buck converter to power ESP32 from mains.
4. Mount all components in enclosure.
5. Flash firmware (see `/firmware`).

## Safety Note
- Ensure all wiring is insulated and secure.
- Use certified enclosures for mains safety.
