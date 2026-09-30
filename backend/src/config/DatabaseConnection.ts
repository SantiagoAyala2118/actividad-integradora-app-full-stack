import { Sequelize } from "sequelize";

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(
      DatabaseConnection.getEnv("DB_NAME"),
      DatabaseConnection.getEnv("DB_USER"),
      DatabaseConnection.getEnv("DB_PASSWORD"),
      {
        host: DatabaseConnection.getEnv("DB_HOST"),
        port: Number(DatabaseConnection.getEnv("DB_PORT")),
        dialect: "postgres",
        logging: false,
      },
    );
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  getSequelize(): Sequelize {
    return this.sequelize;
  }

  private static getEnv(name: string): string {
    const value = process.env[name];
    if (!value)
      throw new Error(
        `Variable de entorno ${name} no existente o no encontrada`,
      );
    return value;
  }
}
