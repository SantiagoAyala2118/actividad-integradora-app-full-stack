import { Sequelize } from 'sequelize';
import { env } from '../config/env';

/**
 * Singleton: encapsula la única instancia de Sequelize de toda la aplicación.
 */
export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private readonly sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
      host: env.db.host,
      port: env.db.port,
      dialect: 'postgres',
      logging: false,
    });
  }

  static getInstance(): DatabaseConnection {
    if (DatabaseConnection.instance === null) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  getSequelize(): Sequelize {
    return this.sequelize;
  }

  /** Intenta conectar varias veces (útil cuando la base todavía está arrancando). */
  async connect(retries = 10, delayMs = 2000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.sequelize.authenticate();
        console.log('[DB] Conexión establecida');
        return;
      } catch (error) {
        console.log(`[DB] Intento ${attempt}/${retries} fallido, reintentando...`);
        if (attempt === retries) throw error;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  async sync(): Promise<void> {
    await this.sequelize.sync();
  }

  async close(): Promise<void> {
    await this.sequelize.close();
  }
}
