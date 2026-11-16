import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UnauthorizedError } from '../errors/AppError';
import { AuthService } from '../services/AuthService';

/** Lee el header "Authorization: Bearer <token>" y carga req.user. */
export function createAuthenticate(authService: AuthService): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedError('Falta el token');

    const user = await authService.getUserFromToken(header.slice('Bearer '.length));
    if (!user) throw new UnauthorizedError('Token inválido o expirado');

    req.user = user;
    next();
  };
}
