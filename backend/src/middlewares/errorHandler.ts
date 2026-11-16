import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  // JSON mal formado en el body
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ message: 'JSON inválido' });
    return;
  }
  console.error('[ERROR]', err);
  res.status(500).json({ message: 'Error interno del servidor' });
}
