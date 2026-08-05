import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error('API Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
  });
}
