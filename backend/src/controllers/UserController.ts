import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { parseId, requireString } from './validation';

export class UserController {
  constructor(private readonly userService: UserService) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.userService.listUsers());
  };

  listRoles = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.userService.listRoles());
  };

  assignRole = async (req: Request, res: Response): Promise<void> => {
    const userId = parseId(req.params.id);
    const role = requireString(req.body, 'role', 40);
    res.json(await this.userService.assignRole(userId, role));
  };
}
