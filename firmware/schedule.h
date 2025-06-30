// Schedule logic for ESP32 smart plug
#ifndef SCHEDULE_H
#define SCHEDULE_H
#include <Arduino.h>

struct DeviceSchedule {
  String onTime;  // "HH:MM"
  String offTime; // "HH:MM"
};

bool isWithinSchedule(const DeviceSchedule& schedule, const String& currentTime) {
  // Simple comparison, assumes times are in "HH:MM" 24h format
  if (schedule.onTime.length() == 5 && schedule.offTime.length() == 5) {
    return (currentTime >= schedule.onTime && currentTime < schedule.offTime);
  }
  return false;
}

#endif // SCHEDULE_H
