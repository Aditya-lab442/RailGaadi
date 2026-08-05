import { calculateDistanceKm, calculateBearing, interpolateCoordinate } from '../utils/geoUtils';

export interface StationData {
  code: string;
  name: string;
  lat: number;
  lng: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  distanceFromOrigin: number;
  platform?: string;
  elevation?: number;
}

export interface MockTrain {
  number: string;
  name: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  runsOn: string[];
  stations: StationData[];
  polyline: [number, number][]; // [lng, lat]
  averageSpeedKmH: number;
}

export const MOCK_TRAINS: Record<string, MockTrain> = {
  '22436': {
    number: '22436',
    name: 'Vande Bharat Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Varanasi Jn (BSB)',
    departureTime: '06:00',
    arrivalTime: '14:00',
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    averageSpeedKmH: 95,
    stations: [
      { code: 'NDLS', name: 'New Delhi', lat: 28.6430, lng: 77.2197, scheduledArrival: '06:00', scheduledDeparture: '06:00', distanceFromOrigin: 0, platform: '16', elevation: 216 },
      { code: 'CNB', name: 'Kanpur Central', lat: 26.4547, lng: 80.3503, scheduledArrival: '10:08', scheduledDeparture: '10:12', distanceFromOrigin: 440, platform: '5', elevation: 126 },
      { code: 'PRYJ', name: 'Prayagraj Jn', lat: 25.4435, lng: 81.8267, scheduledArrival: '12:08', scheduledDeparture: '12:10', distanceFromOrigin: 635, platform: '6', elevation: 98 },
      { code: 'BSB', name: 'Varanasi Jn', lat: 25.3268, lng: 82.9863, scheduledArrival: '14:00', scheduledDeparture: '14:00', distanceFromOrigin: 759, platform: '1', elevation: 81 }
    ],
    polyline: [
      [77.2197, 28.6430],
      [77.6540, 28.4500],
      [78.5000, 27.8000],
      [79.4000, 27.1000],
      [80.3503, 26.4547],
      [81.1000, 25.9000],
      [81.8267, 25.4435],
      [82.4000, 25.3800],
      [82.9863, 25.3268]
    ]
  },
  '12952': {
    number: '12952',
    name: 'Mumbai Rajdhani Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Mumbai Central (MMCT)',
    departureTime: '16:55',
    arrivalTime: '08:35',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    averageSpeedKmH: 90,
    stations: [
      { code: 'NDLS', name: 'New Delhi', lat: 28.6430, lng: 77.2197, scheduledArrival: '16:55', scheduledDeparture: '16:55', distanceFromOrigin: 0, platform: '3', elevation: 216 },
      { code: 'MTJ', name: 'Mathura Jn', lat: 27.4924, lng: 77.6737, scheduledArrival: '18:38', scheduledDeparture: '18:40', distanceFromOrigin: 141, platform: '2', elevation: 177 },
      { code: 'KOTA', name: 'Kota Jn', lat: 25.2138, lng: 75.8648, scheduledArrival: '21:35', scheduledDeparture: '21:45', distanceFromOrigin: 465, platform: '1', elevation: 256 },
      { code: 'RTM', name: 'Ratlam Jn', lat: 23.3344, lng: 75.0367, scheduledArrival: '00:35', scheduledDeparture: '00:38', distanceFromOrigin: 732, platform: '4', elevation: 494 },
      { code: 'BRC', name: 'Vadodara Jn', lat: 22.3107, lng: 73.1812, scheduledArrival: '03:48', scheduledDeparture: '03:56', distanceFromOrigin: 993, platform: '1', elevation: 37 },
      { code: 'ST', name: 'Surat', lat: 21.2049, lng: 72.8406, scheduledArrival: '05:13', scheduledDeparture: '05:18', distanceFromOrigin: 1123, platform: '2', elevation: 21 },
      { code: 'MMCT', name: 'Mumbai Central', lat: 18.9696, lng: 72.8193, scheduledArrival: '08:35', scheduledDeparture: '08:35', distanceFromOrigin: 1386, platform: '1', elevation: 7 }
    ],
    polyline: [
      [77.2197, 28.6430],
      [77.6737, 27.4924],
      [76.8000, 26.3000],
      [75.8648, 25.2138],
      [75.4000, 24.2000],
      [75.0367, 23.3344],
      [74.1000, 22.8000],
      [73.1812, 22.3107],
      [72.8406, 21.2049],
      [72.8200, 20.0000],
      [72.8193, 18.9696]
    ]
  },
  '12002': {
    number: '12002',
    name: 'Shatabdi Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Rani Kamalapati (RKMP)',
    departureTime: '06:00',
    arrivalTime: '14:40',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    averageSpeedKmH: 86,
    stations: [
      { code: 'NDLS', name: 'New Delhi', lat: 28.6430, lng: 77.2197, scheduledArrival: '06:00', scheduledDeparture: '06:00', distanceFromOrigin: 0, platform: '1', elevation: 216 },
      { code: 'AGC', name: 'Agra Cantt', lat: 27.1577, lng: 77.9908, scheduledArrival: '07:50', scheduledDeparture: '07:55', distanceFromOrigin: 195, platform: '1', elevation: 169 },
      { code: 'GWL', name: 'Gwalior Jn', lat: 26.2163, lng: 78.1884, scheduledArrival: '09:23', scheduledDeparture: '09:28', distanceFromOrigin: 313, platform: '1', elevation: 212 },
      { code: 'VGLJ', name: 'VGL Jhansi Jn', lat: 25.4484, lng: 78.5562, scheduledArrival: '10:45', scheduledDeparture: '10:50', distanceFromOrigin: 410, platform: '2', elevation: 258 },
      { code: 'BPL', name: 'Bhopal Jn', lat: 23.2660, lng: 77.4126, scheduledArrival: '14:12', scheduledDeparture: '14:15', distanceFromOrigin: 701, platform: '1', elevation: 505 },
      { code: 'RKMP', name: 'Rani Kamalapati', lat: 23.2185, lng: 77.4394, scheduledArrival: '14:40', scheduledDeparture: '14:40', distanceFromOrigin: 707, platform: '5', elevation: 510 }
    ],
    polyline: [
      [77.2197, 28.6430],
      [77.9908, 27.1577],
      [78.1884, 26.2163],
      [78.5562, 25.4484],
      [78.3000, 24.3000],
      [77.4126, 23.2660],
      [77.4394, 23.2185]
    ]
  },
  '12302': {
    number: '12302',
    name: 'Howrah Rajdhani Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Howrah Jn (HWH)',
    departureTime: '16:50',
    arrivalTime: '09:55',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    averageSpeedKmH: 88,
    stations: [
      { code: 'NDLS', name: 'New Delhi', lat: 28.6430, lng: 77.2197, scheduledArrival: '16:50', scheduledDeparture: '16:50', distanceFromOrigin: 0, platform: '9', elevation: 216 },
      { code: 'CNB', name: 'Kanpur Central', lat: 26.4547, lng: 80.3503, scheduledArrival: '21:32', scheduledDeparture: '21:37', distanceFromOrigin: 440, platform: '4', elevation: 126 },
      { code: 'PRYJ', name: 'Prayagraj Jn', lat: 25.4435, lng: 81.8267, scheduledArrival: '23:43', scheduledDeparture: '23:45', distanceFromOrigin: 635, platform: '4', elevation: 98 },
      { code: 'DDU', name: 'Pt Deen Dayal Upadhyaya Jn', lat: 25.2818, lng: 83.1186, scheduledArrival: '01:37', scheduledDeparture: '01:47', distanceFromOrigin: 787, platform: '2', elevation: 89 },
      { code: 'GAYA', name: 'Gaya Jn', lat: 24.7964, lng: 84.9994, scheduledArrival: '03:55', scheduledDeparture: '03:58', distanceFromOrigin: 992, platform: '1', elevation: 113 },
      { code: 'DHN', name: 'Dhanbad Jn', lat: 23.7957, lng: 86.4304, scheduledArrival: '06:33', scheduledDeparture: '06:38', distanceFromOrigin: 1193, platform: '1', elevation: 235 },
      { code: 'HWH', name: 'Howrah Jn', lat: 22.5836, lng: 88.3426, scheduledArrival: '09:55', scheduledDeparture: '09:55', distanceFromOrigin: 1451, platform: '8', elevation: 12 }
    ],
    polyline: [
      [77.2197, 28.6430],
      [80.3503, 26.4547],
      [81.8267, 25.4435],
      [83.1186, 25.2818],
      [84.9994, 24.7964],
      [86.4304, 23.7957],
      [88.3426, 22.5836]
    ]
  },
  '20608': {
    number: '20608',
    name: 'Vande Bharat Express',
    origin: 'Mysuru Jn (MYS)',
    destination: 'Chennai Central (MAS)',
    departureTime: '06:10',
    arrivalTime: '12:30',
    runsOn: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    averageSpeedKmH: 78,
    stations: [
      { code: 'MYS', name: 'Mysuru Jn', lat: 12.3164, lng: 76.6457, scheduledArrival: '06:10', scheduledDeparture: '06:10', distanceFromOrigin: 0, platform: '1', elevation: 757 },
      { code: 'SBC', name: 'Bengaluru City', lat: 12.9781, lng: 77.5697, scheduledArrival: '07:45', scheduledDeparture: '07:50', distanceFromOrigin: 138, platform: '7', elevation: 920 },
      { code: 'KPD', name: 'Katpadi Jn', lat: 12.9698, lng: 79.1384, scheduledArrival: '10:33', scheduledDeparture: '10:35', distanceFromOrigin: 367, platform: '2', elevation: 215 },
      { code: 'MAS', name: 'Chennai Central', lat: 13.0827, lng: 80.2757, scheduledArrival: '12:30', scheduledDeparture: '12:30', distanceFromOrigin: 497, platform: '2', elevation: 7 }
    ],
    polyline: [
      [76.6457, 12.3164],
      [77.5697, 12.9781],
      [79.1384, 12.9698],
      [80.2757, 13.0827]
    ]
  }
};

/**
 * Computes dynamic live status for a train based on current mock progress
 */
export function getMockLiveTrainStatus(trainNumber: string) {
  // If train not found in mock, create a minimal generic fallback
  if (!MOCK_TRAINS[trainNumber]) {
    const now = new Date().toISOString();
    return {
      trainNumber,
      trainName: `Train ${trainNumber}`,
      status: 'NOT STARTED' as const,
      currentStation: { code: 'NDLS', name: 'New Delhi', lat: 28.6430, lng: 77.2197, scheduledArrival: '06:00', scheduledDeparture: '06:00', actualArrival: null, actualDeparture: null, delayMinutes: 0, distanceFromOrigin: 0, status: 'upcoming' as const, platform: undefined, isHalt: true },
      nextStation: { code: 'CNB', name: 'Kanpur Central', lat: 26.4547, lng: 80.3503, scheduledArrival: '10:08', scheduledDeparture: '10:12', actualArrival: null, actualDeparture: null, delayMinutes: 0, distanceFromOrigin: 440, status: 'upcoming' as const, platform: undefined, isHalt: true },
      origin: { code: 'NDLS', name: 'New Delhi', lat: 28.6430, lng: 77.2197, scheduledArrival: '06:00', scheduledDeparture: '06:00', actualArrival: null, actualDeparture: null, delayMinutes: 0, distanceFromOrigin: 0, status: 'upcoming' as const, platform: undefined, isHalt: true },
      destination: { code: 'CNB', name: 'Kanpur Central', lat: 26.4547, lng: 80.3503, scheduledArrival: '10:08', scheduledDeparture: '10:08', actualArrival: null, actualDeparture: null, delayMinutes: 0, distanceFromOrigin: 440, status: 'upcoming' as const, platform: undefined, isHalt: true },
      delayMinutes: 0,
      etaToDestination: '10:08',
      journeyCompletionPercent: 0,
      distanceCoveredKm: 0,
      remainingDistanceKm: 440,
      currentSpeedKmH: 0,
      position: { lat: 28.6430, lng: 77.2197, speed: 0, bearing: 0, lastUpdated: now },
      route: {
        trainNumber,
        trainName: `Train ${trainNumber}`,
        origin: 'Unknown Origin',
        destination: 'Unknown Destination',
        totalDistance: 440,
        stations: [],
        polyline: [],
      },
      lastUpdated: now,
      runDays: [],
      trainType: 'Express',
      trainCategory: 'Express',
    };
  }

  const train = MOCK_TRAINS[trainNumber];
  const stations = train.stations;

  // Simulate progress around station 2 (e.g. 55% completed journey)
  const currentIdx = 1;
  const currentStation = stations[currentIdx];
  const nextStation = stations[currentIdx + 1] || stations[stations.length - 1];
  const origin = stations[0];
  const destination = stations[stations.length - 1];

  const totalDist = train.stations[train.stations.length - 1].distanceFromOrigin;
  const currentDist = currentStation.distanceFromOrigin + 85; // 85 km past current station
  const completionPercent = Math.min(100, Math.round((currentDist / totalDist) * 100));

  // Interpolate current lat/lng between current and next station
  const progressBetweenStations = 0.45;
  const pos = interpolateCoordinate(
    currentStation.lat, currentStation.lng,
    nextStation.lat, nextStation.lng,
    progressBetweenStations
  );

  const bearing = calculateBearing(
    currentStation.lat, currentStation.lng,
    nextStation.lat, nextStation.lng
  );

  const delayMinutes = 12; // 12 mins delay

  // Set status for stations
  const updatedStations = stations.map((st, idx) => {
    let status: 'passed' | 'current' | 'upcoming' = 'upcoming';
    if (idx < currentIdx) status = 'passed';
    else if (idx === currentIdx) status = 'current';
    return {
      ...st,
      status,
      delayMinutes: idx <= currentIdx ? delayMinutes : 0
    };
  });

  return {
    trainNumber: train.number,
    trainName: train.name,
    status: delayMinutes > 0 ? ('DELAYED' as const) : ('ON TIME' as const),
    currentStation: { ...currentStation, status: 'current' as const, delayMinutes },
    nextStation: { ...nextStation, status: 'upcoming' as const, delayMinutes: 0 },
    origin: { ...origin, status: 'passed' as const, delayMinutes: 0 },
    destination: { ...destination, status: 'upcoming' as const, delayMinutes: 0 },
    delayMinutes,
    etaToDestination: destination.scheduledArrival,
    journeyCompletionPercent: completionPercent,
    distanceCoveredKm: currentDist,
    remainingDistanceKm: totalDist - currentDist,
    currentSpeedKmH: train.averageSpeedKmH,
    position: {
      lat: pos.lat,
      lng: pos.lng,
      speed: train.averageSpeedKmH,
      bearing,
      lastUpdated: new Date().toISOString()
    },
    route: {
      trainNumber: train.number,
      trainName: train.name,
      origin: train.origin,
      destination: train.destination,
      totalDistance: totalDist,
      stations: updatedStations,
      polyline: train.polyline
    },
    lastUpdated: new Date().toISOString()
  };
}
