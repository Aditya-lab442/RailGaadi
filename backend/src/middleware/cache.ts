import NodeCache from 'node-cache';
import { Request, Response, NextFunction } from 'express';

const apiCache = new NodeCache({ stdTTL: 30, checkperiod: 60 });

export const cacheMiddleware = (ttlSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = apiCache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      apiCache.set(key, body, ttlSeconds);
      return originalJson(body);
    };

    next();
  };
};
