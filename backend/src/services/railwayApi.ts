import axios from 'axios';
import { getMockLiveTrainStatus, MOCK_TRAINS } from './mockData';

const RAILRADAR_BASE = 'https://railradar.in/api/v1';
const DEFAULT_API_KEY = 'rg_69c8c9e97d254c91b2b64ab2554469c6';

const rrClient = axios.create({
  baseURL: RAILRADAR_BASE,
  timeout: 8000,
});

rrClient.interceptors.request.use((config) => {
  const apiKey = process.env.RAILRADAAR_API_KEY || DEFAULT_API_KEY;
  config.headers.Authorization = `Bearer ${apiKey}`;
  return config;
});

// Cache the lookup map so we don't hammer the API on every search
let trainLookupCache: Record<string, string> | null = null;
let cacheExpiresAt = 0;
const LOOKUP_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

async function getTrainLookupMap(): Promise<Record<string, string>> {
  const now = Date.now();
  if (trainLookupCache && now < cacheExpiresAt) return trainLookupCache;

  try {
    const res = await rrClient.get('/lookup/trains');
    if (res.data?.success && res.data?.data) {
      trainLookupCache = res.data.data as Record<string, string>;
      cacheExpiresAt = now + LOOKUP_TTL_MS;
      return trainLookupCache;
    }
  } catch (err) {
    console.warn('[RailRadar] Lookup trains failed:', (err as Error).message);
  }
  return {};
}

/**
 * Helper to extract HH:MM or clean time string from ISO or time format
 */
function extractTime(timeStr?: string | null): string | null {
  if (!timeStr) return null;
  if (timeStr.includes('T')) {
    const match = timeStr.match(/T(\d{2}:\d{2})/);
    return match ? match[1] : timeStr;
  }
  return timeStr;
}

/**
 * Searches for trains by number or name using RailRadar lookup map.
 * Falls back to local MOCK_TRAINS if lookup is unavailable.
 */
export async function searchTrainsInDatabase(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Try real RailRadar API via lookup map
  if (process.env.USE_REAL_API !== 'false') {
    try {
      const lookupMap = await getTrainLookupMap();
      const entries = Object.entries(lookupMap);

      if (entries.length > 0) {
        const matches = entries.filter(
          ([number, name]) =>
            number.toLowerCase().includes(q) ||
            name.toLowerCase().includes(q)
        );

        return matches.slice(0, 15).map(([number, name]) => ({
          number,
          name,
          origin: '',
          destination: '',
          departureTime: '',
          arrivalTime: '',
          runsOn: [],
        }));
      }
    } catch (err) {
      console.warn('[RailRadar] Search failed:', (err as Error).message);
    }
  }

  // Fallback to local mock data
  const matches = Object.values(MOCK_TRAINS).filter(
    (train) =>
      train.number.includes(q) ||
      train.name.toLowerCase().includes(q) ||
      train.origin.toLowerCase().includes(q) ||
      train.destination.toLowerCase().includes(q)
  );

  return matches.map((t) => ({
    number: t.number,
    name: t.name,
    origin: t.origin,
    destination: t.destination,
    departureTime: t.departureTime,
    arrivalTime: t.arrivalTime,
    runsOn: t.runsOn,
  }));
}

/**
 * Maps the RailRadar live status response into the LiveTrainData shape
 * that the frontend expects.
 */
function mapRailRadarLiveToInternalFormat(apiData: any) {
  const d = apiData;
  const currSeq = d.currentLocation?.sequence ?? 1;

  // Build station list from route array
  const stations: any[] = (d.route || []).map((stop: any) => {
    let status: 'passed' | 'current' | 'upcoming' = 'upcoming';
    if (stop.status === 'departed' || stop.sequence < currSeq) {
      status = 'passed';
    } else if (stop.status === 'arrived' || stop.sequence === currSeq || stop.stationCode === d.currentLocation?.stationCode) {
      status = 'current';
    }

    const schedDep = extractTime(stop.scheduledDeparture) || extractTime(stop.departure);
    const schedArr = extractTime(stop.scheduledArrival) || extractTime(stop.arrival);
    const actDep = extractTime(stop.actualDeparture);
    const actArr = extractTime(stop.actualArrival);

    return {
      code: stop.stationCode,
      name: stop.stationName,
      lat: stop.lat ?? 0,
      lng: stop.lng ?? 0,
      scheduledArrival: schedArr,
      scheduledDeparture: schedDep,
      actualArrival: actArr,
      actualDeparture: actDep,
      delayMinutes: stop.delayDeparture ?? stop.delayArrival ?? 0,
      distanceFromOrigin: stop.distance ?? 0,
      status,
      platform: stop.platform ?? undefined,
      isHalt: stop.isHalt ?? true,
    };
  });

  const haltingStations = stations.filter((s) => s.isHalt !== false);
  const firstStation = haltingStations[0] || stations[0];
  const lastStation = haltingStations[haltingStations.length - 1] || stations[stations.length - 1];

  // Find current & next halt stations
  const prevHaltCode = d.previousHalt?.stationCode;
  const nextHaltCode = d.nextHalt?.stationCode;

  const currentStation =
    stations.find((s) => s.code === d.currentLocation?.stationCode) ||
    stations.find((s) => s.code === prevHaltCode) ||
    stations.find((s) => s.status === 'current') ||
    firstStation;

  const nextStation =
    stations.find((s) => s.code === nextHaltCode) ||
    stations.find((s) => s.status === 'upcoming' && s.isHalt !== false) ||
    lastStation;

  // Calculate position coordinates
  const prevHaltStation = stations.find((s) => s.code === prevHaltCode) || currentStation;
  const nextHaltStation = stations.find((s) => s.code === nextHaltCode) || nextStation;

  const progress = d.currentLocation?.segmentProgress ?? 0.5;
  const posLat = d.currentLocation?.lat ?? (prevHaltStation.lat + (nextHaltStation.lat - prevHaltStation.lat) * progress);
  const posLng = d.currentLocation?.lng ?? (prevHaltStation.lng + (nextHaltStation.lng - prevHaltStation.lng) * progress);

  // Compute journey completion from station distances
  const totalDist = lastStation?.distanceFromOrigin || 1;
  const currentDist = currentStation?.distanceFromOrigin ?? Math.round(totalDist * progress);
  const completionPercent = Math.min(100, Math.max(0, Math.round((currentDist / totalDist) * 100)));

  const trainInfo = d.train || {};
  const delayMinutes = d.delayMinutes ?? 0;
  const status =
    d.status === 'cancelled'
      ? 'NOT STARTED'
      : d.status === 'completed'
      ? 'ARRIVED'
      : d.status === 'not-started'
      ? 'NOT STARTED'
      : delayMinutes > 0
      ? 'DELAYED'
      : 'ON TIME';

  return {
    trainNumber: d.trainNumber,
    trainName: d.trainName,
    status,
    currentStation,
    nextStation,
    origin: firstStation,
    destination: lastStation,
    delayMinutes,
    etaToDestination: lastStation?.scheduledArrival || lastStation?.scheduledDeparture || '',
    journeyCompletionPercent: completionPercent,
    distanceCoveredKm: currentDist,
    remainingDistanceKm: Math.max(0, totalDist - currentDist),
    currentSpeedKmH: d.currentLocation?.speedKmh ?? trainInfo.avgSpeed ?? 60,
    position: {
      lat: posLat,
      lng: posLng,
      speed: d.currentLocation?.speedKmh ?? 60,
      bearing: d.currentLocation?.bearingDegrees ?? 0,
      lastUpdated: d.lastUpdatedAt ?? new Date().toISOString(),
    },
    route: {
      trainNumber: d.trainNumber,
      trainName: d.trainName,
      origin: firstStation?.name || trainInfo.source?.name || '',
      destination: lastStation?.name || trainInfo.destination?.name || '',
      totalDistance: totalDist,
      stations,
      polyline: stations
        .filter((s) => s.lat && s.lng)
        .map((s) => [s.lng, s.lat] as [number, number]),
    },
    lastUpdated: d.lastUpdatedAt ?? new Date().toISOString(),
    runDays: trainInfo.runDays ?? [],
    trainType: trainInfo.type ?? '',
    trainCategory: trainInfo.category ?? '',
  };
}

/**
 * Gets live train status for any Indian train.
 */
export async function getLiveTrainStatus(trainNumber: string) {
  if (process.env.USE_REAL_API !== 'false') {
    try {
      const res = await rrClient.get(`/trains/${trainNumber}/live`, {
        params: {
          includeCoordinates: true,
          geometry: false,
          haltsOnly: false,
        },
      });

      if (res.data?.success && res.data?.data) {
        const mapped = mapRailRadarLiveToInternalFormat(res.data.data);
        console.log(`[RailRadar] ✅ Live status for #${trainNumber}: ${mapped.trainName}`);
        return mapped;
      }
    } catch (err: any) {
      const status = err?.response?.status;
      console.warn(`[RailRadar] Live status #${trainNumber} failed (HTTP ${status}):`, err.message);
    }
  }

  // Fallback to mock or generate generic
  return getMockLiveTrainStatus(trainNumber);
}

/**
 * Fetches train details (static schedule) for any train number.
 */
export async function getTrainDetails(trainNumber: string) {
  if (process.env.USE_REAL_API !== 'false') {
    try {
      const res = await rrClient.get(`/trains/${trainNumber}`, {
        params: { haltsOnly: false },
      });

      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (err: any) {
      console.warn(`[RailRadar] Train details #${trainNumber} failed:`, err.message);
    }
  }
  return null;
}
