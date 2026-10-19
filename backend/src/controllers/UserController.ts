import { Request, Response, NextFunction } from "express";

// controlador de usuarios (listar y asignar rol)
export class UserController {
  // listar todos los usuarios
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: llamar al UserService.listUsers cuando este implementado
      return res.status(200).json({ message: "Lista de usuarios" });
    } catch (error) {
      next(error);
    }
  }

  // asignar un rol a un usuario
  async assignRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { roleName } = req.body;

      // validaciones de entrada
      if (!id) {
        return res.status(400).json({ message: "Falta el id del usuario" });
      }
      if (!roleName) {
        return res.status(400).json({ message: "Falta el campo roleName" });
      }

      // TODO: llamar al UserService.assignRole cuando este implementado
      return res.status(200).json({ message: "Rol asignado exitosamente" });
    } catch (error) {
      next(error);
    }
  }
}
