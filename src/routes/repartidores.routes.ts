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

    /*  #swagger.parameters['vehiculo'] = {
            in: 'query',
            description: 'Filtrar por vehiculo (insensible a mayúsculas)',
            type: 'string'
    } */
    /*  #swagger.parameters['nombre'] = {
            in: 'query',
            description: 'Filtrar por nombre exacto',
            type: 'string'
    } */
    /*  #swagger.parameters['activo'] = {
            in: 'query',
            description: 'Estado del repartidor (true o false)',
            type: 'string'
    } */

    const { activo, nombre, vehiculo } = req.query;
    let resultado = [...listaRepartidores];

    //FILTRO PARA EL VEHICULO mayusculas y minusculas irrelevantes
    if (vehiculo) {
      resultado = resultado.filter(
        (e) => e.vehiculo.toLowerCase() === vehiculo.toLowerCase(),
      );
    }
    //filtro POR EL NOMBRE indiferente a si esta minusculas o mayusculas
    if (nombre) {
      resultado = resultado.filter(
        (e) => e.nombre.toLowerCase() === nombre.toLowerCase(),
      );
    }

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
          $nombre: "Marco rojas",
          $vehiculo: "2507FRT",
          pedidosAsignados: [1,3,8]
        }
      }
    */
    const { nombre, vehiculo, pedidosAsignados } = req.body;
    if (!nombre || !vehiculo || !pedidosAsignados) {
      return res
        .status(400)
        .json({ error: "faltan datos que son obligatorios" });
    }
    const nuevoRepartidor: repartidores = {
      id: listaRepartidores.length > 0 ? listaRepartidores.length + 1 : 1,
      nombre,
      vehiculo,
      activo: true,
      pedidosAsignados: pedidosAsignados ?? [],
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
        nombre: "Marco Nuñez",
        vehiculo: "4065GED",
        activo: true,
        pedidosAsignados: [1, 2, 20, 10]
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
    const { nombre, vehiculo, activo, pedidosAsignados }: actualizarRepartidor =
      req.body;
    // actualizando la informacion del usuario
    listaRepartidores[index] = {
      id: idBuscado,
      nombre: nombre ?? listaRepartidores[index]?.nombre,
      vehiculo: vehiculo ?? listaRepartidores[index]?.vehiculo,
      activo: activo ?? listaRepartidores[index]?.activo,
      pedidosAsignados:
        pedidosAsignados ?? listaRepartidores[index]?.pedidosAsignados,
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

//rutas dinamicas anidadas

router.get(
  "/:id/pedidosAsignados/:pedidoAsignadoIndex",
  function (req: Request<pedidosParams>, res: Response) {
    /*
      #swagger.tags = ['Repartidores']
      #swagger.summary = 'ver un pedido especifico de un repartidor'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del repartidor',
        required: true,
        type: 'integer'
      }
      #swagger.parameters['pedidoAsignadoIndex'] = {
        in: 'path',
        description: 'Indice del id del pedido dentro del arreglo de pedidos asignados',
        required: true,
        type: 'integer'
      }
    */
    const idRepartidor = Number(req.params.id);
    const index = Number(req.params.pedidoAsignadoIndex);

    const repartidor = listaRepartidores.find((e) => e.id === idRepartidor);

    if (!repartidor) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    if (index < 0 || index >= repartidor.pedidosAsignados.length) {
      return res.status(400).json({ error: "ese pedido no existe" });
    }

    return res.json({
      repartidor: repartidor.nombre,
      pedidoAsignadoIndice: index,
      idPedido: repartidor.pedidosAsignados[index],
    });
  },
);

export default router;
