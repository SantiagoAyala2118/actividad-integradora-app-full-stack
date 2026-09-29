# Plan de trabajo del backend — TP Integrador TLP IV

**Dominio:** D. Tienda (recurso `Product`) · **Base de datos:** PostgreSQL + Sequelize · **Organización:** Forma 1 (una carpeta por tipo de archivo)
**Integrantes:** Santi (rama `dev-santi`) y Lucas (rama `dev-luca`)

> Este archivo es una guía de trabajo interna. Cada tarea tiene un casillero `[ ]` para marcar cuando esté lista (`[x]`).
> El alcance es el **backend + Docker + documentación**. El frontend (`frontend/`) es un proyecto aparte que se planifica después.

---

## 0. Decisiones y contratos (leer antes de empezar)

Estas decisiones evitan que los dos escriban cosas incompatibles. Si cambian algo, avísense.

### 0.1 Estados y permisos

Estados del producto: `DISPONIBLE`, `SIN_STOCK`, `DISCONTINUADO`.

| Permiso | admin | operador | usuario |
|---|:---:|:---:|:---:|
| `product:read` | ✔ | ✔ | ✔ |
| `product:create` | ✔ | ✔ | |
| `product:update` | ✔ | ✔ | |
| `product:change-status` | ✔ | ✔ | |
| `product:delete` | ✔ | | |
| `subscription:create` | ✔ | ✔ | ✔ |
| `subscription:delete` | ✔ | ✔ | ✔ |
| `notification:read` | ✔ | ✔ | ✔ |
| `user:read` | ✔ | | |
| `user:assign-role` | ✔ | | |

### 0.2 Tipos compartidos (los crea Lucas en la tarea L1)

```ts
export enum ProductStatus {
  DISPONIBLE = "DISPONIBLE",
  SIN_STOCK = "SIN_STOCK",
  DISCONTINUADO = "DISCONTINUADO",
}

// Lo que viaja dentro del JWT y queda en req.user
export interface AuthUser { userId: number; role: string; permissions: string[]; }

// Lo que publica ProductService cuando cambia un estado (Observer)
export interface ProductStatusChangedEvent {
  productId: number; productName: string;
  oldStatus: ProductStatus; newStatus: ProductStatus;
}

// Lo que recibe cada canal (INotifier). Es la "Notification" de la consigna;
// se llama NotificationData para no chocar con el modelo Notification de Sequelize.
export interface NotificationData {
  userId: number; userEmail: string;
  productId: number; productName: string;
  oldStatus: ProductStatus; newStatus: ProductStatus;
}
```

### 0.3 Endpoints (prefijo `/api`)

| Método | Ruta | Permiso |
|---|---|---|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| GET | `/api/products` | `product:read` |
| GET | `/api/products/:id` | `product:read` |
| POST | `/api/products` | `product:create` |
| PUT | `/api/products/:id` | `product:update` |
| PATCH | `/api/products/:id/status` | `product:change-status` |
| DELETE | `/api/products/:id` | `product:delete` |
| POST | `/api/products/:id/subscription` | `subscription:create` |
| DELETE | `/api/products/:id/subscription` | `subscription:delete` |
| GET | `/api/subscriptions/me` | solo `authenticate` (lista las suscripciones del propio usuario) |
| GET | `/api/notifications` | `notification:read` |
| GET | `/api/notifications/unread-count` | `notification:read` |
| PATCH | `/api/notifications/:id/read` | `notification:read` |
| GET | `/api/users` | `user:read` |
| PATCH | `/api/users/:id/role` | `user:assign-role` (body: `{ "roleName": "operador" }`) |
| GET | `/api/health` | — (para probar que el servidor levanta) |

### 0.4 Reglas técnicas del proyecto

- `"strict": true`. Nada de `any` (si es imprescindible, comentario que lo justifique).
- **Solo** las librerías permitidas: `express`, `cors`, `dotenv`, `jsonwebtoken`, `bcrypt`, `sequelize`, `pg` y, como desarrollo, `typescript`, `tsx`, `@types/*`. No instalar nada más (ni `uuid`, ni `zod`, ni `nodemon`).
- Validar la entrada **a mano** en los controllers (campos obligatorios, tipos, estados válidos).
- Los services **no** reciben `req` ni `res`. Para avisar errores lanzan `AppError` (clase con mensaje y `statusCode`, la crea Lucas en L4).
- Los controllers usan `try/catch` y llaman a `next(error)`; el `errorHandler` responde.
- Los routers se escriben como **funciones que reciben el controller**, por ejemplo `createProductRouter(controller)`. Así `main.ts` es el único lugar donde se crean y conectan los objetos.
- Modelos de Sequelize: declarar los atributos con `declare` (ej. `declare id: number;`) para evitar problemas con TypeScript.

### 0.5 Reglas de Git

1. Cada uno trabaja en su rama. Al terminar una tarea (o un grupo chico de tareas) abren un PR hacia `develop` y el otro lo revisa.
2. Después de cada merge, el otro hace `git pull origin develop` en su rama.
3. Commits chicos y descriptivos: `feat(auth): login con JWT`, `feat(notifications): ConsoleNotifierAdapter`. Prohibido `cambios`, `fix`, `asdf`.
4. Si hay conflicto en `models/index.ts` o `main.ts` (los dos agregan líneas), **quédense con las líneas de los dos**.
5. Cada uno tiene que poder explicar **todo**, no solo lo suyo: al revisar el PR del otro, pidan que se los explique.

---

## 1. Estructura final del backend

```
tp-integrador-tlp4/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── PATTERNS.md
└── backend/
    ├── Dockerfile
    ├── .dockerignore
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── main.ts                      composition root
        ├── app.ts
        ├── config/env.ts
        ├── errors/AppError.ts
        ├── types/index.ts               enum, AuthUser, eventos
        ├── types/express.d.ts           agrega req.user
        ├── database/
        │   ├── DatabaseConnection.ts    Singleton
        │   └── seed.ts
        ├── models/                      User, Role, Permission, Product, Subscription, Notification, index.ts
        ├── repositories/
        │   ├── interfaces/              IUserRepository, IRoleRepository, IProductRepository,
        │   │                            ISubscriptionRepository, INotificationRepository
        │   └── UserRepository.ts, RoleRepository.ts, ProductRepository.ts,
        │       SubscriptionRepository.ts, NotificationRepository.ts
        ├── services/                    AuthService, UserService, ProductService,
        │                                SubscriptionService, NotificationService
        ├── controllers/                 Auth, User, Product, Subscription, Notification
        ├── routes/                      auth, user, product, subscription, notification
        ├── middlewares/                 authenticate, authorize, errorHandler
        ├── observer/                    ISubject, IObserver, EventPublisher
        └── notifications/               INotifier, InAppNotifier, ConsoleNotifierAdapter, NotifierFactory
```

---

## 2. Reparto y orden de trabajo

Cada uno tiene **12 tareas**. `S` = Santi, `L` = Lucas.

| Etapa | Santi | Lucas |
|---|---|---|
| **1. Base** | S1, S2, S3 | L1, L2, L3 |
| **2. Usuarios, roles y permisos** | S4, S5, S6, S7 | L4, L5 |
| **3. Producto y suscripciones** | S8, S9, S10 | L6, L7 |
| **4. Notificaciones** | S11 | L8, L9, L10, L11 |
| **5. Docker final y documentación** | S12 | L12 |

**Dependencias importantes:**
- **S1 va primero** (15 minutos): sin `package.json` ni `tsconfig.json` nadie puede compilar. Santi lo sube a `develop` y Lucas lo trae.
- **L3 (interfaces de repositorio) antes de S5**: Santi implementa esas interfaces. Lucas las sube temprano.
- **S8 (modelo y repositorio de Product) antes de L6**: el modelo `Subscription` referencia a `Product`. Santi sube S8 en un PR corto.
- **S11 (canales) y L9 (NotificationService) se juntan en L11**, cuando Lucas arma `main.ts`.
- Si alguien termina antes, adelanta la tarea que no dependa de nada o revisa el PR del otro.

---

## ETAPA 1 — Base del proyecto

### [ ] S1 — Crear el proyecto backend (Santi)
- **Carpeta:** `backend/` (y raíz del repo para `.gitignore`)
- **Archivos:** `backend/package.json`, `backend/tsconfig.json`, `.gitignore`
- **Qué hacer:**
  1. Dentro de `backend/`: `npm init -y`.
  2. Instalar dependencias: `npm i express cors dotenv jsonwebtoken bcrypt sequelize pg`.
  3. Instalar desarrollo: `npm i -D typescript tsx @types/node @types/express @types/cors @types/jsonwebtoken @types/bcrypt`.
  4. `package.json`, agregar scripts: `"dev": "tsx watch src/main.ts"`, `"build": "tsc"`, `"start": "node dist/main.js"`.
  5. `tsconfig.json` con: `target: "ES2022"`, `module: "commonjs"`, `outDir: "dist"`, `rootDir: "src"`, `strict: true`, `esModuleInterop: true`, `skipLibCheck: true`, `include: ["src"]`.
  6. `.gitignore` en la raíz con `node_modules/`, `dist/` y `.env`.
- **Commit:** `chore(backend): inicializar proyecto TypeScript`
- **Listo cuando:** `npx tsc --noEmit` corre sin errores de configuración y el `package.json` solo tiene librerías permitidas. Está el `package-lock.json` (se sube al repo, Docker lo necesita).

### [ ] S2 — Base de datos en Docker Compose (Santi)
- **Carpeta:** raíz del repo
- **Archivos:** `docker-compose.yml`, `.env.example` (y tu `.env` local, que **no** se sube)
- **Qué hacer:** seguir la **sección 5 de esta guía**. En esta etapa el compose solo tiene el servicio `db`, con volumen y `healthcheck`.
- **Commit:** `feat(docker): servicio de PostgreSQL con volumen y healthcheck`
- **Listo cuando:** `docker compose up -d db` levanta y `docker compose ps` muestra la base como `healthy`.

### [ ] S3 — Configuración, Singleton y servidor mínimo (Santi)
- **Carpeta:** `backend/src/config/`, `backend/src/database/`, `backend/src/`
- **Archivos y contenido:**
  - `config/env.ts`: carga `dotenv` (`dotenv.config({ path: "../.env" })`, se corre desde `backend/`) y exporta un objeto `env` con `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `API_PORT`. Si falta `JWT_SECRET`, lanza un error.
  - `database/DatabaseConnection.ts`: **Singleton**.
    ```ts
    export class DatabaseConnection {
      private static instance: DatabaseConnection;
      private sequelize: Sequelize;
      private constructor() {
        this.sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
          host: env.DB_HOST, port: env.DB_PORT, dialect: "postgres", logging: false,
        });
      }
      static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) DatabaseConnection.instance = new DatabaseConnection();
        return DatabaseConnection.instance;
      }
      getSequelize(): Sequelize { return this.sequelize; }
    }
    ```
    *Por qué:* el constructor privado impide hacer `new DatabaseConnection()` desde afuera; `getInstance()` siempre devuelve la misma conexión.
  - `app.ts`: `export function createApp()` que crea el `express()`, le agrega `cors()`, `express.json()` y la ruta `GET /api/health` (responde `{ status: "ok" }`), y devuelve la app. **No** registra los routers (eso lo hace `main.ts`).
  - `main.ts` (mínimo por ahora): obtiene `DatabaseConnection.getInstance().getSequelize()`, hace `await sequelize.authenticate()`, crea la app con `createApp()` y hace `listen(env.API_PORT)`.
- **Commit:** `feat(database): DatabaseConnection (Singleton) y servidor base`
- **Listo cuando:** `npm run dev` (desde `backend/`) conecta a la base y `GET /api/health` responde.

### [ ] L1 — Tipos compartidos y `AppError` (Lucas)
- **Carpeta:** `backend/src/types/` y `backend/src/errors/`
- **Archivos y contenido:**
  - `types/index.ts`: copiar los tipos de la **sección 0.2** (`ProductStatus`, `AuthUser`, `ProductStatusChangedEvent`, `NotificationData`).
  - `types/express.d.ts`: agrega `user?: AuthUser` a `Request` de Express.
    ```ts
    import { AuthUser } from "./index";
    declare global { namespace Express { interface Request { user?: AuthUser } } }
    export {};
    ```
  - `errors/AppError.ts`: clase que extiende `Error` con una propiedad `statusCode: number`.
    ```ts
    export class AppError extends Error {
      constructor(message: string, public statusCode: number = 400) { super(message); }
    }
    ```
    *Por qué:* los services pueden avisar "no encontrado" (404) o "sin permiso" (403) sin conocer Express.
- **Commit:** `feat(types): tipos compartidos y AppError`
- **Listo cuando:** `npx tsc --noEmit` no da errores.

### [ ] L2 — Patrón Observer: interfaces y `EventPublisher` (Lucas)
- **Carpeta:** `backend/src/observer/`
- **Archivos y contenido:**
  - `ISubject.ts`: interfaz con `attach(observer: IObserver): void`, `detach(observer: IObserver): void`, `notify(event: ProductStatusChangedEvent): Promise<void>`.
  - `IObserver.ts`: interfaz con `update(event: ProductStatusChangedEvent): Promise<void>`.
  - `EventPublisher.ts`: `implements ISubject`. Tiene un arreglo privado `observers: IObserver[]`.
    - `attach`: agrega si no está.
    - `detach`: lo quita con `filter`.
    - `notify`: recorre el arreglo y hace `await observer.update(event)` a cada uno.
  - **Prohibido** usar `EventEmitter` de Node.
- **Commit:** `feat(observer): ISubject, IObserver y EventPublisher`
- **Listo cuando:** compila y podés explicar quién es el Subject y quién el Observer.

### [ ] L3 — Interfaces de repositorio e `INotifier` (Lucas)
- **Carpeta:** `backend/src/repositories/interfaces/` y `backend/src/notifications/`
- **Archivos y contenido** (interfaces chicas y específicas, por el principio **I** de SOLID):
  - `IUserRepository.ts`: `findById(id)`, `findByEmail(email)`, `findAll()`, `create(data)`, `updateRole(userId, roleId)`.
  - `IRoleRepository.ts`: `findByName(name)`, `findAll()`.
  - `IProductRepository.ts`: `findAll()`, `findById(id)`, `create(data)`, `update(id, data)`, `delete(id)`.
  - `ISubscriptionRepository.ts`: `create(userId, productId)`, `delete(userId, productId)`, `find(userId, productId)`, `findByProductId(productId)`, `findByUserId(userId)`.
  - `INotificationRepository.ts`: `create(data)`, `findByUserId(userId)`, `findById(id)`, `markAsRead(id)`, `countUnreadByUserId(userId)`.
  - `notifications/INotifier.ts`: `send(notification: NotificationData): Promise<void>`.
  - Todos los métodos devuelven `Promise<...>`. Para los tipos de los modelos, usen `import type` de `models/X`; si el modelo todavía no existe, dejen un tipo simple provisorio y ajústenlo cuando Santi suba S4 y S8.
- **Commit:** `feat(repositories): interfaces de repositorio e INotifier`
- **Listo cuando:** compila y avisás a Santi para que haga merge (S5 depende de esto).

---

## ETAPA 2 — Usuarios, roles y permisos (RF1, RF2, RF6)

### [ ] S4 — Modelos User, Role y Permission (Santi)
- **Carpeta:** `backend/src/models/`
- **Archivos y contenido:**
  - `Permission.ts`: `id`, `name` (string único, ej. `"product:read"`).
  - `Role.ts`: `id`, `name` (string único: `admin`, `operador`, `usuario`).
  - `User.ts`: `id`, `name`, `email` (único), `password` (el hash), `roleId`, timestamps.
  - `index.ts`: función `initModels(sequelize)` que llama al `init` de cada modelo y define las relaciones:
    - `Role.belongsToMany(Permission, { through: "role_permissions" })` y la inversa.
    - `Role.hasMany(User)` y `User.belongsTo(Role)`.
  - Cada modelo: clase que extiende `Model`, atributos con `declare`, y un método/estático `initModel(sequelize)`.
- **Commit:** `feat(models): User, Role y Permission con relaciones`
- **Listo cuando:** al llamar `initModels` y `sequelize.sync()` se crean las tablas en PostgreSQL (mirar con `docker compose exec db psql -U <DB_USER> -d <DB_NAME> -c "\dt"`).

### [ ] S5 — Repositorios de User y Role (Santi)
- **Carpeta:** `backend/src/repositories/`
- **Archivos:** `UserRepository.ts`, `RoleRepository.ts`
- **Qué hacer:** clases que `implements IUserRepository` / `IRoleRepository`. Reciben nada por constructor (usan los modelos importados). Ejemplo:
  ```ts
  export class UserRepository implements IUserRepository {
    async findByEmail(email: string) {
      return User.findOne({ where: { email }, include: [{ model: Role, include: [Permission] }] });
    }
    // ...
  }
  ```
  *Por qué:* al traer el usuario con su rol y permisos, el login puede armar el JWT sin más consultas.
- **Commit:** `feat(repositories): UserRepository y RoleRepository`
- **Listo cuando:** compila y `findByEmail` devuelve el usuario con rol y permisos (probar después del seed).

### [ ] S6 — Seed de roles, permisos y usuarios de prueba (Santi)
- **Carpeta:** `backend/src/database/`
- **Archivo:** `seed.ts`
- **Qué poner:** función `export async function runSeed()`:
  1. Crear los 10 permisos de la tabla 0.1 con `findOrCreate`.
  2. Crear los roles `admin`, `operador`, `usuario` con `findOrCreate` y asignarles sus permisos (`role.setPermissions([...])`).
  3. Crear tres usuarios de prueba (contraseña hasheada con `bcrypt.hash(pass, 10)`): `admin@tp.com`, `operador@tp.com`, `usuario@tp.com`. Contraseñas sugeridas: `Admin123`, `Operador123`, `Usuario123` (van en el README).
  4. Debe poder ejecutarse **varias veces** sin duplicar datos (por eso `findOrCreate`).
  - *Nota:* el seed es un script de carga inicial y usa los modelos directamente. Dejen un comentario que lo aclare, porque en el resto del proyecto solo los repositorios tocan los modelos.
- **Commit:** `feat(database): seed de roles, permisos y usuarios de prueba`
- **Listo cuando:** ejecutar el seed dos veces no da error ni duplica filas.

### [ ] S7 — Autenticación: service, controller, routes y `authenticate` (Santi)
- **Carpeta:** `services/`, `controllers/`, `routes/`, `middlewares/`
- **Archivos y contenido:**
  - `services/AuthService.ts`: recibe por constructor `IUserRepository` e `IRoleRepository`.
    - `register(name, email, password)`: si el email existe → `AppError("Email ya registrado", 409)`; hashea con `bcrypt`; busca el rol `usuario` y crea el usuario con ese rol.
    - `login(email, password)`: busca por email; compara con `bcrypt.compare`; si falla → `AppError("Credenciales inválidas", 401)`; genera el JWT con `jwt.sign({ userId, role, permissions }, env.JWT_SECRET, { expiresIn: "1h" })`; devuelve `{ token, user }` (sin el hash).
  - `controllers/AuthController.ts`: `register` y `login`. Validan que vengan los campos (y que el email contenga `@` y la contraseña tenga al menos 6 caracteres), llaman al service y responden 201 / 200.
  - `routes/auth.routes.ts`: `createAuthRouter(controller)` con `POST /register` y `POST /login`.
  - `middlewares/authenticate.ts`: lee `Authorization: Bearer <token>`, hace `jwt.verify`, guarda el payload en `req.user` y llama a `next()`. Si falta o es inválido → 401.
- **Commit:** `feat(auth): registro y login con JWT`
- **Listo cuando:** con Postman, `register` crea un usuario con rol `usuario`, `login` devuelve un token, y un token inválido da 401.

### [ ] L4 — `authorize` y `errorHandler` (Lucas)
- **Carpeta:** `backend/src/middlewares/`
- **Archivos y contenido:**
  - `authorize.ts`: función que recibe el permiso y devuelve el middleware.
    ```ts
    export const authorize = (permission: string) =>
      (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.permissions.includes(permission)) {
          return res.status(403).json({ message: "No tenés permiso para esta acción" });
        }
        next();
      };
    ```
    *Por qué:* es la protección real. Aunque el frontend oculte un botón, si llaman al endpoint directo sin permiso reciben 403.
  - `errorHandler.ts`: middleware de 4 parámetros `(err, req, res, next)`. Si `err instanceof AppError` responde con su `statusCode` y mensaje; si no, responde 500 con un mensaje genérico y hace `console.error(err)`.
- **Commit:** `feat(middlewares): authorize y errorHandler`
- **Listo cuando:** compila. (Se prueba completo cuando estén las rutas en la Etapa 3.)

### [ ] L5 — Administración de usuarios: RF6 (Lucas)
- **Carpeta:** `services/`, `controllers/`, `routes/`
- **Archivos y contenido:**
  - `services/UserService.ts`: recibe `IUserRepository` e `IRoleRepository`.
    - `listUsers()`: devuelve todos (sin el campo `password`).
    - `assignRole(userId, roleName)`: busca usuario (404 si no existe) y rol (400 si el rol no existe) y llama a `updateRole`.
  - `controllers/UserController.ts`: `list` y `assignRole` (valida que venga `roleName`).
  - `routes/user.routes.ts`: `createUserRouter(controller)`:
    - `GET /` → `authenticate`, `authorize("user:read")`
    - `PATCH /:id/role` → `authenticate`, `authorize("user:assign-role")`
- **Commit:** `feat(users): listar usuarios y asignar rol`
- **Listo cuando:** con el token de admin funciona; con el de `usuario` responde 403.

---

## ETAPA 3 — Producto y suscripciones (RF3, RF4)

### [ ] S8 — Modelo `Product` y `ProductRepository` (Santi) — *subir en un PR corto*
- **Carpeta:** `models/`, `repositories/`
- **Archivos y contenido:**
  - `models/Product.ts`: `id`, `name`, `description`, `price` (DECIMAL), `status` (ENUM con los valores de `ProductStatus`, por defecto `DISPONIBLE`), timestamps. Registrarlo en `models/index.ts`.
  - `repositories/ProductRepository.ts`: `implements IProductRepository` (`findAll`, `findById`, `create`, `update`, `delete`).
- **Commit:** `feat(products): modelo y repositorio de Product`
- **Listo cuando:** se crea la tabla `products` y avisás a Lucas (L6 depende de esto).

### [ ] S9 — `ProductService` con el cambio de estado (Santi)
- **Carpeta:** `backend/src/services/`
- **Archivo:** `ProductService.ts`
- **Qué poner:** recibe por constructor `IProductRepository` y `EventPublisher` (tipado como `ISubject`).
  - `list()`, `getById(id)` (404 si no existe), `create(data)`, `update(id, data)`, `delete(id)` (404 si no existe).
  - `changeStatus(id, newStatus)`:
    ```ts
    async changeStatus(id: number, newStatus: ProductStatus) {
      const product = await this.getById(id);
      if (product.status === newStatus) throw new AppError("El producto ya tiene ese estado", 400);
      const oldStatus = product.status;
      await this.repo.update(id, { status: newStatus });
      await this.publisher.notify({ productId: id, productName: product.name, oldStatus, newStatus });
    }
    ```
    *Por qué:* el service solo avisa "cambió el estado". No sabe quién escucha ni cómo se notifica: ese desacople es el Observer.
- **Commit:** `feat(products): ProductService con cambio de estado`
- **Listo cuando:** compila. No debe importar nada de Express ni de `NotificationService`.

### [ ] S10 — `ProductController` y rutas (Santi)
- **Carpeta:** `controllers/`, `routes/`
- **Archivos y contenido:**
  - `controllers/ProductController.ts`: `list`, `getById`, `create`, `update`, `changeStatus`, `delete`. Validan la entrada (nombre obligatorio, precio numérico ≥ 0, que el `status` del body sea uno de los valores de `ProductStatus`).
  - `routes/product.routes.ts`: `createProductRouter(productController, subscriptionController)`. Cada ruta lleva `authenticate` + `authorize("...")` según la tabla 0.3. Las dos rutas de suscripción (`POST/DELETE /:id/subscription`) las define Lucas en L7 dentro de este mismo archivo; acuerden el orden para no pisarse.
- **Commit:** `feat(products): controller y rutas de Product`
- **Listo cuando:** con Postman, `operador` crea y cambia estado; `usuario` solo lista y ve detalle; `delete` solo funciona con `admin`.

### [ ] L6 — Modelo `Subscription` y su repositorio (Lucas)
- **Carpeta:** `models/`, `repositories/`
- **Archivos y contenido:**
  - `models/Subscription.ts`: `id`, `userId`, `productId`, timestamps, con **índice único** sobre (`userId`, `productId`). Relaciones: `User.hasMany(Subscription)`, `Product.hasMany(Subscription)` y las inversas en `models/index.ts`.
  - `repositories/SubscriptionRepository.ts`: `implements ISubscriptionRepository`. `findByProductId` debe devolver las suscripciones de ese producto (el `NotificationService` lo va a usar).
- **Commit:** `feat(subscriptions): modelo y repositorio`
- **Listo cuando:** se crea la tabla `subscriptions` con la restricción de unicidad.

### [ ] L7 — Servicio, controller y rutas de suscripciones (Lucas)
- **Carpeta:** `services/`, `controllers/`, `routes/`
- **Archivos y contenido:**
  - `services/SubscriptionService.ts`: recibe `ISubscriptionRepository` e `IProductRepository`.
    - `subscribe(userId, productId)`: 404 si el producto no existe, 409 si ya está suscripto.
    - `unsubscribe(userId, productId)`: 404 si no estaba suscripto.
    - `listMine(userId)`.
  - `controllers/SubscriptionController.ts`: toma `userId` de `req.user` (nunca del body) y `productId` de `req.params`.
  - Rutas: agregar en `routes/product.routes.ts` `POST /:id/subscription` (`subscription:create`) y `DELETE /:id/subscription` (`subscription:delete`). Crear `routes/subscription.routes.ts` con `GET /me` (solo `authenticate`).
- **Commit:** `feat(subscriptions): suscribirse y desuscribirse`
- **Listo cuando:** con Postman, un usuario se suscribe, no puede suscribirse dos veces y se desuscribe.

---

## ETAPA 4 — Notificaciones (Observer, Factory y Adapter)

### [ ] S11 — Canales: `InAppNotifier`, `ConsoleNotifierAdapter` y `NotifierFactory` (Santi)
- **Carpeta:** `backend/src/notifications/`
- **Archivos y contenido:**
  - `InAppNotifier.ts`: `implements INotifier`. Recibe `INotificationRepository` por constructor. En `send()` arma un mensaje (`Producto "X" cambió de A a B`) y llama a `repo.create({ userId, productId, message })`.
  - `ConsoleNotifierAdapter.ts`: **Adapter**. `implements INotifier`.
    ```ts
    export class ConsoleNotifierAdapter implements INotifier {
      async send(n: NotificationData): Promise<void> {
        console.log(`[NOTIFICACIÓN] Para: ${n.userEmail} | Producto #${n.productId} | Estado: ${n.oldStatus} → ${n.newStatus}`);
      }
    }
    ```
    *Por qué:* la app espera un objeto y una promesa (`INotifier`), pero `console.log` recibe texto. El adapter traduce.
  - `NotifierFactory.ts`: **Factory**. Recibe el `INotificationRepository` por constructor.
    ```ts
    export type ChannelType = "inapp" | "console";
    export class NotifierFactory {
      constructor(private notificationRepo: INotificationRepository) {}
      create(type: ChannelType): INotifier {
        switch (type) {
          case "inapp": return new InAppNotifier(this.notificationRepo);
          case "console": return new ConsoleNotifierAdapter();
        }
      }
    }
    ```
    *Por qué:* `NotificationService` pide un canal por nombre y nunca hace `new` de clases concretas; agregar un canal es una clase nueva y un `case`.
- **Commit:** `feat(notifications): canales, Adapter y Factory`
- **Listo cuando:** compila y `create("console").send({...})` imprime la línea con el formato de la consigna.

### [ ] L8 — Modelo `Notification` y su repositorio (Lucas)
- **Carpeta:** `models/`, `repositories/`
- **Archivos y contenido:**
  - `models/Notification.ts`: `id`, `userId`, `productId`, `message`, `isRead` (boolean, por defecto `false`), timestamps. Relaciones con `User` y `Product` en `models/index.ts`.
  - `repositories/NotificationRepository.ts`: `implements INotificationRepository`. `findByUserId` ordena por fecha descendente; `countUnreadByUserId` cuenta las `isRead = false`.
- **Commit:** `feat(notifications): modelo y repositorio de Notification`
- **Listo cuando:** se crea la tabla `notifications`.

### [ ] L9 — `NotificationService` (el Observer real) (Lucas)
- **Carpeta:** `backend/src/services/`
- **Archivo:** `NotificationService.ts`
- **Qué poner:** `implements IObserver`. Recibe por constructor `ISubscriptionRepository`, `IUserRepository`, `INotificationRepository` y `NotifierFactory`.
  - `update(event)`:
    1. Busca las suscripciones del producto: `subscriptionRepo.findByProductId(event.productId)`.
    2. Por cada una, busca el usuario (para tener el email) y arma un `NotificationData`.
    3. Por cada canal de `const CHANNELS: ChannelType[] = ["inapp", "console"]`, hace `this.factory.create(canal).send(data)`.
  - `listByUser(userId)`, `countUnread(userId)` y `markAsRead(userId, notificationId)` (404 si no existe; 403 si la notificación es de otro usuario).
  - **Reglas:** nunca hace `new` de un canal ni llama a `console.log`; solo conoce `INotifier` y la factory.
- **Commit:** `feat(notifications): NotificationService como Observer`
- **Listo cuando:** compila y se lo puede registrar en el `EventPublisher` con `attach`.

### [ ] L10 — Controller y rutas de notificaciones (Lucas)
- **Carpeta:** `controllers/`, `routes/`
- **Archivos y contenido:**
  - `controllers/NotificationController.ts`: `list`, `unreadCount`, `markAsRead`. Siempre usan `req.user.userId`.
  - `routes/notification.routes.ts`: `createNotificationRouter(controller)`. Declarar `GET /unread-count` **antes** de `/:id/read` para que Express no confunda las rutas. Todas con `authenticate` y `authorize("notification:read")`.
- **Commit:** `feat(notifications): bandeja, contador y marcar como leída`
- **Listo cuando:** un usuario solo ve y modifica sus propias notificaciones.

### [ ] L11 — `main.ts` completo: el composition root (Lucas, con Santi al lado)
- **Carpeta:** `backend/src/`
- **Archivo:** `main.ts`
- **Qué poner**, en este orden:
  1. `const sequelize = DatabaseConnection.getInstance().getSequelize();`
  2. `initModels(sequelize)`, `await sequelize.authenticate()`, `await sequelize.sync()`, `await runSeed()`.
  3. Crear repositorios: `userRepo`, `roleRepo`, `productRepo`, `subscriptionRepo`, `notificationRepo`.
  4. Crear `EventPublisher`, `NotifierFactory(notificationRepo)` y `NotificationService(subscriptionRepo, userRepo, notificationRepo, factory)`.
  5. **`publisher.attach(notificationService);`**
  6. Crear services (`ProductService` recibe `productRepo` y `publisher`), controllers y routers.
  7. `const app = createApp();`, registrar `app.use("/api/auth", ...)`, `/api/users`, `/api/products`, `/api/subscriptions`, `/api/notifications` y **al final** `app.use(errorHandler)`.
  8. `app.listen(env.API_PORT)`.
  - *Por qué:* es el **único** lugar con `new`; todo lo demás recibe sus dependencias por constructor (principio **D** de SOLID).
- **Commit:** `feat(main): composition root y registro del observer`
- **Listo cuando:** el flujo completo funciona (ver checklist de la sección 6).

---

## ETAPA 5 — Docker final y documentación

### [ ] S12 — `Dockerfile` del backend y compose completo (Santi)
- **Carpeta:** `backend/` y raíz
- **Archivos:** `backend/Dockerfile`, `backend/.dockerignore`, actualizar `docker-compose.yml`
- **Qué hacer:** seguir la **sección 5 de esta guía** (backend en el compose, `depends_on` con `service_healthy`, seed automático porque `main.ts` ya lo corre).
- **Commit:** `feat(docker): Dockerfile del backend y servicio en compose`
- **Listo cuando:** desde un clon limpio, `cp .env.example .env` y `docker compose up --build` levantan todo y `GET http://localhost:3000/api/health` responde.

### [ ] L12 — `README.md` y `PATTERNS.md` (Lucas)
- **Carpeta:** raíz
- **Archivos y contenido:**
  - `README.md`: la plantilla del Anexo A de la consigna, completada (dominio D, PostgreSQL + Sequelize, Forma 1, integrantes, pasos para ejecutar, variables de entorno, usuarios de prueba, cómo probar el flujo de notificaciones, tabla de endpoints de la sección 0.3).
  - `PATTERNS.md`: por cada patrón (Singleton, Observer, Factory, Adapter) y cada principio SOLID (S, O, L, I, D): 1) ruta completa del archivo, 2) qué problema resuelve en 2 o 3 oraciones, 3) un fragmento corto de código. Ubicaciones sugeridas:
    - **S:** separación controllers / services / repositories.
    - **O:** agregar un canal sin tocar `NotificationService`.
    - **L:** cualquier `INotifier` reemplaza a otro.
    - **I:** interfaces de repositorio chicas.
    - **D:** `ProductService` depende de `IProductRepository`.
- **Commit:** `docs: README y PATTERNS`
- **Listo cuando:** alguien que nunca vio el proyecto puede levantarlo solo con el README.

---

## 5. Guía de Docker (paso a paso)

### 5.1 Conceptos mínimos

- **Imagen:** una "plantilla" con todo lo necesario para correr algo (Node, tus archivos, etc.).
- **Contenedor:** una imagen en ejecución.
- **Dockerfile:** receta para **construir la imagen de tu backend**.
- **docker-compose.yml:** describe **varios contenedores juntos** (base de datos + backend) y cómo se conectan.
- **Volumen:** carpeta que Docker guarda aparte, para que los datos de la base **no se pierdan** cuando se borra el contenedor.
- **healthcheck:** un comando que Docker corre cada tanto para saber si un servicio ya está listo.

### 5.2 Archivo `.env.example` (raíz del repo)

Se versiona. Cada uno lo copia a `.env` (`cp .env.example .env`), que **no se sube** (está en `.gitignore`).

```env
# --- Base de datos ---
DB_HOST=localhost
DB_PORT=5432
DB_USER=tlp4
DB_PASSWORD=tlp4
DB_NAME=tp_integrador

# --- Backend ---
JWT_SECRET=cambiar-esto
API_PORT=3000

# --- Frontend (se usará más adelante) ---
VITE_API_URL=http://localhost:3000/api
```

`DB_HOST=localhost` es para cuando corren el backend en su compu (`npm run dev`) con la base en Docker. Cuando el backend corre **dentro de Docker**, el compose lo reemplaza por `db` (ver abajo).

### 5.3 `docker-compose.yml` (raíz del repo)

**Versión de la Etapa 1 (S2): solo la base de datos.**

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: tienda_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  db_data:
```

**Qué hace cada parte:**

| Línea | Para qué sirve |
|---|---|
| `image: postgres:16-alpine` | Usa la imagen oficial de PostgreSQL (versión liviana). |
| `restart: unless-stopped` | Si el contenedor se cae, Docker lo levanta de nuevo. |
| `environment:` | Variables que la imagen de Postgres usa para crear el usuario, la contraseña y la base la primera vez. `${DB_USER}` se lee de tu archivo `.env`. |
| `ports: "5432:5432"` | Formato `puerto-de-tu-compu:puerto-del-contenedor`. Permite conectarte desde afuera (`npm run dev`, DBeaver, etc.). Si ya tenés otro Postgres en tu compu ocupando el 5432, cambialo a `"5433:5432"` y poné `DB_PORT=5433` en tu `.env`. |
| `volumes: db_data:/var/lib/postgresql/data` | Guarda los datos de la base en el volumen `db_data`. Sin esto, los datos se pierden al borrar el contenedor. |
| `healthcheck` | `pg_isready` pregunta si Postgres ya acepta conexiones. Cada 5 segundos, hasta 10 intentos. |
| `volumes: db_data:` (al final) | Declara el volumen para poder usarlo arriba. |

**Versión final (S12): se le agrega el backend.**

```yaml
services:
  db:
    # ... igual que arriba ...

  backend:
    build: ./backend
    container_name: tienda_backend
    restart: unless-stopped
    env_file:
      - .env
    environment:
      DB_HOST: db
      DB_PORT: 5432
    ports:
      - "${API_PORT}:${API_PORT}"
    depends_on:
      db:
        condition: service_healthy

volumes:
  db_data:
```

| Línea | Para qué sirve |
|---|---|
| `build: ./backend` | Construye la imagen usando el `Dockerfile` que está en `backend/`. |
| `env_file: - .env` | Le pasa al contenedor todas las variables de tu `.env` (`JWT_SECRET`, `API_PORT`, etc.). |
| `environment: DB_HOST: db` | **Pisa** el valor del `.env`. Dentro de la red de Docker, el backend encuentra la base por el **nombre del servicio** (`db`), no por `localhost`. `DB_PORT: 5432` es el puerto interno del contenedor. |
| `ports: "${API_PORT}:${API_PORT}"` | Expone la API en tu compu (http://localhost:3000). |
| `depends_on ... service_healthy` | El backend arranca **solo cuando la base pasó el healthcheck**. Evita el error de "conexión rechazada" al inicio. |

> Más adelante, quien haga el frontend agrega un tercer servicio `frontend` con su propio `Dockerfile` dentro de `frontend/`, y su puerto.

### 5.4 `backend/Dockerfile`

```dockerfile
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

**Explicación línea por línea:**

| Línea | Qué hace |
|---|---|
| `FROM node:20-slim` | Parte de una imagen con Node 20 ya instalado. Usamos `slim` (basada en Debian) porque `bcrypt` necesita librerías nativas que suelen dar problemas en `alpine`. |
| `WORKDIR /app` | Carpeta de trabajo dentro del contenedor. Todo lo siguiente ocurre ahí. |
| `COPY package*.json ./` | Copia **primero solo** `package.json` y `package-lock.json`. |
| `RUN npm ci` | Instala las dependencias exactamente como dice el `package-lock.json` (por eso el lock debe estar en el repo). |
| `COPY . .` | Ahora sí copia el resto del código. |
| `RUN npm run build` | Compila TypeScript a JavaScript en `dist/` (necesita las dependencias de desarrollo, que `npm ci` instaló). |
| `EXPOSE 3000` | Documenta el puerto en que escucha la app. Es informativo; el que publica es el compose. |
| `CMD ["node", "dist/main.js"]` | Comando que se ejecuta cuando arranca el contenedor. |

*Por qué copiar `package.json` antes que el código:* Docker guarda cada paso en caché. Si solo cambiaste código y no dependencias, se saltea `npm ci` y construye mucho más rápido.

### 5.5 `backend/.dockerignore`

Le dice a Docker qué **no** copiar a la imagen:

```
node_modules
dist
.env
npm-debug.log
.git
```

*Por qué:* `node_modules` se reinstala dentro de la imagen (el de tu compu puede ser de otro sistema operativo) y `.env` no debe quedar guardado dentro de la imagen.

### 5.6 Comandos que van a usar

| Comando | Qué hace |
|---|---|
| `docker compose up -d db` | Levanta solo la base, en segundo plano. Para desarrollar con `npm run dev`. |
| `docker compose up --build` | Construye y levanta **todo**. Es el comando de la corrección. |
| `docker compose ps` | Muestra los servicios y si están `healthy`. |
| `docker compose logs backend` | Muestra los logs del backend (ahí aparece la línea `[NOTIFICACIÓN] ...`). |
| `docker compose logs -f backend` | Igual, pero siguiendo en vivo. |
| `docker compose down` | Apaga y borra los contenedores. **Conserva** los datos (volumen). |
| `docker compose down -v` | Apaga y **borra también los datos** (volumen). Útil para empezar de cero. |
| `docker compose exec db psql -U tlp4 -d tp_integrador` | Abre una consola SQL dentro de la base. |

### 5.7 Errores típicos

| Síntoma | Causa probable |
|---|---|
| `ECONNREFUSED` en el backend dentro de Docker | Está usando `DB_HOST=localhost`. Dentro del contenedor debe ser `db` (el compose lo fija con `environment`). |
| `ECONNREFUSED` al correr `npm run dev` | La base no está levantada: `docker compose up -d db` y esperar a `healthy`. |
| `port is already allocated` | Otro programa usa ese puerto. Cambiar el puerto de la izquierda en `ports:`. |
| `npm ci` falla en el build | Falta `package-lock.json` en el repo, o no coincide con `package.json`. |
| Cambié el `.env` y no pasó nada | Hay que recrear los contenedores: `docker compose up --build`. |
| Cambié el código y Docker sigue con la versión vieja | Faltó `--build`. |
| Error de autenticación con Postgres después de cambiar usuario o contraseña | El volumen guarda las credenciales viejas. `docker compose down -v` y volver a levantar. |
| `Cannot find module 'dist/main.js'` | El build falló o `outDir`/`rootDir` del `tsconfig.json` no coinciden con el `CMD`. |

---

## 6. Checklist final (probar juntos antes de entregar)

**Flujo completo** (con Postman o `curl`):
- [ ] Registrar un usuario nuevo: queda con rol `usuario`.
- [ ] Login con `admin@tp.com`, `operador@tp.com` y `usuario@tp.com`: devuelve token.
- [ ] `usuario` **no** puede crear, editar, cambiar estado ni borrar productos (403 directo desde Postman).
- [ ] `operador` crea y edita productos y cambia su estado, pero no puede borrar (403).
- [ ] `admin` lista usuarios y asigna un rol.
- [ ] `usuario` se suscribe a un producto; no puede suscribirse dos veces.
- [ ] `operador` cambia el estado del producto: el `usuario` ve la notificación en `GET /api/notifications` (no leída) y el contador sube.
- [ ] En `docker compose logs backend` aparece la línea `[NOTIFICACIÓN] Para: usuario@tp.com | Producto #... | Estado: ... → ...`.
- [ ] Marcar la notificación como leída baja el contador.

**Requisitos obligatorios de la consigna:**
- [ ] `"strict": true` y sin `any` sin justificar.
- [ ] `package.json` del backend solo con librerías permitidas.
- [ ] Singleton, Observer, Factory y Adapter implementados a mano (sin `EventEmitter`).
- [ ] `NotificationService` no usa `new` con canales ni `console.log`.
- [ ] `docker compose up --build` desde un clon limpio (con `cp .env.example .env`) levanta todo.
- [ ] `.env` no está en el repositorio; `.env.example` sí.
- [ ] Backend y frontend son carpetas independientes (sin `package.json` en la raíz).
- [ ] `README.md` y `PATTERNS.md` completos.
- [ ] Ambos tienen commits propios, chicos y con mensajes claros durante todo el desarrollo.

**Preparación de la defensa (los dos):**
- [ ] Puedo explicar los 4 patrones y en qué archivo está cada uno.
- [ ] Puedo explicar los 5 principios SOLID y dónde se aplican.
- [ ] Puedo agregar en vivo un canal nuevo (una clase que `implements INotifier` + un `case` en la factory + agregarlo a `CHANNELS`).
- [ ] Puedo agregar en vivo un permiso nuevo (seed + `authorize("...")` en una ruta).
