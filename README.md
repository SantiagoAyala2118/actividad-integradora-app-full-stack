# Mesa de Ayuda — TP Integrador TLP IV

**Dominio:** A — Mesa de ayuda (Ticket)
**Base de datos:** PostgreSQL + Sequelize
**Organización del backend:** Carpeta por tipo de archivo

## Integrantes
- Apellido, Nombre — usuario de GitHub
- Apellido, Nombre — usuario de GitHub
- Apellido, Nombre — usuario de GitHub

## Descripción
Aplicación full stack en TypeScript para gestionar tickets de soporte. Los usuarios se registran, inician sesión con JWT y, según su rol, pueden ver, crear, editar, cambiar de estado o eliminar tickets. Cualquier usuario puede suscribirse a un ticket, y cada vez que cambia su estado recibe una notificación in-app (con contador de no leídas) y se imprime una línea en la consola del backend.

## Requisitos previos
- Docker y Docker Compose
- Git
- (Opcional, para desarrollo local) Node.js 22 o superior

## Cómo ejecutar el proyecto

1. Clonar el repositorio:
   ```bash
   git clone [url]
   cd actividad-integradora-app-full-stack
   ```
2. Crear el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Levantar los servicios:
   ```bash
   docker compose up --build
   ```
4. El seed (roles, permisos, usuarios de prueba y dos tickets de ejemplo) se ejecuta **automáticamente** al iniciar el backend. Es idempotente: se puede reiniciar sin duplicar datos.
5. Abrir la aplicación:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000/api (healthcheck en `/api/health`)

## Ejecución sin Docker (opcional)

Con una base PostgreSQL accesible (por ejemplo, solo el servicio `db`: `docker compose up db`) y el `.env` en la raíz con `DB_HOST=localhost`:

```bash
cd backend
npm install
npm run dev
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El seed también puede ejecutarse a mano con `npm run seed` desde `backend/`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_HOST` | Host de la base de datos (en Docker se fuerza a `db`) | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `5432` |
| `DB_USER` | Usuario | `tlp4` |
| `DB_PASSWORD` | Contraseña | `tlp4` |
| `DB_NAME` | Nombre de la base | `tp_integrador` |
| `JWT_SECRET` | Clave para firmar los tokens | `cambiar-esto` |
| `JWT_EXPIRES_IN_SECONDS` | Duración del token en segundos | `28800` |
| `API_PORT` | Puerto del backend | `3000` |
| `FRONTEND_PORT` | Puerto del frontend | `5173` |
| `VITE_API_URL` | URL de la API para el frontend | `http://localhost:3000/api` |

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@tp.com | admin123 |
| operador | operador@tp.com | operador123 |
| usuario | usuario@tp.com | usuario123 |

## Cómo probar el flujo de notificaciones
1. Ingresar como `usuario` y suscribirse a un ticket (botón **Suscribirme** en el detalle).
2. En otra ventana (o en incógnito), ingresar como `operador` y cambiar el estado de ese ticket.
3. Volver a la sesión de `usuario`: la campanita muestra el contador (se actualiza cada 5 segundos) y la notificación aparece en la bandeja.
4. Verificar la notificación en la consola del backend:
   ```bash
   docker compose logs backend
   ```
   Se ve una línea como:
   ```
   [NOTIFICACIÓN] Para: usuario@tp.com | Ticket #1 "No funciona la impresora" | Estado: ABIERTO → EN_PROGRESO
   ```

## Endpoints principales

Todas las rutas (salvo registro, login y health) requieren el header `Authorization: Bearer <token>`. Sin el permiso necesario responden `403`.

| Método | Ruta | Permiso requerido |
|---|---|---|
| POST | /api/auth/register | — |
| POST | /api/auth/login | — |
| GET | /api/auth/me | (autenticado) |
| GET | /api/tickets | ticket:read |
| GET | /api/tickets/:id | ticket:read |
| POST | /api/tickets | ticket:create |
| PUT | /api/tickets/:id | ticket:update |
| PATCH | /api/tickets/:id/status | ticket:change-status |
| DELETE | /api/tickets/:id | ticket:delete |
| GET | /api/subscriptions | ticket:read (devuelve los IDs de tickets que sigo) |
| POST | /api/subscriptions `{ ticketId }` | subscription:create |
| DELETE | /api/subscriptions/:ticketId | subscription:delete |
| GET | /api/notifications | notification:read |
| GET | /api/notifications/unread-count | notification:read |
| PATCH | /api/notifications/:id/read | notification:read |
| PATCH | /api/notifications/read-all | notification:read |
| GET | /api/users | user:read |
| GET | /api/users/roles | user:read |
| PATCH | /api/users/:id/role `{ role }` | user:assign-role |

## Patrones y principios SOLID
Ver [PATTERNS.md](./PATTERNS.md).
