import type { Request, Response, NextFunction } from "express";
import type { ITokenService } from "../services/interfaces/ITokenService.ts";
import { AppError } from "../errors/appError.ts";

export const authenticate = (tokenService: ITokenService) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Token no provisto", 401);
    }

    const token = header.slice(7);
    req.user = tokenService.verify(token);

    next();
  };
};
