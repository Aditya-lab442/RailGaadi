import { Router } from 'express';
import { searchTrainsInDatabase } from '../services/railwayApi';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

router.get('/', cacheMiddleware(300), async (req, res, next) => {
  try {
    const query = (req.query.q as string) || '';
    const results = await searchTrainsInDatabase(query);
    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
