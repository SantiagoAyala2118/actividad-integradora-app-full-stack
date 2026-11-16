# Patrones de diseño y principios SOLID

Los cuatro patrones participan del mismo flujo: el cambio de estado de un ticket.

```
TicketService.changeStatus()
   └─> EventPublisher.notify(evento)                     ← Observer (Subject)
         └─> NotificationService.update(evento)          ← Observer (Observer)
               ├─ subscriptionRepository.findSubscribers ← modelos sobre DatabaseConnection (Singleton)
               └─ notifiers creados por NotifierFactory  ← Factory
                     ├─ InAppNotifier                    → guarda en la tabla notifications
                     └─ ConsoleNotifierAdapter           ← Adapter → console.log
```

Todo se conecta en `backend/src/main.ts` (composition root).

---

## Singleton — `DatabaseConnection`

**Archivo:** `backend/src/database/DatabaseConnection.ts`

**Problema que resuelve:** toda la aplicación (modelos, repositorios, seed) debe compartir una única conexión a PostgreSQL. El constructor privado impide crear otra instancia de `Sequelize` por error, y `getInstance()` devuelve siempre la misma.

```ts
export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private readonly sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, { dialect: 'postgres', ... });
  }

  static getInstance(): DatabaseConnection {
    if (DatabaseConnection.instance === null) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}
```

---

## Observer — `ISubject`, `IObserver`, `EventPublisher`, `NotificationService`

**Archivos:**
- `backend/src/observer/ISubject.ts`
- `backend/src/observer/IObserver.ts`
- `backend/src/observer/EventPublisher.ts` (Subject)
- `backend/src/services/NotificationService.ts` (Observer)
- `backend/src/services/TicketService.ts` (quien dispara el evento)

**Problema que resuelve:** `TicketService` no debe saber quién reacciona a un cambio de estado. Solo publica el evento en el `EventPublisher` (que recibe por constructor como `ISubject`), y los observers registrados en `main.ts` reaccionan. Así se pueden agregar reacciones nuevas sin tocar el servicio de tickets. La implementación es propia: no usa `EventEmitter`.

```ts
// EventPublisher.ts
export class EventPublisher<TEvent> implements ISubject<TEvent> {
  private readonly observers = new Set<IObserver<TEvent>>();
  attach(observer: IObserver<TEvent>): void { this.observers.add(observer); }
  detach(observer: IObserver<TEvent>): void { this.observers.delete(observer); }
  async notify(event: TEvent): Promise<void> {
    for (const observer of this.observers) await observer.update(event);
  }
}

// TicketService.changeStatus()
await this.publisher.notify({ ticketId, ticketTitle, previousStatus, newStatus, changedAt });

// main.ts
ticketEvents.attach(notificationService);
```

> Los **observers** son objetos del backend (`NotificationService`); las **suscripciones** son filas de la tabla `subscriptions`. El observer consulta las suscripciones para saber a quién notificar.

---

## Factory — `NotifierFactory`

**Archivos:**
- `backend/src/notifications/INotifier.ts`
- `backend/src/notifications/NotifierFactory.ts`
- `backend/src/notifications/InAppNotifier.ts`

**Problema que resuelve:** `NotificationService` necesita canales de notificación pero no debe instanciarlos con `new` ni conocer sus dependencias (por ejemplo, el repositorio que usa `InAppNotifier`). La fábrica centraliza la creación a partir de un tipo (`'inapp' | 'console'`) y devuelve siempre un `INotifier`.

```ts
export class NotifierFactory implements INotifierFactory {
  constructor(private readonly notificationWriter: INotificationWriter) {}

  create(type: NotifierType): INotifier {
    switch (type) {
      case 'inapp':   return new InAppNotifier(this.notificationWriter);
      case 'console': return new ConsoleNotifierAdapter();
    }
  }
}

// NotificationService (constructor)
this.notifiers = channels.map((channel) => notifierFactory.create(channel));
```

---

## Adapter — `ConsoleNotifierAdapter`

**Archivo:** `backend/src/notifications/ConsoleNotifierAdapter.ts`

**Problema que resuelve:** la aplicación espera que todo canal cumpla `INotifier` (recibe un objeto `Notification` y devuelve una `Promise`), pero `console.log` recibe texto y no devuelve nada. El adapter convierte el objeto en una línea legible y la pasa a `console.log`, de modo que `NotificationService` nunca llama a `console.log` directamente.

```ts
export class ConsoleNotifierAdapter implements INotifier {
  constructor(private readonly write: ConsoleWriter = console.log) {}

  async send(notification: Notification): Promise<void> {
    this.write(this.format(notification));
  }

  private format(n: Notification): string {
    return `[NOTIFICACIÓN] Para: ${n.userEmail} | Ticket #${n.ticketId} "${n.ticketTitle}" | Estado: ${n.previousStatus} → ${n.newStatus}`;
  }
}
```

---

## S — Responsabilidad única

**Archivos:** `backend/src/controllers/TicketController.ts`, `backend/src/services/TicketService.ts`, `backend/src/repositories/TicketRepository.ts` (y sus equivalentes para cada módulo).

**Qué resuelve:** cada capa tiene una sola razón para cambiar. El controller solo valida la entrada HTTP y arma la respuesta; el service contiene la regla de negocio (por ejemplo, notificar solo si el estado realmente cambió) y no conoce Express; el repository es el único que habla con Sequelize.

```ts
// Controller: valida y responde
changeStatus = async (req: Request, res: Response) => {
  const status = getField(req.body, 'status');
  if (!isTicketStatus(status)) throw new BadRequestError(...);
  res.json(await this.ticketService.changeStatus(parseId(req.params.id), status));
};

// Service: lógica de negocio, sin req/res
if (current.status === newStatus) return current;
```

---

## O — Abierto/cerrado

**Archivos:** `backend/src/services/NotificationService.ts`, `backend/src/notifications/NotifierFactory.ts`, `backend/src/main.ts`.

**Qué resuelve:** para agregar un canal nuevo (por ejemplo, SMS) se crea una clase que implemente `INotifier`, se suma su tipo a la fábrica y se agrega a la lista de canales en `main.ts`. `NotificationService` queda cerrado a modificaciones: itera sobre `INotifier` sin saber cuáles son.

```ts
// main.ts: los canales se configuran desde afuera
new NotificationService(subscriptionRepository, notificationRepository, notifierFactory, ['inapp', 'console']);

// NotificationService.update(): no cambia al sumar canales
await Promise.all(this.notifiers.map((notifier) => notifier.send(notification)));
```

---

## L — Sustitución de Liskov

**Archivos:** `backend/src/notifications/InAppNotifier.ts`, `backend/src/notifications/ConsoleNotifierAdapter.ts`.

**Qué resuelve:** cualquier implementación de `INotifier` puede reemplazar a otra sin romper a `NotificationService`: ambas reciben el mismo `Notification`, devuelven `Promise<void>` y no exigen precondiciones extra. Lo mismo vale para los repositorios: un repositorio en memoria podría reemplazar al de Sequelize.

```ts
const notifiers: INotifier[] = [new InAppNotifier(repo), new ConsoleNotifierAdapter()];
for (const n of notifiers) await n.send(notification); // da igual cuál sea
```

---

## I — Segregación de interfaces

**Archivos:** `backend/src/repositories/interfaces/INotificationRepository.ts`, `backend/src/repositories/interfaces/ISubscriptionRepository.ts`.

**Qué resuelve:** cada cliente depende solo de los métodos que usa. `InAppNotifier` solo necesita crear notificaciones, así que depende de `INotificationWriter`; `NotificationService` solo necesita leer suscriptores, así que depende de `ISubscriberReader` y no de todo el repositorio.

```ts
export interface INotificationWriter { create(data: CreateNotificationData): Promise<NotificationDTO>; }
export interface INotificationReader { findByUser(...); countUnread(...); markAsRead(...); markAllAsRead(...); }
export interface INotificationRepository extends INotificationWriter, INotificationReader {}

export interface ISubscriberReader { findSubscribers(ticketId: number): Promise<Subscriber[]>; }

export class InAppNotifier implements INotifier {
  constructor(private readonly notificationWriter: INotificationWriter) {}
}
```

---

## D — Inversión de dependencias

**Archivos:** `backend/src/services/*.ts`, `backend/src/main.ts`.

**Qué resuelve:** los servicios dependen de abstracciones (`ITicketRepository`, `ISubject`, `IPasswordHasher`, `ITokenService`), nunca de clases concretas. Las implementaciones se crean e inyectan por constructor en un único lugar (`main.ts`), lo que permite cambiar bcrypt, JWT o la base de datos sin tocar la lógica de negocio.

```ts
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}
}

// main.ts
const authService = new AuthService(userRepository, roleRepository, new BcryptPasswordHasher(), tokenService);
```
