import { Router } from "express";
import type { Request, Response } from "express";
import {
  listaRepartidores,
  setListaRepartidores,
} from "../data/repartidores.data.js";

import type {
  repartidores,
  crearRepartidor,
  actualizarRepartidor,
  repartidoresFiltrados,
  pedidosParams,
} from "../types/repartidores.types.js";

const router = Router();

//endpoints

router.get(
  "/",
  function (req: Request<{}, {}, {}, repartidoresFiltrados>, res: Response) {
    // #swagger.tags = ['Repartidores']
    // #swagger.description = 'Obtiene la lista de repartidores con filtros'
    /*  #swagger.parameters['activo'] = {
            in: 'query',
            description: 'Estado del repartidor (true o false)',
            type: 'string'
    } */

    const activo = req.query.activo;
    let resultado = [...listaRepartidores];

    //filtro para el estado activo del repartidor
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

//endpoint para traer a un repartidor especifico por su id

router.get("/:id", function (req: Request<pedidosParams>, res: Response) {
  // #swagger.tags = ['Repartidores']
  // #swagger.description = 'Obtiene la informacion de un repartidor en especifico por su id'
  /*  #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID del repartidor a buscar',
          required: true,
          type: 'integer'
  } */
  const idBuscado = Number(req.params.id); //Number("Marco") === 32

  if (isNaN(idBuscado)) {
    return res
      .status(400)
      .json({ error: "El parametro id debe ser un numero valido" });
  }
  const repartidorFiltrado = listaRepartidores.find((e) => e.id === idBuscado);

  if (!repartidorFiltrado) {
    return res
      .status(404)
      .json({ error: "no existe un repartidor con ese ID" });
  }
  return res.json(repartidorFiltrado);
});

//CREAR UN REPARTIDOR NUEVO METODO POST

router.post(
  "/",
  function (req: Request<{}, {}, crearRepartidor>, res: Response) {
    /*
      #swagger.tags = ['Repartidores']
      #swagger.summary = 'crear un repartidor nuevo'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para crear un repartidor nuevo',
        required: true,
        schema: {
          $nombre: "Marco",
          $vehiculo: "2507FRT",
          $telefono: "75060047",
          $activo: true
        }
      }
    */
    const { nombre, vehiculo, telefono, activo } = req.body;
    if (!nombre || !vehiculo || !telefono || activo === undefined) {
      return res
        .status(400)
        .json({ error: "faltan datos que son obligatorios" });
    }
    if (activo !== true && activo !== false) {
      return res.status(400).json({
        error: "El campo activo solamente puede ser true o false",
      });
    }
    const nuevoRepartidor: repartidores = {
      id: listaRepartidores.length > 0 ? listaRepartidores.length + 1 : 1,
      nombre,
      vehiculo,
      telefono,
      activo,
      pedidosAsignados: [],
    };
    listaRepartidores.push(nuevoRepartidor);
    res.status(201).json(nuevoRepartidor);
  },
);

router.put("/:id", function (req: Request, res: Response) {
  /*
    #swagger.tags = ['Repartidores']
    #swagger.summary = 'actualizar un repartidor existente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del repartidor a actualizar',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del repartidor',
      required: true,
      schema: {
        vehiculo: "4065GED",
        telefono: "60949745",
        activo: true
      }
    }
  */
  const idBuscado = Number(req.params.id);
  const index = listaRepartidores.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res.status(404).json({ error: "Repartidor no encontrado" });
  } else {
    const repartidor = listaRepartidores[index]!;
    const { vehiculo, activo, telefono }: actualizarRepartidor = req.body;

    // Validando que activo solamente sea true o false
    if (activo !== undefined && activo !== true && activo !== false) {
      return res.status(400).json({
        error: "El campo activo solamente puede ser true o false",
      });
    }
    // actualizando la informacion del usuario
    listaRepartidores[index] = {
      id: idBuscado,
      nombre: repartidor.nombre,
      vehiculo: vehiculo ?? listaRepartidores[index]?.vehiculo,
      activo: activo ?? listaRepartidores[index]?.activo,
      pedidosAsignados: repartidor.pedidosAsignados,
      telefono: telefono ?? listaRepartidores[index]?.telefono,
    };
    res.json(listaRepartidores[index]);
  }
});
//ELIMINACION DE UN REPARTIDOR
router.delete("/:id", function (req: Request, res: Response) {
  /*
    #swagger.tags = ['Repartidores']
    #swagger.summary = 'eliminar un repartidor'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del repartidor a eliminar',
      required: true,
      type: 'integer'
    }
  */
  const idBuscado = Number(req.params.id);
  const index = listaRepartidores.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "Repartidor no encontrado no podemos eliminarlo" });
  } else {
    let Listanueva = listaRepartidores.filter((e) => e.id !== idBuscado);
    setListaRepartidores(Listanueva);
    res.json({ mensaje: "REPARTIDOR ELIMINADO EXITOSAMENTE" });
  }
});

export default router;
