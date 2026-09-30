import "dotenv/config";

import { DatabaseConnection } from "./config/DatabaseConnection.ts";

async function main() {
  const a = DatabaseConnection.getInstance();
  const b = DatabaseConnection.getInstance();

  await a.getSequelize().authenticate();
  console.log("¿Misma instancia?", a === b); // true
}
console.log("Conectado a PostgreSQL");

main().catch((error) => {
  console.error("Error al iniciar:", error);
  process.exit(1);
});
