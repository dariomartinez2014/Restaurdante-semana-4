import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;

pool
  .query("SELECT NOW()")
  .then((resultado) => {
    console.log("✅ Conectado a PostgreSQL");
    console.log("Hora de PostgreSQL:", resultado.rows[0]);
  })
  .catch((error) => {
    console.error("❌ Error al conectar a PostgreSQL:", error.message);
  });