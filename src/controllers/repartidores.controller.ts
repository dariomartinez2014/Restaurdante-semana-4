import type { Request, Response } from "express";
import { RepartidorModel } from "../models/repartidores.model.js";

export const getRepartidores = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Repartidores']
    #swagger.summary = 'Obtener lista de repartidores'
    #swagger.parameters['activo'] = {
      in: 'query',
      description: 'Filtrar por estado activo (true o false)',
      required: false,
      type: 'boolean'
    }
  */
  try {
    const { activo } = req.query;

    let estadoActivo: boolean | undefined = undefined;
    if (activo === "true") estadoActivo = true;
    if (activo === "false") estadoActivo = false;

    const repartidores = await RepartidorModel.obtenerTodos(estadoActivo);
    return res.json(repartidores);
  } catch (error) {
    console.error("Error exacto de PostgreSQL:", error);
    return res.status(500).json({ error: "Error al consultar repartidores" });
  }
};

export const getRepartidorPorId = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Repartidores']
    #swagger.summary = 'Obtener un repartidor por su ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del repartidor',
      required: true,
      type: 'number'
    }
  */
  try {
    const id = Number(req.params.id);
    const repartidor = await RepartidorModel.obtenerPorId(id);

    if (!repartidor) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    return res.json(repartidor);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el repartidor" });
  }
};

export const crearRepartidor = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Repartidores']
    #swagger.summary = 'Registrar un nuevo repartidor'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del nuevo repartidor',
      required: true,
      schema: {
        $nombre: 'Carlos Mamani',
        $vehiculo: 'Motocicleta',
        $activo: true,
        $pedidosAsignados: [101, 102],
        $telefono: '71234567'
      }
    }
  */
  try {
    const nuevo = await RepartidorModel.crear(req.body);
    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(500).json({ error: "Error al registrar repartidor" });
  }
};

export const actualizarRepartidor = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Repartidores']
    #swagger.summary = 'Actualizar un repartidor'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del repartidor a actualizar',
      required: true,
      type: 'number'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Campos a actualizar del repartidor',
      required: true,
      schema: {
        nombre: 'Carlos Mamani',
        vehiculo: 'Bicicleta',
        activo: false,
        pedidosAsignados: [103],
        telefono: '71234567'
      }
    }
  */
  try {
    const id = Number(req.params.id);
    const actualizado = await RepartidorModel.actualizar(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    return res.json(actualizado);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar repartidor" });
  }
};

export const eliminarRepartidor = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Repartidores']
    #swagger.summary = 'Eliminar un repartidor por su ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del repartidor a eliminar',
      required: true,
      type: 'number'
    }
  */
  try {
    const id = Number(req.params.id);
    const eliminado = await RepartidorModel.eliminar(id);

    if (!eliminado) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    return res.json({ mensaje: "Repartidor eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar repartidor" });
  }
};
