import { Router } from "express";
import type {
  curso,
  crearCurso,
  actualizarCurso,
} from "../types/curso.types.js";
import type { Request, Response } from "express";

const router = Router();

let listaCursos: curso[] = [
  {
    id: 1,
    titulo: "programacion",
    duracionSemanas: 16,
    publicado: true,
  },
  {
    id: 2,
    titulo: "Ingles Elementary",
    duracionSemanas: 4,
    publicado: true,
  },
  {
    id: 3,
    titulo: "ingles A1",
    duracionSemanas: 4,
    publicado: true,
  },
  {
    id: 4,
    titulo: "ingles A2",
    duracionSemanas: 8,
    publicado: true,
  },
];
function setListaCursos(listanueva: curso[]) {
  listaCursos = listanueva;
}

router.get("/", function (req: Request, res: Response) {
  /*
    #swagger.tags = ['Cursos']
    #swagger.summary = 'ver todos los cursos'
    #swagger.responses[200] = {
      description: 'Lista de cursos',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            titulo: { type: 'string', example: 'programacion' },
            duracionSemanas: { type: 'number', example: 16 },
            publicado: { type: 'boolean', example: true }
          }
        }
      }
    }
  */
  res.json(listaCursos);
});

router.post("/", function (req: Request<{}, {}, crearCurso>, res: Response) {
  /*
    #swagger.tags = ['Cursos']
    #swagger.summary = 'crear un producto'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos para crear un curso nuevo',
      required: true,
      schema: {
        $titulo: "Programacion web",
        $duracionSemanas: 16
      }
    }
  */
  const { titulo, duracionSemanas } = req.body;
  if (!titulo || !duracionSemanas) {
    return res.status(400).json({ error: "faltan datos q son obligatorios" });
  }
  const nuevoCurso: curso = {
    id: listaCursos.length > 0 ? listaCursos.length + 1 : 1,
    titulo,
    duracionSemanas,
    publicado: true,
  };
  listaCursos.push(nuevoCurso);
  res.status(201).json(nuevoCurso);
});

router.put(
  "/:id",
  function (req: Request<{ id: string }, {}, actualizarCurso>, res: Response) {
    /*
      #swagger.tags = ['Cursos']
      #swagger.summary = 'actualizar un curso existente'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del curso a actualizar',
        required: true,
        type: 'integer'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar del curso',
        required: true,
        schema: {
          titulo: "Programacion web",
          duracionSemanas: 16,
          publicado: true
        }
      }
    */
    const idBuscado = Number(req.params.id);
    const index = listaCursos.findIndex(function (e) {
      return e.id === idBuscado;
    });
    if (index === -1) {
      return res.status(404).json({ error: "curso no encontrado >:c" });
    } else {
      const { titulo, duracionSemanas, publicado } = req.body;
      // actualizando la informacion del usuario
      listaCursos[index] = {
        id: idBuscado,
        titulo: titulo ?? listaCursos[index]?.titulo,
        duracionSemanas: duracionSemanas ?? listaCursos[index]?.duracionSemanas,
        publicado: publicado ?? listaCursos[index]?.publicado,
      };
      res.json(listaCursos[index]);
    }
  },
);

router.delete("/:id", function (req: Request, res: Response) {
  /*
    #swagger.tags = ['Cursos']
    #swagger.summary = 'eliminar un curso'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del curso a eliminar',
      required: true,
      type: 'integer'
    }
  */
  const idBuscado = Number(req.params.id);
  const index = listaCursos.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "curso no encontrado no podemos eliminarlo" });
  } else {
    let Listanueva = listaCursos.filter((e) => e.id !== idBuscado);
    setListaCursos(Listanueva);
    res.json({ mensaje: "Curso ELIMINADO EXITOSAMENTE" });
  }
});

export default router;
