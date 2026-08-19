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
interface estudiantesFiltrados {
  nombre?: string;
  pais?: string;
  minEdad?: string;
  activo?: string;
}

app.get(
  "/estudiantes",
  function (req: Request<{}, {}, {}, estudiantesFiltrados>, res: Response) {
    const { activo, nombre, pais, minEdad } = req.query;
    let resultado = [...listaEstudiantesFunvaleros];

    //FILTRO PARA EL PAIS mayusculas y minusculas irrelevantes
    if (pais) {
      resultado = resultado.filter(
        (e) => e.pais.toLowerCase() === pais.toLowerCase(),
      );
    }
    //filtro POR EL NOMBRE indiferente a si esta minusculas o mayusculas
    if (nombre) {
      resultado = resultado.filter(
        (e) => e.nombre.toLowerCase() === nombre.toLowerCase(),
      );
    }
    //filtro por edad minima
    if (minEdad) {
      const edadNumerica = Number(minEdad);
      if (!isNaN(edadNumerica)) {
        resultado = resultado.filter((e) => e.edad >= edadNumerica);
      } else {
        return res.json({ error: "la edad minima debe ser un Numero" });
      }
    }
    //filtro para el estado activo de mi estudiante
    if (activo) {
      if (activo.toLowerCase() === "true" || activo.toLowerCase() === "false") {
        const esActivo = activo.toLowerCase() === "true";
        resultado = resultado.filter((e) => e.activo === esActivo);
      } else {
        return res.json({ error: "el estado activo debe ser true o false" });
      }
    }

    // mostrar el resultado filtrado
    return res.json({
      total: resultado.length,
      datos: resultado,
    });
  },
);

//endpoint para traer a a un estudiante especifico x su id
interface idParam {
  id: string;
}
app.get("/estudiantes/:id", function (req: Request<idParam>, res: Response) {
  const idBuscado = Number(req.params.id); //Number("juan") === 32

  if (isNaN(idBuscado)) {
    return res
      .status(400)
      .json({ error: "El parametro id debe ser un numero valido" });
  }
  const estudianteFiltrado = listaEstudiantesFunvaleros.find(
    (e) => e.id === idBuscado,
  );

  if (!estudianteFiltrado) {
    return res
      .status(404)
      .json({ error: "no existe un estudiante con ese ID" });
  }
  return res.json(estudianteFiltrado);
});

//CREAR UN ESTUDIANTE NUEVO METODO POST
interface crearEstudiante {
  nombre: string;
  pais: string;
  edad: number;
  notas?: number[];
}

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

interface actualizarEstudiante {
  nombre: string;
  pais: string;
  edad: number;
  activo: boolean;
  notas: number[];
}
app.put("/estudiantes/:id", function (req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const index = listaEstudiantesFunvaleros.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res.status(404).json({ error: "estudiante no encontrado >:c" });
  } else {
    const { nombre, pais, edad, activo, notas }: actualizarEstudiante =
      req.body;
    // actualizando la informacion del usuario
    listaEstudiantesFunvaleros[index] = {
      id: idBuscado,
      nombre: nombre ?? listaEstudiantesFunvaleros[index]?.nombre,
      pais: pais ?? listaEstudiantesFunvaleros[index]?.pais,
      edad: edad ?? listaEstudiantesFunvaleros[index]?.edad,
      activo: activo ?? listaEstudiantesFunvaleros[index]?.activo,
      notas: notas ?? listaEstudiantesFunvaleros[index]?.notas,
    };
    res.json(listaEstudiantesFunvaleros[index]);
  }
});
// delete ELIMINACION DE UN REGISTRO :C
app.delete("/estudiantes/:id", function (req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const index = listaEstudiantesFunvaleros.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "estudiante no encontrado no podemos eliminarlo" });
  } else {
    listaEstudiantesFunvaleros = listaEstudiantesFunvaleros.filter(
      (e) => e.id !== idBuscado,
    );
    res.json({ mensaje: "ESTUDIANTE ELIMINADO EXITOSAMENTE" });
  }
});

// aplicacion escuchando el puerto 3000
app.listen(PORT, async function () {
  await cargarDatos();

  console.log(`servidor corriendo en el puerto : http://localhost:${PORT}`);
});
