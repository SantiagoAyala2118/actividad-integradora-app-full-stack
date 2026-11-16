import { PermissionModel, RoleModel, TicketModel, UserModel, initModels } from '../models';
import { IPasswordHasher } from '../security/IPasswordHasher';
import { DatabaseConnection } from './DatabaseConnection';

const PERMISSIONS = [
  'ticket:read',
  'ticket:create',
  'ticket:update',
  'ticket:change-status',
  'ticket:delete',
  'subscription:create',
  'subscription:delete',
  'notification:read',
  'user:read',
  'user:assign-role',
] as const;

type PermissionName = (typeof PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<string, readonly PermissionName[]> = {
  admin: PERMISSIONS,
  operador: [
    'ticket:read',
    'ticket:create',
    'ticket:update',
    'ticket:change-status',
    'subscription:create',
    'subscription:delete',
    'notification:read',
  ],
  usuario: ['ticket:read', 'subscription:create', 'subscription:delete', 'notification:read'],
};

const TEST_USERS = [
  { name: 'Admin', email: 'admin@tp.com', password: 'admin123', role: 'admin' },
  { name: 'Operador', email: 'operador@tp.com', password: 'operador123', role: 'operador' },
  { name: 'Usuario', email: 'usuario@tp.com', password: 'usuario123', role: 'usuario' },
];

const SAMPLE_TICKETS = [
  { title: 'No funciona la impresora', description: 'La impresora del 2° piso no imprime.' },
  { title: 'Alta de cuenta de correo', description: 'Crear casilla para el nuevo integrante del equipo.' },
];

/** Carga roles, permisos, usuarios de prueba y tickets de ejemplo. Es idempotente. */
export async function runSeed(passwordHasher: IPasswordHasher): Promise<void> {
  const permissions = new Map<string, PermissionModel>();
  for (const name of PERMISSIONS) {
    const [permission] = await PermissionModel.findOrCreate({ where: { name } });
    permissions.set(name, permission);
  }

  const roles = new Map<string, RoleModel>();
  for (const [roleName, permNames] of Object.entries(ROLE_PERMISSIONS)) {
    const [role] = await RoleModel.findOrCreate({ where: { name: roleName } });
    await role.setPermissions(permNames.map((p) => permissions.get(p)).filter((p): p is PermissionModel => p !== undefined));
    roles.set(roleName, role);
  }

  for (const u of TEST_USERS) {
    const exists = await UserModel.findOne({ where: { email: u.email } });
    if (exists) continue;
    const role = roles.get(u.role);
    if (!role) continue;
    await UserModel.create({
      name: u.name,
      email: u.email,
      passwordHash: await passwordHasher.hash(u.password),
      roleId: role.id,
    });
  }

  if ((await TicketModel.count()) === 0) {
    await TicketModel.bulkCreate(SAMPLE_TICKETS);
  }

  console.log('[SEED] Roles, permisos y usuarios de prueba listos');
}

// Permite ejecutar el seed manualmente: `npm run seed`
if (require.main === module) {
  void (async () => {
    // Import diferido para no acoplar el módulo a bcrypt cuando se importa desde main.ts
    const { BcryptPasswordHasher } = await import('../security/BcryptPasswordHasher');
    const db = DatabaseConnection.getInstance();
    initModels(db.getSequelize());
    await db.connect();
    await db.sync();
    await runSeed(new BcryptPasswordHasher());
    await db.close();
  })().catch((error: unknown) => {
    console.error('[SEED] Error:', error);
    process.exit(1);
  });
}
