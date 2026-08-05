import { Router } from 'express';
import { getLiveTrainStatus } from '../services/railwayApi';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

router.get('/:number', cacheMiddleware(15), async (req, res, next) => {
  try {
    const { number } = req.params;
    const trainData = await getLiveTrainStatus(number);
    res.json({
      success: true,
      data: trainData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
