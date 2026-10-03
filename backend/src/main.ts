import "dotenv/config";
import { DatabaseConnection } from "./config/DatabaseConnection.ts";
import "./models/index.ts";

async function main() {
  const sequelize = DatabaseConnection.getInstance().getSequelize();
  await sequelize.authenticate();
  await sequelize.sync();
  console.log("Tablas creadas");

  console.log(sequelize.getDatabaseName());
  console.log(await sequelize.getQueryInterface().showAllTables());
}

main().catch((error) => {
  console.error("Error al iniciar:", error);
  process.exit(1);
});
