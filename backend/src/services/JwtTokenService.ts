import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors/appError.ts";
import type { AuthUser } from "../types/index.ts";
import type { ITokenService } from "./interfaces/ITokenService.ts";

export class JwtTokenService implements ITokenService {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  // Genera el token con los datos del usuario
  sign(payload: AuthUser): string {
    return jwt.sign(payload, this.secret, { expiresIn: "1h" });
  }

  // Valida el token y devuelve los datos que contiene
  verify(token: string): AuthUser {
    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(token, this.secret);
    } catch {
      throw new AppError("Token inválido o expirado", 401);
    }

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "number" ||
      typeof decoded.role !== "string" ||
      !Array.isArray(decoded.permissions)
    ) {
      throw new AppError("Token inválido", 401);
    }
    return {
      userId: decoded.userId,
      role: decoded.role,
      permissions: decoded.permissions as string[],
    };
  }
}
