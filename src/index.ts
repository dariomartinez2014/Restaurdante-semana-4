import express from "express";
import type { Request, Response, NextFunction } from "express";
import { cargarDatos } from "./data/estudiantes.data.js";
import estudiantesRouter from "./routes/estudiantes.routes.js";
import cursoRouter from "./routes/cursos.routes.js";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

const swaggerFilePath = path.resolve("./src/swagger-output.json");
if (fs.existsSync(swaggerFilePath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("archivo swagger-output.json no encontrado");
}

app.get("/", (req: Request, res: Response) => {
  res.send("Servidor Vivo");
});
app.use("/estudiante", estudiantesRouter);
app.use("/cursos", cursoRouter);
// aplicacion escuchando el puerto 3000
app.listen(PORT, async () => {
  await cargarDatos();
  console.log(`servidor corriendo en el puerto : http://localhost:${PORT}`);
});
