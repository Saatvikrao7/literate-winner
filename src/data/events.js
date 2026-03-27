// Current major world events — conflict zones, crises, and hotspots
// Used to drive animated arcs (projectiles) and pulsing conflict rings on the globe

export const CONFLICT_ZONES = [
  { id: 'gaza',     lat: 31.35,  lng: 34.30,  label: 'Gaza Strip',       detail: 'Active conflict',            color: '#ef4444', severity: 3 },
  { id: 'ukraine',  lat: 48.50,  lng: 31.00,  label: 'Ukraine',          detail: 'Russia-Ukraine War',         color: '#ef4444', severity: 3 },
  { id: 'iran',     lat: 32.00,  lng: 53.00,  label: 'Iran',             detail: 'Regional tensions',          color: '#f97316', severity: 2 },
  { id: 'sudan',    lat: 15.55,  lng: 32.53,  label: 'Sudan',            detail: 'Civil war',                  color: '#f97316', severity: 2 },
  { id: 'myanmar',  lat: 19.75,  lng: 96.10,  label: 'Myanmar',          detail: 'Civil conflict',             color: '#f97316', severity: 2 },
  { id: 'sahel',    lat: 14.00,  lng:  2.00,  label: 'Sahel Region',     detail: 'Insurgency & instability',   color: '#eab308', severity: 1 },
  { id: 'ethiopia', lat:  9.00,  lng: 38.70,  label: 'Ethiopia',         detail: 'Internal conflict',          color: '#eab308', severity: 1 },
  { id: 'haiti',    lat: 18.97,  lng: -72.28, label: 'Haiti',            detail: 'Gang violence & crisis',     color: '#eab308', severity: 1 },
  { id: 'drcongo',  lat: -4.32,  lng: 15.32,  label: 'DR Congo',         detail: 'M23 insurgency',             color: '#f97316', severity: 2 },
  { id: 'somalia',  lat:  2.04,  lng: 45.34,  label: 'Somalia',          detail: 'Al-Shabaab conflict',        color: '#eab308', severity: 1 },
  { id: 'yemen',    lat: 15.55,  lng: 48.52,  label: 'Yemen',            detail: 'Houthi conflict',            color: '#f97316', severity: 2 },
  { id: 'syria',    lat: 34.80,  lng: 38.99,  label: 'Syria',            detail: 'Post-civil war instability', color: '#eab308', severity: 1 },
]

// Arcs simulate projectile trajectories between conflict parties
// Each arc has a start and end; arcDash* props create moving-dash animation
export const CONFLICT_ARCS = [
  // Iran ↔ Israel (proxy / direct strikes)
  { id: 'iran-isr-1', startLat: 35.69, startLng: 51.39, endLat: 31.77, endLng: 35.22, color: '#ef4444', speed: 1800, label: 'Iran → Israel' },
  { id: 'isr-iran-1', startLat: 31.77, startLng: 35.22, endLat: 35.69, endLng: 51.39, color: '#f97316', speed: 2200, label: 'Israel → Iran' },
  { id: 'iran-isr-2', startLat: 33.51, startLng: 36.29, endLat: 31.77, endLng: 35.22, color: '#ef4444', speed: 1600, label: 'Syria → Israel' },

  // Russia → Ukraine (missile strikes / drone attacks)
  { id: 'rus-ukr-1', startLat: 55.75, startLng: 37.62, endLat: 50.45, endLng: 30.52, color: '#dc2626', speed: 1500, label: 'Moscow → Kyiv' },
  { id: 'rus-ukr-2', startLat: 48.00, startLng: 40.00, endLat: 49.00, endLng: 28.50, color: '#dc2626', speed: 1700, label: 'Russia → W. Ukraine' },
  { id: 'ukr-rus-1', startLat: 50.45, startLng: 30.52, endLat: 55.75, endLng: 37.62, color: '#f87171', speed: 2400, label: 'Kyiv → Moscow' },

  // Houthi (Yemen) → Red Sea / Saudi Arabia
  { id: 'hth-sau-1', startLat: 15.35, startLng: 44.21, endLat: 24.69, endLng: 46.72, color: '#d97706', speed: 2000, label: 'Houthis → Riyadh' },
  { id: 'hth-sea-1', startLat: 13.97, startLng: 44.50, endLat: 15.00, endLng: 50.00, color: '#d97706', speed: 1900, label: 'Houthis → Red Sea' },

  // Gaza ↔ Israel
  { id: 'isr-gaz-1', startLat: 31.77, startLng: 35.22, endLat: 31.35, endLng: 34.30, color: '#ef4444', speed: 1000, label: 'Israel → Gaza' },
  { id: 'gaz-isr-1', startLat: 31.35, startLng: 34.30, endLat: 31.77, endLng: 35.22, color: '#f97316', speed: 1200, label: 'Gaza → Israel' },
]
