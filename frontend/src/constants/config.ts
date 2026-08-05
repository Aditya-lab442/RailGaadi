export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const maptilerKey = import.meta.env.VITE_MAPTILER_KEY || 'ouzJWLHdwWdd0m4Tic4A';

export const MAP_CONFIG = {
  style: maptilerKey
    ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerKey}`
    : 'https://tiles.openfreemap.org/styles/bright',
  maptilerKey,
  defaultCenter: [78.9629, 20.5937] as [number, number],
  defaultZoom: 5.5,
  focusedZoom: 10,
  pitch: 35,
  bearing: 0,
};

export const REFRESH_INTERVAL_MS = 15000;
export const DEBOUNCE_DELAY_MS = 300;
