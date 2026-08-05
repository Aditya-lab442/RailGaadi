import axios from 'axios';

export async function getWeatherForLocation(lat: number, lng: number, stationCode: string, stationName: string) {
  const apiKey = process.env.OPENWEATHER_API_KEY || 'e463da0a2f83f9bba760c90573974dbf';

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;

    const tempC = Math.round(data.main?.temp ?? 28);
    const humidityPercent = data.main?.humidity ?? 60;
    const windSpeedKmH = Math.round((data.wind?.speed ?? 3.5) * 3.6); // m/s to km/h
    const mainCondition = data.weather?.[0]?.main || 'Clear';

    // Map main condition to standard strings
    let condition: 'Sunny' | 'Clear' | 'Partly Cloudy' | 'Cloudy' | 'Rain' | 'Thunderstorm' | 'Fog' | 'Haze' = 'Clear';
    if (mainCondition === 'Clear') condition = 'Sunny';
    else if (mainCondition === 'Clouds') condition = 'Cloudy';
    else if (mainCondition === 'Rain' || mainCondition === 'Drizzle') condition = 'Rain';
    else if (mainCondition === 'Thunderstorm') condition = 'Thunderstorm';
    else if (mainCondition === 'Mist' || mainCondition === 'Fog') condition = 'Fog';
    else if (mainCondition === 'Haze') condition = 'Haze';

    return {
      stationCode,
      stationName,
      tempC,
      condition,
      humidityPercent,
      windSpeedKmH,
      rainChancePercent: mainCondition === 'Rain' ? 85 : mainCondition === 'Clouds' ? 35 : 10,
      icon: data.weather?.[0]?.icon || '01d',
    };
  } catch (error) {
    console.warn(`[OpenWeather] Failed for ${stationCode}, falling back to deterministic weather:`, (error as Error).message);
    const tempC = Math.round(26 + (lat % 6));
    return {
      stationCode,
      stationName,
      tempC,
      condition: 'Sunny' as const,
      humidityPercent: 58,
      windSpeedKmH: 14,
      rainChancePercent: 10,
      icon: '01d',
    };
  }
}
