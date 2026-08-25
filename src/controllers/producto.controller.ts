import { pool } from "../config/db.js";
import type { Request, Response } from "express";

// GET /productos
export async function getProductos(req: Request, res: Response) {
  try {
    const result = await pool.query(
      "SELECT * FROM productos ORDER BY id;"
    );

    return res.json({
      message: "Conexión exitosa a la base de datos",
      total: result.rowCount,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error al consultar productos:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}

// GET /productos/:id
export async function getProductosById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico",
      });
    }

    const result = await pool.query(
      "SELECT * FROM productos WHERE id = $1;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    return res.json(result.rows[0]);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

// POST /productos
export async function postProducto(req: Request, res: Response) {
  try {
    const {
      nombre,
      categoria,
      precio,
      disponibilidad,
    } = req.body;

    if (
      !nombre ||
      !categoria ||
      precio === undefined ||
      typeof disponibilidad !== "boolean"
    ) {
      return res.status(400).json({
        error:
          "nombre, categoria, precio y disponibilidad son obligatorios",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO productos
      (nombre, categoria, precio, disponibilidad)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [nombre, categoria, precio, disponibilidad]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

// PUT /productos/:id
export async function putProducto(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico",
      });
    }

    const {
      nombre,
      categoria,
      precio,
      disponibilidad,
    } = req.body;

    if (
      !nombre ||
      !categoria ||
      precio === undefined ||
      typeof disponibilidad !== "boolean"
    ) {
      return res.status(400).json({
        error:
          "nombre, categoria, precio y disponibilidad son obligatorios",
      });
    }

    const result = await pool.query(
      `
      UPDATE productos
      SET nombre = $1,
          categoria = $2,
          precio = $3,
          disponibilidad = $4
      WHERE id = $5
      RETURNING *;
      `,
      [nombre, categoria, precio, disponibilidad, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    return res.json(result.rows[0]);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

// DELETE /productos/:id
export async function deleteProducto(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico",
      });
    }

    const result = await pool.query(
      "DELETE FROM productos WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    return res.json({
      message: "Producto eliminado exitosamente",
      producto: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}