import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from './ITokenService';

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresInSeconds: number,
  ) {}

  sign(payload: TokenPayload): string {
    return jwt.sign({ sub: String(payload.userId) }, this.secret, { expiresIn: this.expiresInSeconds });
  }

  verify(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (typeof decoded === 'string' || decoded.sub === undefined) return null;
      const userId = Number(decoded.sub);
      return Number.isInteger(userId) ? { userId } : null;
    } catch {
      return null;
    }
  }
}
