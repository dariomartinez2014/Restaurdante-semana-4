import type { Request, Response, NextFunction } from "express";

export function validateCreateRepartidor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { nombre, vehiculo, activo, pedidosAsignados, telefono } = req.body;

  const camposFaltantes: string[] = [];
  if (!nombre) camposFaltantes.push("nombre");
  if (!vehiculo) camposFaltantes.push("vehiculo");
  if (!telefono) camposFaltantes.push("telefono");
  if (activo === undefined) camposFaltantes.push("activo");
  if (pedidosAsignados === undefined) camposFaltantes.push("pedidosAsignados");

  if (camposFaltantes.length > 0) {
    res.status(400).json({
      error: `Faltan los siguientes campos obligatorios: ${camposFaltantes.join(", ")}`,
    });
    return;
  }
  if (typeof nombre !== "string" || nombre.trim() === "") {
    res.status(400).json({ error: "el nombre debe ser un texto valido" });
    return;
  }
  if (typeof vehiculo !== "string" || vehiculo.trim() === "") {
    res.status(400).json({ error: "el vehiculo debe ser un texto valido" });
    return;
  }
  if (typeof telefono !== "string" || telefono.trim() === "") {
    res.status(400).json({ error: "el telefono debe ser un texto valido" });
    return;
  }
  if (typeof activo !== "boolean") {
    res.status(400).json({ error: "el campo activo debe ser booleano" });
    return;
  }
  if (
    !Array.isArray(pedidosAsignados) ||
    !pedidosAsignados.every(
      (id) => typeof id === "number" && Number.isInteger(id),
    )
  ) {
    res.status(400).json({
      error: "pedidosAsignados en un array de numeros enteros [1, 2, 20]",
    });
    return;
  }
  next();
}

export function validateUpdateRepartidor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { nombre, vehiculo, activo, pedidosAsignados, telefono } = req.body;

  if (
    nombre === undefined &&
    vehiculo === undefined &&
    activo === undefined &&
    pedidosAsignados === undefined &&
    telefono === undefined
  ) {
    res
      .status(400)
      .json({ error: "Debes enviar al menos un campo para actualizar" });
    return;
  }

  if (
    nombre !== undefined &&
    (typeof nombre !== "string" || nombre.trim() === "")
  ) {
    res.status(400).json({ error: "El nombre debe ser un texto válido" });
    return;
  }
  if (
    vehiculo !== undefined &&
    (typeof vehiculo !== "string" || vehiculo.trim() === "")
  ) {
    res.status(400).json({ error: "El vehículo debe ser un texto válido" });
    return;
  }
  if (
    telefono !== undefined &&
    (typeof telefono !== "string" || telefono.trim() === "")
  ) {
    res.status(400).json({ error: "El teléfono debe ser un texto válido" });
    return;
  }
  if (activo !== undefined && typeof activo !== "boolean") {
    res.status(400).json({ error: "El campo activo debe ser booleano" });
    return;
  }

  if (pedidosAsignados !== undefined) {
    if (
      !Array.isArray(pedidosAsignados) ||
      !pedidosAsignados.every(
        (id) => typeof id === "number" && Number.isInteger(id),
      )
    ) {
      res.status(400).json({
        error: "pedidosAsignados debe ser un arreglo de números enteros",
      });
      return;
    }
  }

  next();
}

export function validateDeleteRepartidor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res
      .status(400)
      .json({ error: "Debes proporcionar un ID numérico válido en la URL" });
    return;
  }

  next();
}
