import { Router } from "express";
import type { Request, Response } from "express";
import { listaPedidos } from "../data/pedidos.data.js";
import { listaClientes } from "../data/clientes.js";

import type {
  Pedido,
  crearPedido,
  actualizarPedido,
  pedidosFiltrados,
  idParams,
} from "../types/pedidos.types.js";

const router = Router();

// GET /pedidos
// Lista todos los pedidos y permite filtrar por estado
router.get(
  "/",
  function (req: Request<{}, {}, {}, pedidosFiltrados>, res: Response) {
    /*
      #swagger.tags = ['Pedidos']
      #swagger.summary = 'Obtener todos los pedidos'
      #swagger.description = 'Obtiene la lista de pedidos y permite filtrarlos por estado'

      #swagger.parameters['estado'] = {
        in: 'query',
        description: 'Filtrar pedidos por estado',
        required: false,
        type: 'boolean'
      }
    */

    const estado = req.query.estado;

    let resultado = [...listaPedidos];

    if (estado) {
      if (estado.toLowerCase() !== "true" && estado.toLowerCase() !== "false") {
        return res.json({ error: "el estado activo debe ser true o false" });
      }
      const entregado = estado.toLowerCase() === "true";
      resultado = resultado.filter((e) => e.estado === entregado);
    }

    return res.json({
      total: resultado.length,
      datos: resultado,
    });
  },
);

// GET /pedidos/:id
// Buscar un pedido específico
router.get("/:id", function (req: Request<idParams>, res: Response) {
  /*
      #swagger.tags = ['Pedidos']
      #swagger.summary = 'Obtener un pedido por ID'

      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del pedido',
        required: true,
        type: 'integer'
      }
    */

  const idBuscado = Number(req.params.id);

  if (isNaN(idBuscado)) {
    return res.status(400).json({
      error: "El id debe ser un número válido",
    });
  }

  const pedido = listaPedidos.find((e) => e.id === idBuscado);

  if (!pedido) {
    return res.status(404).json({
      error: "No existe un pedido con ese ID",
    });
  }

  return res.json(pedido);
});

// POST /pedidos
// Crear un pedido
router.post("/", function (req: Request<{}, {}, crearPedido>, res: Response) {
  /*
  #swagger.tags = ['Pedidos']
  #swagger.summary = 'Crear un nuevo pedido'

  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Datos necesarios para crear un pedido',
    required: true,
    schema: {
      type: 'object',
      properties: {
        clienteId: {
          type: 'integer',
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          description: 'ID del cliente'
        },
        detalles: {
          type: 'string',
          example: '2 hamburguesas y 1 gaseosa'
        },
        total: {
          type: 'number',
          example: 80
        }
      },
      required: ['clienteId', 'detalles', 'total']
    }
  }
*/

  const { clienteId, detalles, total } = req.body;

  // Verificar que el cliente exista

  const cliente = listaClientes.find((e) => e.id === clienteId);

  if (!cliente) {
    return res.status(404).json({
      error: "No existe un cliente con ese ID",
    });
  }

  // Validar datos obligatorios

  if (clienteId === undefined || !detalles || total === undefined) {
    return res.status(400).json({
      error: "Faltan datos obligatorios",
    });
  }

  // Crear pedido

  const nuevoPedido: Pedido = {
    id:
      listaPedidos.length > 0
        ? listaPedidos[listaPedidos.length - 1]!.id + 1
        : 1,

    clienteId,
    detalles,
    total,

    // Todo pedido nuevo empieza como false
    estado: false,
  };

  listaPedidos.push(nuevoPedido);

  return res.status(201).json({
    mensaje: "Pedido creado exitosamente",
    pedido: nuevoPedido,
  });
});

// PUT /pedidos/:id
// Actualizar el estado del pedido
router.put(
  "/:id",
  function (req: Request<idParams, {}, actualizarPedido>, res: Response) {
    /*
      #swagger.tags = ['Pedidos']
      #swagger.summary = 'Actualizar el estado de un pedido'

      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del pedido',
        required: true,
        type: 'integer'
      }

      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Cambiar el estado del pedido',
        required: true,
        schema: {
          estado: true
        }
      }
    */

    const idBuscado = Number(req.params.id);

    const index = listaPedidos.findIndex((e) => e.id === idBuscado);

    if (index === -1) {
      return res.status(404).json({
        error: "Pedido no encontrado",
      });
    }

    const { estado } = req.body;

    if (typeof estado !== "boolean") {
      return res.status(400).json({
        error: "El estado debe ser true o false",
      });
    }

    listaPedidos[index]!.estado = estado;

    return res.json({
      mensaje: "Estado del pedido actualizado exitosamente",
      pedido: listaPedidos[index],
    });
  },
);

// DELETE /pedidos/:id
// Cancelar y eliminar pedido
router.delete("/:id", function (req: Request<idParams>, res: Response) {
  /*
      #swagger.tags = ['Pedidos']
      #swagger.summary = 'Cancelar y eliminar un pedido'

      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del pedido a eliminar',
        required: true,
        type: 'integer'
      }
    */

  const idBuscado = Number(req.params.id);

  const index = listaPedidos.findIndex((e) => e.id === idBuscado);

  if (index === -1) {
    return res.status(404).json({
      error: "Pedido no encontrado",
    });
  }

  listaPedidos.splice(index, 1);

  return res.json({
    mensaje: "Pedido cancelado y eliminado exitosamente",
  });
});

export default router;
