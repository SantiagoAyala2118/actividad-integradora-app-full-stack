import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.ts";

export function authorize(...requiredPermissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      throw new AppError("No autenticado", 401);
    }

    const hasPermission = requiredPermissions.some((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new AppError("No tenés permiso para esta acción", 403);
    }

    next();
  };
}
