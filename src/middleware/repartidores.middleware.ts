import type { Request, Response, NextFunction } from "express";
import {
  createRepartidorSchema,
  updateRepartidorSchema,
  paramsIdSchema,
  queryRepartidorSchema,
} from "../schemas/repartidores.schema.js";

//Middleware para enviar QUERY
export function validateQueryRepartidor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = queryRepartidorSchema.safeParse(req.query);

  if (!result.success) {
    const errorMsg = result.error.issues[0]?.message ?? "Parámetros no válidos";
    return res.status(400).json({ error: errorMsg });
  }

  Object.keys(req.query).forEach((key) => delete req.query[key]);
  Object.assign(req.query, result.data);
  next();
}

// Middleware para INSERTAR (POST)
export function validateCreateRepartidor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = createRepartidorSchema.safeParse(req.body);

  if (!result.success) {
    const errorMsg = result.error?.issues[0]?.message ?? "Error de validacion";
    return res.status(400).json({ error: errorMsg });
  }

  req.body = result.data; // Asigna los datos limpios y casteados
  next();
}

// Middleware para ACTUALIZAR (PUT)
export function validateUpdateRepartidor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = updateRepartidorSchema.safeParse(req.body);

  if (!result.success) {
    const errorMsg = result.error?.issues[0]?.message ?? "Error de validacion";
    return res.status(400).json({ error: errorMsg });
  }

  req.body = result.data;
  next();
}

// Middleware para ELIMINAR O BUSCAR POR ID (DELETE / GET)
export function validateParamsId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = paramsIdSchema.safeParse(req.params);
  if (!result.success) {
    const errorMsg = result.error.issues[0]?.message ?? "ID no válido";
    return res.status(400).json({ error: errorMsg });
  }
  next();
}
