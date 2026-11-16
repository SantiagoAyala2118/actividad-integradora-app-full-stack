import path from 'path';
import dotenv from 'dotenv';

// Primero el .env de la carpeta actual y luego el de la raíz del repo (no pisa valores ya cargados).
dotenv.config({ quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), '../.env'), quiet: true });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

export const env = {
  port: Number(required('API_PORT', '3000')),
  jwtSecret: required('JWT_SECRET', 'cambiar-esto'),
  jwtExpiresInSeconds: Number(required('JWT_EXPIRES_IN_SECONDS', '28800')),
  db: {
    host: required('DB_HOST', 'localhost'),
    port: Number(required('DB_PORT', '5432')),
    user: required('DB_USER', 'tlp4'),
    password: required('DB_PASSWORD', 'tlp4'),
    name: required('DB_NAME', 'tp_integrador'),
  },
} as const;
