import type { Request, Response, NextFunction } from "express";

export function validatePedidos(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { cliente_id, detalles, total, estado } = req.body;
  //1 existen los 3 valores q me llegan en la solicitud
  if (total === undefined || cliente_id === undefined || !detalles || !estado) {
    res.status(400).json({ error: "Faltan campos Obligatorios" });
    return;
  }

  //2 tipos de datos
  if (typeof detalles !== "string" || detalles.trim() === "") {
    res.status(400).json({
      error: "el campo nombre debe ser un texto valido",
    });
    return;
  }
  if (typeof total !== "number" || total < 0) {
    res
      .status(400)
      .json({ error: "el precio debe ser un valor numerico positivo" });
    return;
  }
  if (typeof cliente_id !== "number" || cliente_id < 0) {
    res
      .status(400)
      .json({ error: "el precio debe ser un valor numerico positivo" });
    return;
  }
  if (typeof estado !== "string" || estado.trim() === "") {
    res.status(400).json({
      error: "el campo categoria debe ser un texto valido",
    });
    return;
  }
  next();
}
