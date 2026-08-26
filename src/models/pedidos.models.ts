import { create } from "node:domain";
import { pool } from "../config/db.js";
import type { UpdatePedidoInput } from "../schemas/pedidos.schema.js";

//TIPADO DE LA TABLA
export interface pedido {
  id: number;
  cliente_id: number;
  estado: string;
  total: number;
  detalles: string;
}

// apartir de el tipado crear otros types
export type CreatePedidoInput = Omit<pedido, "id">;

//FUNCIONES Q CONSULTAN A LA BASE DE DATOS
export const PedidosModel = {
  findAll: async (estado?: string): Promise<pedido[]> => {
    if (estado) {
      const { rows } = await pool.query(
        "SELECT * FROM pedidos WHERE estado = $1 ORDER BY id ASC;",
        [estado],
      );
      return rows;
    }
    const { rows } = await pool.query("SELECT * FROM pedidos ORDER BY id ASC;");

    return rows;
  },
  findById: async (id: number): Promise<pedido | null> => {
    const { rows } = await pool.query("SELECT * FROM pedidos WHERE id = $1;", [
      id,
    ]);
    return rows[0] || null;
  },
  create: async (dato: CreatePedidoInput): Promise<pedido> => {
    const { cliente_id, detalles, total, estado } = dato;
    const query =
      "INSERT INTO pedidos (cliente_id, detalles, total, estado) VALUES ($1,$2,$3,$4) RETURNING *;";
    const { rows } = await pool.query(query, [
      cliente_id,
      detalles,
      total,
      estado,
    ]);
    return rows[0];
  },
  update: async (
    id: number,
    dato: UpdatePedidoInput,
  ): Promise<pedido | null> => {
    const { rows } = await pool.query(
      `UPDATE pedidos
     SET cliente_id = COALESCE($1, cliente_id),
         detalles = COALESCE($2, detalles),
         total = COALESCE($3, total),
         estado = COALESCE($4, estado)
     WHERE id = $5
     RETURNING *;`,
      [dato.cliente_id, dato.detalles, dato.total, dato.estado, id],
    );

    return rows[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      "DELETE FROM pedidos WHERE id = $1;",
      [id],
    );
    return (rowCount ?? 0) > 0;
  },
};
