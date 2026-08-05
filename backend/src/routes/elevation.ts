import { Router } from 'express';
import { getElevationProfileForPolyline } from '../services/elevationApi';
import { getLiveTrainStatus } from '../services/railwayApi';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

router.get('/:number', cacheMiddleware(86400), async (req, res, next) => {
  try {
    const { number } = req.params;

    // Get real train data (with real polyline from RailRadar API)
    const train = await getLiveTrainStatus(number);
    const polyline = train.route.polyline;
    const totalDist = train.route.totalDistance;

    // Only compute elevation if we have a real polyline
    if (!polyline || polyline.length < 2) {
      res.status(204).json({
        success: false,
        message: 'Route geometry not available for this train',
      });
      return;
    }

    const elevationData = await getElevationProfileForPolyline(polyline, totalDist);
    res.json({
      success: true,
      data: elevationData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
