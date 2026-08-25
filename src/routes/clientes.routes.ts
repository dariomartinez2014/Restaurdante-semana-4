import { Router } from "express";
import type { Request, Response } from "express";
import pool from "../config/database.js";

const router = Router();

// GET /clientes
router.get("/", async (req: Request, res: Response) => {
  try {
    const ciudad = req.query.ciudad as string | undefined;

    const resultado = await pool.query("SELECT * FROM clientes");

    let datos = resultado.rows;

    if (ciudad) {
      datos = datos.filter(
        (cliente) =>
          cliente.ciudad?.toLowerCase() === ciudad.toLowerCase(),
      );
    }

    return res.json({
      total: datos.length,
      datos,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// GET /clientes/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El parámetro id debe ser un número válido",
      });
    }

    const resultado = await pool.query(
      "SELECT * FROM clientes WHERE id = $1",
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "No existe un cliente con ese ID",
      });
    }

    return res.json(resultado.rows[0]);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// POST /clientes
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      apellido,
      telefono,
      direccion,
      email,
      ciudad,
    } = req.body;

    if (!nombre || !apellido || !telefono || !direccion || !ciudad) {
      return res.status(400).json({
        error: "Faltan datos obligatorios",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO clientes
      (nombre, apellido, telefono, direccion, email, ciudad)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        nombre,
        apellido,
        telefono,
        direccion,
        email ?? null,
        ciudad,
      ],
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// PUT /clientes/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El parámetro id debe ser un número válido",
      });
    }

    const {
      nombre,
      apellido,
      telefono,
      direccion,
      email,
      ciudad,
    } = req.body;

    const resultado = await pool.query(
      `
      UPDATE clientes
      SET nombre = COALESCE($1, nombre),
          apellido = COALESCE($2, apellido),
          telefono = COALESCE($3, telefono),
          direccion = COALESCE($4, direccion),
          email = COALESCE($5, email),
          ciudad = COALESCE($6, ciudad)
      WHERE id = $7
      RETURNING *
      `,
      [
        nombre,
        apellido,
        telefono,
        direccion,
        email,
        ciudad,
        id,
      ],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    return res.json(resultado.rows[0]);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// DELETE /clientes/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El parámetro id debe ser un número válido",
      });
    }

    const resultado = await pool.query(
      "DELETE FROM clientes WHERE id = $1 RETURNING *",
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    return res.json({
      mensaje: "CLIENTE ELIMINADO EXITOSAMENTE",
      cliente: resultado.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

export default router;