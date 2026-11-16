import { BadRequestError, ConflictError, UnauthorizedError } from '../errors/AppError';
import { IRoleRepository } from '../repositories/interfaces/IRoleRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IPasswordHasher } from '../security/IPasswordHasher';
import { ITokenService } from '../security/ITokenService';
import { UserDTO } from '../types/domain';

export interface AuthResult {
  token: string;
  user: UserDTO;
}

export const DEFAULT_ROLE = 'usuario';

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    if (password.length < 6) throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');

    const existing = await this.userRepository.findByEmailWithPassword(normalizedEmail);
    if (existing) throw new ConflictError('El email ya está registrado');

    const role = await this.roleRepository.findByName(DEFAULT_ROLE);
    if (!role) throw new Error(`No existe el rol "${DEFAULT_ROLE}". ¿Se ejecutó el seed?`);

    const passwordHash = await this.passwordHasher.hash(password);
    const user = await this.userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      roleId: role.id,
    });
    return { token: this.tokenService.sign({ userId: user.id }), user };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByEmailWithPassword(email.trim().toLowerCase());
    const valid = user !== null && (await this.passwordHasher.compare(password, user.passwordHash));
    if (!user || !valid) throw new UnauthorizedError('Email o contraseña incorrectos');

    const { passwordHash: _omit, ...publicUser } = user;
    return { token: this.tokenService.sign({ userId: user.id }), user: publicUser };
  }

  /** Devuelve el usuario dueño del token (con permisos actualizados) o null. */
  async getUserFromToken(token: string): Promise<UserDTO | null> {
    const payload = this.tokenService.verify(token);
    if (!payload) return null;
    return this.userRepository.findById(payload.userId);
  }
}
