export interface Station {
  code: string;
  name: string;
  lat: number;
  lng: number;
  scheduledArrival?: string | null;
  scheduledDeparture?: string | null;
  actualArrival?: string | null;
  actualDeparture?: string | null;
  delayMinutes: number;
  distanceFromOrigin: number; // in km
  status: 'passed' | 'current' | 'upcoming';
  platform?: string;
  elevation?: number; // in meters
  isHalt?: boolean;
}

export interface LiveTrainPosition {
  lat: number;
  lng: number;
  speed: number; // in km/h
  bearing: number; // in degrees
  lastUpdated: string; // ISO string
}

export interface TrainRoute {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  totalDistance: number; // in km
  stations: Station[];
  polyline: [number, number][]; // Array of [lng, lat]
}

export interface LiveTrainData {
  trainNumber: string;
  trainName: string;
  status: 'RUNNING' | 'ON TIME' | 'DELAYED' | 'ARRIVED' | 'NOT STARTED';
  currentStation: Station;
  nextStation: Station;
  origin: Station;
  destination: Station;
  delayMinutes: number;
  etaToDestination: string; // e.g. "18:45"
  journeyCompletionPercent: number; // 0 - 100
  distanceCoveredKm: number;
  remainingDistanceKm: number;
  currentSpeedKmH: number;
  position: LiveTrainPosition;
  route: TrainRoute;
  lastUpdated: string;
}

export interface TrainSearchResult {
  number: string;
  name: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  runsOn: string[]; // ['Mon', 'Tue', ...]
}
