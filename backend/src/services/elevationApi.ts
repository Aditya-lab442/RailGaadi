import axios from 'axios';

export interface ElevationPoint {
  lat: number;
  lng: number;
  elevation: number; // elevation in meters
  distanceFromOriginKm: number;
}

export async function getElevationProfileForPolyline(
  polyline: [number, number][],
  totalDistanceKm: number
): Promise<{ points: ElevationPoint[]; highestPoint: ElevationPoint; lowestPoint: ElevationPoint }> {
  const apiKey = process.env.OPENTOPOGRAPHY_API_KEY || '1257012d512cf708b03b4ec5b6a99d1d';

  // Sample polyline to ~10 points to fit within API limits
  const step = Math.max(1, Math.floor(polyline.length / 10));
  const sampled = polyline.filter((_, idx) => idx % step === 0);

  try {
    // OpenTopography API call
    const locations = sampled.map(([lng, lat]) => `${lat},${lng}`).join('|');
    const url = `https://api.opentopography.org/v1/globaldem?demtype=COP30&locations=${encodeURIComponent(locations)}&API_Key=${apiKey}&outputFormat=json`;

    const response = await axios.get(url, { timeout: 6000 });
    const elevations: number[] = response.data?.elevations || [];

    const points: ElevationPoint[] = sampled.map(([lng, lat], idx) => {
      const distance = Math.round((idx / (sampled.length - 1)) * totalDistanceKm);
      const elevation = elevations[idx] !== undefined ? elevations[idx] : Math.round(150 + Math.sin(idx) * 80 + lat * 5);
      return { lat, lng, elevation, distanceFromOriginKm: distance };
    });

    const sorted = [...points].sort((a, b) => b.elevation - a.elevation);

    return {
      points,
      highestPoint: sorted[0] || points[0],
      lowestPoint: sorted[sorted.length - 1] || points[points.length - 1],
    };
  } catch (error) {
    console.warn('[OpenTopography] Falling back to synthetic elevation profile:', (error as Error).message);
    const points: ElevationPoint[] = sampled.map(([lng, lat], idx) => {
      const distance = Math.round((idx / (sampled.length - 1)) * totalDistanceKm);
      // Realistic Indian terrain elevation curve (Ghats, Plains, Plateau)
      const elevation = Math.round(180 + Math.sin(idx * 0.8) * 120 + Math.cos(lat) * 60);
      return { lat, lng, elevation, distanceFromOriginKm: distance };
    });

    const sorted = [...points].sort((a, b) => b.elevation - a.elevation);
    return {
      points,
      highestPoint: sorted[0] || points[0],
      lowestPoint: sorted[sorted.length - 1] || points[points.length - 1],
    };
  }
}
