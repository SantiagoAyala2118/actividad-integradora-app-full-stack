import { Request, Response, NextFunction } from "express";

// controlador de autenticacion (registro y login)
export class AuthController {
  // registrar un usuario nuevo
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      // validaciones de entrada
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Faltan campos obligatorios: name, email, password" });
      }
      if (!email.includes("@")) {
        return res.status(400).json({ message: "El email no es valido" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
      }

      // TODO: llamar al AuthService.register cuando este implementado
      return res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
      next(error);
    }
  }

  // iniciar sesion
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // validaciones de entrada
      if (!email || !password) {
        return res.status(400).json({ message: "Faltan campos obligatorios: email, password" });
      }

      // TODO: llamar al AuthService.login cuando este implementado
      return res.status(200).json({ message: "Login exitoso" });
    } catch (error) {
      next(error);
    }
  }
}
