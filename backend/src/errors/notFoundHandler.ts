import type { RequestHandler, Request, Response, NextFunction } from "express";
import { AppError } from "./appError.ts";

export const notFoundError: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(
    new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404),
  );
};
