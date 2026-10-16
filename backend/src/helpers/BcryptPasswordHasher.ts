import bcrypt from "bcrypt";
import type { IPasswordHasher } from "./interfaces/IPasswordHasher.ts";

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds: number = Number(process.env.SALTS);

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
