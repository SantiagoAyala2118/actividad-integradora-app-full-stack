import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { currentUser, requireString } from './validation';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const name = requireString(req.body, 'name', 100);
    const email = requireString(req.body, 'email', 150);
    const password = requireString(req.body, 'password', 100);
    const result = await this.authService.register(name, email, password);
    res.status(201).json(result);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const email = requireString(req.body, 'email', 150);
    const password = requireString(req.body, 'password', 100);
    res.json(await this.authService.login(email, password));
  };

  me = async (req: Request, res: Response): Promise<void> => {
    res.json(currentUser(req));
  };
}
