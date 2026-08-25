import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import pedidosRouter from "./routes/pedidos.routes.js";
import clientesRouter from "./routes/clientes.routes.js";
import productoRouter from "./routes/producto.routes.js";

import { pool } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Servidor corriendo exitosamente",
  });
});

// Prueba de conexión a PostgreSQL
app.get("/db-test", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Conexión exitosa a PostgreSQL",
      fechaServidor: result.rows[0].now,
    });
  } catch (error) {
    console.error("Error al consultar PostgreSQL:", error);

    res.status(500).json({
      message: "Error al conectar con PostgreSQL",
    });
  }
});

// Rutas del proyecto
app.use("/pedidos", pedidosRouter);
app.use("/clientes", clientesRouter);
app.use("/productos", productoRouter);

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

  try {
    const result = await pool.query("SELECT NOW()");
    console.log(
      `Conectado a PostgreSQL. Hora del servidor: ${result.rows[0].now}`,
    );
  } catch (error) {
    console.error("Error en la conexión a PostgreSQL:", error);
  }
});