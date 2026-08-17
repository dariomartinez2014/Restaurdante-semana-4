import express from "express";
import type { Request, Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";
const app = express();
const PORT = 3000;

interface estudiante {
  id: number;
  nombre: string;
  pais: string;
  edad: number;
  activo: boolean;
  notas: number[];
}
// funcion para traer del archivo ejercicio.json y convertirlo en un array de estudiante
async function obtenerEstudiantes(): Promise<estudiante[]> {
  const ruta = path.resolve("src/ejercicio.json");
  const texto = await fs.readFile(ruta, "utf-8");
  return JSON.parse(texto);
}

//endpoints
app.get("/", async function (req: Request, res: Response) {
  res.send("Servidor Vivo");
});

//endpoint para traer a todos los estudiantes
app.get("/estudiantes", async function (req: Request, res: Response) {
  const lista = await obtenerEstudiantes();
  res.json(lista);
});

//endpoint para traer a a un estudiante especifico x su id
app.get("/estudiantes/:id", async function (req: Request, res: Response) {
  let idBuscado = Number(req.params.id);
  const lista = await obtenerEstudiantes();
  const encontrado = lista.filter((e) => e.id === idBuscado);
  if (encontrado.length > 0) {
    res.json(encontrado);
  } else {
    return res.status(404).json({ error: "Estudiante no encontrado" });
  }
});

//

// aplicacion escuchando el puerto 3000
app.listen(PORT, function () {
  console.log(`servidor corriendo en el puerto : http://localhost:${PORT}`);
});
