import type { AuthUser } from "../../types/index.ts";

export interface ITokenService {
  sign(payload: AuthUser): string;
  verify(token: string): AuthUser;
}
