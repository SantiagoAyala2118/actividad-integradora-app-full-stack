import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { AppError } from "./appError.ts";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message,
    });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({
      ok: false,
      message: "Cuerpo de la peticion invalido",
    });
  }

  console.error(err);
  return res
    .status(500)
    .json({ ok: false, message: "Error interno del servidor" });
};
