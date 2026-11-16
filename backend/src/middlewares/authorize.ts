import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';

export type Authorize = (permission: string) => RequestHandler;

/** Responde 403 si el usuario autenticado no tiene el permiso indicado (ej. "ticket:create"). */
export const authorize: Authorize = (permission) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    if (!req.user.permissions.includes(permission)) {
      throw new ForbiddenError(`Se requiere el permiso "${permission}"`);
    }
    next();
  };
};
