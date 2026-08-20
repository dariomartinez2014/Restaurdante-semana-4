import { Router } from "express";
import type { Request, Response } from "express";
import {
  listaEstudiantesFunvaleros,
  setListaEstudiantes,
} from "../data/estudiantes.data.js";

import type {
  estudiante,
  crearEstudiante,
  actualizarEstudiante,
  estudiantesFiltrados,
  idParam,
  notasParams,
} from "../types/estudiante.types.js";
const router = Router();

//endpoints

router.get(
  "/",
  function (req: Request<{}, {}, {}, estudiantesFiltrados>, res: Response) {
    // #swagger.description = 'Obtiene la lista de estudiantes con filtros opcionales'

    /*  #swagger.parameters['pais'] = {
            in: 'query',
            description: 'Filtrar por país (insensible a mayúsculas)',
            type: 'string'
    } */
    /*  #swagger.parameters['nombre'] = {
            in: 'query',
            description: 'Filtrar por nombre exacto',
            type: 'string'
    } */
    /*  #swagger.parameters['minEdad'] = {
            in: 'query',
            description: 'Edad mínima requerida',
            type: 'integer'
    } */
    /*  #swagger.parameters['activo'] = {
            in: 'query',
            description: 'Estado del estudiante (true o false)',
            type: 'string'
    } */
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
      if (isNaN(edadNumerica)) {
        return res.json({ error: "la edad minima debe ser un Numero" });
      }
      resultado = resultado.filter((e) => e.edad >= edadNumerica);
    }
    //filtro para el estado activo de mi estudiante
    if (activo) {
      if (activo.toLowerCase() !== "true" && activo.toLowerCase() !== "false") {
        return res.json({ error: "el estado activo debe ser true o false" });
      }
      const esActivo = activo.toLowerCase() === "true";
      resultado = resultado.filter((e) => e.activo === esActivo);
    }

    // mostrar el resultado filtrado
    return res.json({
      total: resultado.length,
      datos: resultado,
    });
  },
);

//endpoint para traer a a un estudiante especifico x su id

router.get("/:id", function (req: Request<idParam>, res: Response) {
  // #swagger.description = 'Obtiene la informacion de un estudiante en especifico por su id'
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

router.post(
  "/",
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

router.put("/:id", function (req: Request, res: Response) {
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
router.delete("/:id", function (req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const index = listaEstudiantesFunvaleros.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "estudiante no encontrado no podemos eliminarlo" });
  } else {
    let Listanueva = listaEstudiantesFunvaleros.filter(
      (e) => e.id !== idBuscado,
    );
    setListaEstudiantes(Listanueva);
    res.json({ mensaje: "ESTUDIANTE ELIMINADO EXITOSAMENTE" });
  }
});

//rutas dinamicas anidadas

router.get(
  "/:id/notas/:notaIndex",
  function (req: Request<notasParams>, res: Response) {
    const idEstudiante = Number(req.params.id);
    const index = Number(req.params.notaIndex);

    const estudianteFunval = listaEstudiantesFunvaleros.find(
      (e) => e.id === idEstudiante,
    );

    if (!estudianteFunval) {
      return res.status(404).json({ error: "estudiante no encontrado" });
    }

    if (index < 0 || index >= estudianteFunval.notas.length) {
      return res.status(400).json({ error: "nota no valida" });
    }

    return res.json({
      estudiante: estudianteFunval.nombre,
      notaIndice: index,
      calificacion: estudianteFunval.notas[index],
    });
  },
);

export default router;
