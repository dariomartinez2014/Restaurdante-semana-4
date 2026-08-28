import type { Request, Response, NextFunction } from "express";

export function validateProducto(req: Request, res: Response, next: NextFunction,) {
    const { nombre, categoria, precio } = req.body;

    // ------ DEBE EXISTIR LOS TRES VALORES DE LA SOLICITUD QUE ME LLEGA
    if (precio === undefined || !categoria || !nombre) {
    res.status(400).json({ error: "SE DEBE LLENAR LA INFORMACIÓN" });
    return;
  }

    // ------ VERIFICAR BIEN LOS DATOS QUE SE INGRESAN
      if (typeof nombre !== "string" || nombre.trim() === "") {
    res.status(400).json({
      error: "SE DEBE INGRESAR UN TEXTO VALIDO EN EL CAMPO DEL NOMBRE",
    });
    return;
  }
  if (typeof precio !== "number" || precio < 0) {
    res
      .status(400)
      .json({ error: "SE DEBE INGRESAR UN VALOR NUMERICO POSITIVO EN EL PRECIO" });
    return;
  }
  if (typeof categoria !== "string" || categoria.trim() === "") {
    res.status(400).json({
      error: "SE DEBE INGRESAR UN TEXTO VALIDO EN LA CATEGORIA",
    });
    return;
  }
  next();
}