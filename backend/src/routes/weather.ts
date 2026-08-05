import { Router } from 'express';
import { getWeatherForLocation } from '../services/weatherApi';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

// GET /api/weather?lat=&lng=&code=&name=
router.get('/', cacheMiddleware(600), async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const code = (req.query.code as string) || 'UNK';
    const name = (req.query.name as string) || 'Unknown Station';

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ success: false, message: 'lat and lng query params are required', code: 'INVALID_PARAMS' });
      return;
    }

    const weather = await getWeatherForLocation(lat, lng, code, name);
    res.json({
      success: true,
      data: weather,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
