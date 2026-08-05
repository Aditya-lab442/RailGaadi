export interface StationWeather {
  stationCode: string;
  stationName: string;
  tempC: number;
  condition: 'Sunny' | 'Clear' | 'Partly Cloudy' | 'Cloudy' | 'Rain' | 'Thunderstorm' | 'Fog' | 'Haze';
  humidityPercent: number;
  windSpeedKmH: number;
  rainChancePercent: number;
  icon: string;
}

export interface TrainJourneyWeather {
  currentStationWeather: StationWeather;
  nextStationWeather: StationWeather;
  destinationWeather: StationWeather;
}
