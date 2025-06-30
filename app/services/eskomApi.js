// Service to fetch loadshedding schedule from EskomSePush API
// Requires a valid API token from https://developer.sepush.co.za/

const API_BASE = 'https://developer.sepush.co.za/business/2.0';
const API_TOKEN = 'YOUR_API_TOKEN_HERE'; // <-- Replace with your own token or load from env/secure storage

async function sepushFetch(endpoint, params = {}) {
  const url = `${API_BASE}${endpoint}` + (Object.keys(params).length ? `?${new URLSearchParams(params)}` : '');
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_TOKEN,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch from EskomSePush API');
  return res.json();
}

// Search for area by name
export async function searchArea(areaName) {
  const data = await sepushFetch('/areas_search', { text: areaName });
  // Returns { areas: [ { id, name, ... } ] }
  return data.areas && data.areas.length > 0 ? data.areas[0] : null;
}

// Fetch schedule for area ID
export async function fetchLoadsheddingSchedule(areaName) {
  // First, search for the area to get its ID
  const area = await searchArea(areaName);
  if (!area) throw new Error('Area not found');
  // Then, fetch the schedule
  const scheduleData = await sepushFetch('/area', { id: area.id });
  // Parse and return a simplified structure for the UI
  return {
    area: area.name,
    stages: scheduleData.events.map(ev => ({
      stage: ev.note.match(/Stage (\d+)/) ? RegExp.$1 : 'N/A',
      times: [ev.start, ev.end],
      note: ev.note,
    })),
  };
}
