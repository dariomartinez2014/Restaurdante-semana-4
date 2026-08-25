import type { Request, Response } from "express";
import { PedidosModel } from "../models/pedidos.models.js";

export async function getPedidos(req: Request, res: Response) {
  try {
    const pedido = await PedidosModel.findAll();
    res.json({ totalProductos: pedido.length, data: pedido });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
}

export async function getPedidosById(req: Request, res: Response) {
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
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const pedidoUpdate = await PedidosModel.update(id, req.body);
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
