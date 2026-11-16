/**
 * Composition root: el único lugar donde se crean los objetos y se conectan entre sí.
 */
import { createApp } from './app';
import { env } from './config/env';
import { AuthController } from './controllers/AuthController';
import { NotificationController } from './controllers/NotificationController';
import { SubscriptionController } from './controllers/SubscriptionController';
import { TicketController } from './controllers/TicketController';
import { UserController } from './controllers/UserController';
import { DatabaseConnection } from './database/DatabaseConnection';
import { runSeed } from './database/seed';
import { createAuthenticate } from './middlewares/authenticate';
import { authorize } from './middlewares/authorize';
import { initModels } from './models';
import { NotifierFactory } from './notifications/NotifierFactory';
import { EventPublisher } from './observer/EventPublisher';
import { NotificationRepository } from './repositories/NotificationRepository';
import { RoleRepository } from './repositories/RoleRepository';
import { SubscriptionRepository } from './repositories/SubscriptionRepository';
import { TicketRepository } from './repositories/TicketRepository';
import { UserRepository } from './repositories/UserRepository';
import { createAuthRoutes } from './routes/auth.routes';
import { createNotificationRoutes } from './routes/notification.routes';
import { createSubscriptionRoutes } from './routes/subscription.routes';
import { createTicketRoutes } from './routes/ticket.routes';
import { createUserRoutes } from './routes/user.routes';
import { BcryptPasswordHasher } from './security/BcryptPasswordHasher';
import { JwtTokenService } from './security/JwtTokenService';
import { AuthService } from './services/AuthService';
import { NotificationService } from './services/NotificationService';
import { SubscriptionService } from './services/SubscriptionService';
import { TicketService } from './services/TicketService';
import { UserService } from './services/UserService';
import { TicketStatusChangedEvent } from './types/domain';

async function bootstrap(): Promise<void> {
  // --- Base de datos (Singleton) ---
  const db = DatabaseConnection.getInstance();
  initModels(db.getSequelize());
  await db.connect();
  await db.sync();

  // --- Infraestructura ---
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(env.jwtSecret, env.jwtExpiresInSeconds);
  await runSeed(passwordHasher);

  // --- Repositorios ---
  const userRepository = new UserRepository();
  const roleRepository = new RoleRepository();
  const ticketRepository = new TicketRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const notificationRepository = new NotificationRepository();

  // --- Observer + Factory + Adapter ---
  const ticketEvents = new EventPublisher<TicketStatusChangedEvent>();
  const notifierFactory = new NotifierFactory(notificationRepository);
  const notificationService = new NotificationService(
    subscriptionRepository,
    notificationRepository,
    notifierFactory,
    ['inapp', 'console'],
  );
  ticketEvents.attach(notificationService);

  // --- Servicios ---
  const authService = new AuthService(userRepository, roleRepository, passwordHasher, tokenService);
  const userService = new UserService(userRepository, roleRepository);
  const ticketService = new TicketService(ticketRepository, ticketEvents);
  const subscriptionService = new SubscriptionService(subscriptionRepository, ticketRepository);

  // --- HTTP ---
  const authenticate = createAuthenticate(authService);
  const app = createApp({
    auth: createAuthRoutes(new AuthController(authService), authenticate),
    users: createUserRoutes(new UserController(userService), authenticate, authorize),
    tickets: createTicketRoutes(new TicketController(ticketService), authenticate, authorize),
    subscriptions: createSubscriptionRoutes(new SubscriptionController(subscriptionService), authenticate, authorize),
    notifications: createNotificationRoutes(new NotificationController(notificationService), authenticate, authorize),
  });

  app.listen(env.port, () => {
    console.log(`[API] Escuchando en http://localhost:${env.port}/api`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('[API] No se pudo iniciar:', error);
  process.exit(1);
});
