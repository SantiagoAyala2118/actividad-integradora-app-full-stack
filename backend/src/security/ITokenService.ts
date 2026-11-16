export interface TokenPayload {
  userId: number;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
  /** Devuelve el payload o null si el token es inválido o expiró. */
  verify(token: string): TokenPayload | null;
}
