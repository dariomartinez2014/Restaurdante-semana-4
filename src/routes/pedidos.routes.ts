import { Router } from "express";
import type { Request, Response } from "express";
import { listaPedidos } from "../data/pedidos.data.js";
import { pool } from "../db.js";

import type {
  Pedido,
  crearPedido,
  actualizarPedido,
  pedidosFiltrados,
  idParams,
} from "../types/pedidos.types.js";

const router = Router();

// GET /pedidos
// Lista todos los pedidos y permite filtrar por estado
router.get("/productos", async function (req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM pedidos;");
    res.json({
      message: "Conexion exitosa a la base de datos :D",
      total: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
});

// GET /pedidos/:id
// Buscar un pedido específico
router.get("/pedidos/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const resu = await pool.query("SELECT * FROM pedidos WHERE id =$1", [id]);
    if (resu.rows.length === 0) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }
    res.json(resu.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /pedidos
// Crear un pedido
router.post("/pedidos", async (req: Request, res: Response) => {
  try {
    const { cliente_id, detalles, total, estado } = req.body;
    if (!cliente_id || !detalles || !total || !estado) {
      res.status(400).json({ error: "faltan datos obligatorios" });
    }
    const query =
      "INSERT INTO pedidos (cliente_id, detalles , total, estado) VALUES ($1,$2,$3,$4) RETURNING *;";
    const result = await pool.query(query, [
      cliente_id,
      detalles,
      total,
      estado,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar el estado del pedido
router.put("/productos/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const resu = await pool.query("SELECT * FROM pedidos WHERE id =$1", [id]);
    if (resu.rows.length === 0) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }
    const { cliente_id, detalles, total, estado } = req.body;
    if (!cliente_id || !detalles || !total || !estado) {
      res.status(400).json({ error: "faltan datos obligatorios" });
    }
    const query = `UPDATE pedidos
            SET cliente_id = $1,
            detalles = $2,
            total = $3,
            estado= $4
            WHERE id = $4
            RETURNING *;
`;
    const result = await pool.query(query, [
      cliente_id,
      detalles,
      total,
      estado,
      id,
    ]);
    res.status(202).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /pedidos/:id
// Cancelar y eliminar pedido
router.delete("/productos/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const resu = await pool.query("DELETE FROM pedidos WHERE id = $1;", [id]);
    res.status(200).json({ message: "pedido eliminado exitosamente" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
