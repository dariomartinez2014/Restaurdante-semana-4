import type { Request, Response } from "express";
import { PedidosModel } from "../models/pedidos.models.js";
import {
  createPedidoSchema,
  updatePedidoSchema,
} from "../schemas/pedidos.schema.js";
import { pedidoService } from "../services/pedidos.service.js";

export async function getPedidos(req: Request, res: Response) {
  /*
    #swagger.tags = ['Pedidos']
    #swagger.summary = 'Obtener todos los pedidos'
    #swagger.description = 'Obtiene la lista de pedidos y permite filtrarlos por estado'

#swagger.parameters['page'] = {
  in: 'query',
  description: 'Número de página',
  required: false,
  type: 'integer',
  default: 1
}

#swagger.parameters['limit'] = {
  in: 'query',
  description: 'Cantidad de pedidos por página',
  required: false,
  type: 'integer',
  default: 10
}

#swagger.parameters['search'] = {
  in: 'query',
  description: 'Buscar pedidos por estado',
  required: false,
  type: 'string'
}

#swagger.parameters['minTotal'] = {
  in: 'query',
  description: 'Filtrar pedidos con total mínimo',
  required: false,
  type: 'number'
}

#swagger.parameters['maxTotal'] = {
  in: 'query',
  description: 'Filtrar pedidos con total máximo',
  required: false,
  type: 'number'
}
  */

  try {
    const result = await pedidoService.getPedidosFilters(req.query);
    res.json(result);
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
}
export async function getPedidosById(req: Request, res: Response) {
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
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el id debe ser numerico" });
      return;
    }
    const pedido = await PedidosModel.findById(id);
    if (!pedido) {
      res.status(400).json({ error: "pedido no encontrado" });
      return;
    }
    res.json({ data: pedido });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function postPedido(req: Request, res: Response) {
  /*
      #swagger.tags = ['Pedidos']
      #swagger.summary = 'Crear una nueva orden de pedido'
    */
  try {
    const result = createPedidoSchema.safeParse(req.body);
    console.log(result);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const newProduct = await PedidosModel.create(result.data);
    res.status(201).json({ data: newProduct });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function putPedido(req: Request, res: Response) {
  /*
  #swagger.tags = ['Pedidos']
  #swagger.summary = 'Actualizar un pedido'

  #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID del pedido',
    required: true,
    type: 'integer'
  }

  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Datos a actualizar. Puedes enviar uno o varios campos.',
    required: true,
    schema: {
      estado: "entregado"
    }
  }
*/

  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: "EL ID DEBE SER UN VALOR NUMERICO",
      });
      return;
    }
    const result = updatePedidoSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: result.error.issues,
      });
      return;
    }

    const pedidoUpdate = await PedidosModel.update(id, result.data);

    if (!pedidoUpdate) {
      res.status(404).json({
        error: "pedido no encontrado",
      });
      return;
    }

    res.json({
      data: pedidoUpdate,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}

export async function deletePedido(req: Request, res: Response) {
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
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const pedidoEliminado = await PedidosModel.delete(id);
    if (pedidoEliminado) {
      res.status(200).json({ message: "pedido eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "pedido no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
