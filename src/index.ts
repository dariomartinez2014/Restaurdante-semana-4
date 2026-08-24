import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import repartidoresRouter from "./routes/repartidores.routes.js";
import clientesRouter from "./routes/clientes.routes.js";
import pedidosRouter from "./routes/pedidos.routes.js";
import productosRouter from "./routes/productos.routes.js";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import { poolRepartidores } from "./data/repartidores.data.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerFilePath = path.resolve("./src/swagger-output.json");
if (fs.existsSync(swaggerFilePath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("archivo swagger-output.json no encontrado");
}

app.get("/", (req: Request, res: Response) => {
  res.send("El servidor esta en pie");
});

app.use("/repartidor", repartidoresRouter);
app.use("/clientes", clientesRouter);
app.use("/productos", productosRouter);
app.use("/pedidos", pedidosRouter);

// aplicacion escuchando el puerto 3000
app.listen(PORT, async () => {
  console.log(`servidor corriendo en el puerto : http://localhost:${PORT}`);
  try {
    const res = await poolRepartidores.query("SELECT NOW()");
    console.log(`CONECTO A POSTGRESQL CON EXITO, HORA: ${res.rows[0].now}`);
  } catch (error) {
    console.log("ERRO EN LA CONEXION");
  }
});
