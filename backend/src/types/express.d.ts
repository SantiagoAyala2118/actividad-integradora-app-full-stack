import type { UserDTO } from './domain';

declare global {
  namespace Express {
    interface Request {
      user?: UserDTO;
    }
  }
}

export {};
