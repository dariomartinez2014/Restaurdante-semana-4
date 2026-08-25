import type { Request, Response } from "express";
import { PedidosModel } from "../models/pedidos.models.js";

export async function getPedidos(req: Request, res: Response) {
  /*
    #swagger.tags = ['Pedidos']
    #swagger.summary = 'Obtener todos los pedidos'
    #swagger.description = 'Obtiene la lista de pedidos y permite filtrarlos por estado'

    #swagger.parameters['estado'] = {
      in: 'query',
      description: 'Filtrar pedidos por estado',
      required: false,
      type: 'string',
      enum: ['pendiente', 'preparando', 'entregado']
    }
  */

  try {
    const { estado } = req.query;

    const pedido = await PedidosModel.findAll(
      estado ? String(estado) : undefined,
    );

    res.json({
      totalPedidos: pedido.length,
      data: pedido,
    });
  } catch (error) {
    console.error("error al consultar PostgreSQL:");

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

      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para crear una nueva orden de pedido',
        required: true,
        schema: {
          cliente_id: 1,
          detalles: "2 hamburguesas y 1 gaseosa",
          total: 80,
          estado: "pendiente"
        }
      }
    */
  try {
    const { cliente_id, detalles, total, estado } = req.body;
    if (!cliente_id || !detalles || !total || !estado) {
      res.status(400).json({ error: "faltan datos obligatorios" });
    }
    const newPedido = await PedidosModel.create({
      cliente_id,
      detalles,
      total,
      estado,
    });
    res.status(201).json({ data: newPedido });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function putPedido(req: Request, res: Response) {
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
          estado: "entregado"
        }
      }
    */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const { cliente_id, detalles, total, estado } = req.body;
    const pedidoUpdate = await PedidosModel.update(id, {
      cliente_id,
      detalles,
      total,
      estado,
    });
    if (!pedidoUpdate) {
      res.status(404).json({ error: "pedido no encontrado" });
      return;
    }
    res.json({ data: pedidoUpdate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
