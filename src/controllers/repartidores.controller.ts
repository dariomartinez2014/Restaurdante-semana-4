import type { Request, Response } from "express";
import { RepartidorModel } from "../models/repartidores.model.js";
import type { QueryRepartidor } from "../schemas/repartidores.schema.js";

export const getRepartidores = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Repartidores']
    #swagger.summary = 'Obtener lista de repartidores con filtros y paginación'
    #swagger.parameters['nombre'] = {
      in: 'query',
      description: 'Filtrar por nombre (búsqueda parcial)',
      type: 'string',
      required: false
    }
    #swagger.parameters['vehiculo'] = {
      in: 'query',
      description: 'Filtrar por tipo de vehículo (ej: Motocicleta, Bicicleta)',
      type: 'string',
      required: false
    }
    #swagger.parameters['activo'] = {
      in: 'query',
      description: 'Filtrar por estado activo',
      type: 'boolean',
      required: false
    }
    #swagger.parameters['pagina'] = {
      in: 'query',
      description: 'Número de página (por defecto: 1)',
      type: 'integer',
      default: 1,
      required: false
    }
    #swagger.parameters['limite'] = {
      in: 'query',
      description: 'Cantidad de elementos por página (por defecto: 10)',
      type: 'integer',
      default: 10,
      required: false
    }
    #swagger.parameters['orderBy'] = {
      in: 'query',
      description: 'Campo por el cual ordenar los resultados',
      type: 'string',
      schema: { '@enum': ['id', 'nombre', 'vehiculo'] },
      default: 'id',
      required: false
    }
    #swagger.parameters['orderDir'] = {
      in: 'query',
      description: 'Dirección del ordenamiento',
      type: 'string',
      schema: { '@enum': ['ASC', 'DESC'] },
      default: 'ASC',
      required: false
    }
  */
  try {
    const filtros = req.query as unknown as QueryRepartidor;

    // Ejecutamos ambas consultas en paralelo para optimizar la latencia
    const [repartidores, total] = await Promise.all([
      RepartidorModel.obtenerTodos(filtros),
      RepartidorModel.contarTodos(filtros),
    ]);

    const { pagina, limite } = filtros;

    return res.json({
      datos: repartidores,
      paginacion: {
        total,
        pagina,
        limite,
        paginasTotal: Math.ceil(total / limite),
        hayMas: pagina * limite < total,
      },
    });
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
      description: 'ID numérico del repartidor',
      required: true,
      type: 'integer'
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
      description: 'Datos requeridos para la creación del repartidor',
      required: true,
      schema: {
        $nombre: 'Carlos Mamani',
        $vehiculo: 'Motocicleta',
        $telefono: '71234567',
        $activo: true,
        $pedidosAsignados: [101, 102]
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
    #swagger.summary = 'Actualizar los datos de un repartidor existente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID numérico del repartidor a actualizar',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Campos opcionales a modificar (envía al menos uno)',
      required: true,
      schema: {
        nombre: 'Carlos Mamani',
        vehiculo: 'Bicicleta',
        telefono: '71234567',
        activo: false,
        pedidosAsignados: [103]
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
      description: 'ID numérico del repartidor a eliminar',
      required: true,
      type: 'integer'
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
