import express from "express";
import type { Request, Response, NextFunction } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { json } from "node:stream/consumers";
const app = express();
const PORT = 3000;

//MIDDLEWARE ENTENDAMOS JSON EN EL BODY
app.use(express.json());

//middaleware para registrar las peticiones QUE SE REALIZAN
app.use(function (req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

interface estudiante {
  id: number;
  nombre: string;
  pais: string;
  edad: number;
  activo: boolean;
  notas: number[];
}
//SIMULACION DE BASE DE DATOS
let listaEstudiantesFunvaleros: estudiante[] = [];

async function cargarDatos() {
  try {
    const ruta = path.resolve("src/ejercicio.json");
    const data = await fs.readFile(ruta, "utf-8");
    listaEstudiantesFunvaleros = JSON.parse(data);
    console.log(listaEstudiantesFunvaleros);
    console.log(
      `DATOS CARGADOS EN MEMORIA: ${listaEstudiantesFunvaleros.length} estudiantse cargados`,
    );
  } catch (error) {
    console.log("No se encontraron estudiantes en la lista o lista vacia");
    listaEstudiantesFunvaleros = [];
  }
}

// funcion para traer del archivo ejercicio.json y convertirlo en un array de estudiante
/* async function obtenerEstudiantes(): Promise<estudiante[]> {
  const ruta = path.resolve("src/ejercicio.json");
  const texto = await fs.readFile(ruta, "utf-8");
  return JSON.parse(texto);
} */

//endpoints
app.get("/", async function (req: Request, res: Response) {
  res.send("Servidor Vivo");
});

//endpoint para traer a todos los estudiantes
app.get("/estudiantes", async function (req: Request, res: Response) {
  res.json(listaEstudiantesFunvaleros);
});

//endpoint para traer a a un estudiante especifico x su id
app.get("/estudiantes/:id", async function (req: Request, res: Response) {
  let idBuscado = Number(req.params.id);
  const encontrado = listaEstudiantesFunvaleros.filter(
    (e) => e.id === idBuscado,
  );
  if (encontrado.length > 0) {
    res.json(encontrado);
  } else {
    return res.status(404).json({ error: "Estudiante no encontrado" });
  }
});

//CREAR UN ESTUDIANTE NUEVO METODO POST
interface crearEstudiante {
  nombre: string;
  pais: string;
  edad: number;
  notas?: number[];
}
/* 
  nombre:"selec password from usuarios"
*/
app.post(
  "/estudiantes",
  function (req: Request<{}, {}, crearEstudiante>, res: Response) {
    const { nombre, pais, edad, notas } = req.body;
    if (!nombre || !pais || !edad) {
      return res.status(400).json({ error: "faltan datos q son obligatorios" });
    }
    const nuevoEstudiante: estudiante = {
      id:
        listaEstudiantesFunvaleros.length > 0
          ? listaEstudiantesFunvaleros.length + 1
          : 1,
      nombre,
      pais,
      edad,
      activo: true,
      notas: notas ?? [],
    };
    listaEstudiantesFunvaleros.push(nuevoEstudiante);
    res.status(201).json(nuevoEstudiante);
  },
);

// aplicacion escuchando el puerto 3000
app.listen(PORT, async function () {
  await cargarDatos();

  console.log(`servidor corriendo en el puerto : http://localhost:${PORT}`);
});
