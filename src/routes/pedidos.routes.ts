import { Router } from "express";
import type { Request, Response } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /pedidos
// Obtener todos los pedidos
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pedidos ORDER BY id;"
    );

    res.json({
      total: result.rowCount,
      datos: result.rows,
    });
  } catch (error: any) {
    console.error("Error al obtener pedidos:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// GET /pedidos/:id
// Obtener un pedido por ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: "El ID debe ser un número",
      });
      return;
    }

    const result = await pool.query(
      "SELECT * FROM pedidos WHERE id = $1;",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        error: "Pedido no encontrado",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// POST /pedidos
// Crear un nuevo pedido
router.post("/", async (req: Request, res: Response) => {
  try {
    const { cliente_id, estado, total } = req.body;

    if (
      !cliente_id ||
      typeof estado !== "string" ||
      total === undefined
    ) {
      res.status(400).json({
        error: "cliente_id, estado y total son obligatorios",
      });
      return;
    }

    const query = `
      INSERT INTO pedidos
      (cliente_id, fecha, estado, total)
      VALUES ($1, NOW(), $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      cliente_id,
      estado,
      total,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error al crear pedido:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// PUT /pedidos/:id
// Actualizar un pedido
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: "El ID debe ser un número",
      });
      return;
    }

    const { cliente_id, estado, total } = req.body;

    if (
      !cliente_id ||
      typeof estado !== "string" ||
      total === undefined
    ) {
      res.status(400).json({
        error: "cliente_id, estado y total son obligatorios",
      });
      return;
    }

    const query = `
      UPDATE pedidos
      SET cliente_id = $1,
          estado = $2,
          total = $3
      WHERE id = $4
      RETURNING *;
    `;

    const result = await pool.query(query, [
      cliente_id,
      estado,
      total,
      id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({
        error: "Pedido no encontrado",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// DELETE /pedidos/:id
// Eliminar un pedido
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: "El ID debe ser un número",
      });
      return;
    }

    const result = await pool.query(
      "DELETE FROM pedidos WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        error: "Pedido no encontrado",
      });
      return;
    }

    res.json({
      message: "Pedido eliminado correctamente",
      pedido: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;