import express from "express";
import type { Request, Response } from "express";
import pedidosRouter from "./routes/pedidos.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import productosRouter from "./routes/productos.routes.js";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/productos", async function (req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM pedidos;");
    res.json({
      message: "Conexion exitosa a la base de datos :D",
      total: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
});

app.get("db-test", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM pedidos;");
    res.json({
      message: "coneccion exitosa a la base de datos",
      total: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error("error al consultar en la base de datos");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos",
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "servidor corriendo exitosamente",
  });
});

app.use("/pedidos", pedidosRouter);

// aplicacion escuchando el puerto 3000
app.listen(PORT, async function () {
  console.log("servidor corriendo en http://localhost" + PORT);
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(
      `CONECTADO A POSTGRESQL CON EXITO HORA DEL SERVIDOR ${res.rows[0].now}`,
    );
  } catch (error) {
    console.log("ERROR EN LA CONEXION");
  }
});
