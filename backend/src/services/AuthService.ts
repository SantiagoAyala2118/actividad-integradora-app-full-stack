import { AppError } from "../errors/appError.ts";
import type { IUserRepository } from "../repository/interfaces/IUserRepository.ts";
import type { IRoleRepository } from "../repository/interfaces/IRoleRepository.ts";
import type { IPasswordHasher } from "../helpers/interfaces/IPasswordHasher.ts";
import type { ITokenService } from "./interfaces/ITokenService.ts";
import type { AuthUser, PublicUser } from "../types/index.ts";
import { toPublicUser } from "./toPublicUser.ts";

export interface LoginResult {
  token: string;
  user: PublicUser;
}

export class AuthService {
  private readonly userRepository: IUserRepository;
  private readonly roleRepository: IRoleRepository;
  private readonly passwordHasher: IPasswordHasher;
  private readonly tokenService: ITokenService;

  constructor(
    userRepository: IUserRepository,
    roleRepository: IRoleRepository,
    passwordHasher: IPasswordHasher,
    tokenService: ITokenService,
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  // Registrar usuario: siempre con el rol "usuario" y la contraseña hasheada
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<PublicUser> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("El email ya está registrado", 409);
    }

    const role = await this.roleRepository.findByName("usuario");
    if (!role) {
      throw new AppError(
        "El rol 'usuario' no existe: falta ejecutar el seed",
        500,
      );
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      roleId: role.id!,
    });
    return toPublicUser(user);
  }

  // Login: devuelve un JWT con el id, el rol y los permisos del usuario
  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(email);
    const passwordIsValid = user
      ? await this.passwordHasher.compare(password, user.password)
      : false;
    if (!user || !passwordIsValid) {
      throw new AppError("Credenciales inválidas", 401);
    }

    const payload: AuthUser = {
      userId: user.id!,
      role: user.Role?.name ?? "",
      permissions: user.Role?.Permissions?.map((p) => p.action) ?? [],
    };
    const token = this.tokenService.sign(payload);
    return { token, user: toPublicUser(user) };
  }
}
