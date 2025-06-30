// Smart Load Shedding Plug - ESP32 Firmware (MVP)
#include <WiFi.h>
#include <HTTPClient.h>

#define RELAY_PIN 5
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Replace with your Firebase Realtime Database URL
const char* firebase_host = "YOUR_FIREBASE_DB_URL";

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Default: OFF

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
}

#include "schedule.h"
#include <NTPClient.h>
#include <WiFiUdp.h>

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 3600, 60000); // Adjust timezone as needed

DeviceSchedule deviceSchedule = {"00:00", "23:59"}; // Default: always on

void updateStatusToBackend(const char* status) {
  HTTPClient http;
  String url = String(firebase_host) + "/devices/device1/status.json";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.PUT(String("\"" + String(status) + "\""));
  http.end();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(firebase_host) + "/devices/device1.json";
    http.begin(url);
    int httpCode = http.GET();
    if (httpCode == 200) {
      String payload = http.getString();
      // Parse schedule (simple manual parse for MVP)
      int schedIdx = payload.indexOf("schedule");
      if (schedIdx > 0) {
        int onIdx = payload.indexOf("on", schedIdx);
        int offIdx = payload.indexOf("off", schedIdx);
        if (onIdx > 0 && offIdx > 0) {
          deviceSchedule.onTime = payload.substring(onIdx+5, onIdx+10);
          deviceSchedule.offTime = payload.substring(offIdx+6, offIdx+11);
        }
      }
      timeClient.update();
      String now = timeClient.getFormattedTime().substring(0,5); // "HH:MM"
      if (isWithinSchedule(deviceSchedule, now) && payload.indexOf("\"state\":\"on\"") > 0) {
        digitalWrite(RELAY_PIN, HIGH); // Turn ON
        updateStatusToBackend("on");
      } else {
        digitalWrite(RELAY_PIN, LOW); // Turn OFF
        updateStatusToBackend("off");
      }
      // Device removal: if payload == null or "{}", turn off and halt
      if (payload == "null" || payload == "{}") {
        digitalWrite(RELAY_PIN, LOW);
        updateStatusToBackend("removed");
        while(1) delay(10000);
      }
    }
    http.end();
  }
  delay(3000); // Poll every 3 seconds
}
