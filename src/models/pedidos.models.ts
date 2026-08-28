import type { z } from "zod";
import { pool } from "../config/db.js";
import type { updatePedidoSchema } from "../schemas/pedidos.schema.js";

//TIPADO DE LA TABLA
export interface pedido {
  id: number;
  cliente_id: number;
  estado: string;
  total: number;
  detalles: string;
}

export interface paginaResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// apartir de el tipado crear otros types
export type CreatePedidoInput = Omit<pedido, "id">;
export type UpdatePedidoInput = z.infer<typeof updatePedidoSchema>;

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
  findWhitFilter: async (
    page: number = 1,
    limit: number = 10,
    search?: string, // where estado ILIKE %${search}%
    minTotal?: number, // where total >= ${minTotal}
    maxTotal?: number, // where total <= ${maxTotal}
  ): Promise<paginaResult<pedido>> => {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // la construccion de las condiciones
    if (search) {
      conditions.push(`estado ILIKE $${paramIndex}`);
      paramIndex++;
      values.push(`%${search}%`);
    }

    if (minTotal !== undefined) {
      conditions.push(`total >= $${paramIndex}`);
      paramIndex++;
      values.push(minTotal);
    }

    if (maxTotal !== undefined) {
      conditions.push(`total <= $${paramIndex}`);
      paramIndex++;
      values.push(maxTotal);
    }

    // unir las condiciones existentes con AND
    const whereUnited =
      conditions.length > 0 ? `WHERE ${conditions.join(` AND `)}` : "";

    // CONTEO TOTAL de pedidos que coinciden con los filtros aplicados
    const countQuery = `SELECT COUNT(*) FROM pedidos ${whereUnited}`;
    const countResult = await pool.query(countQuery, values);
    const total = Number(countResult.rows[0].count);

    // consulta de datos con limit y offset
    const offset = (page - 1) * limit;

    // agregar el limit y offset a los placeholder dinamicos
    const dataValues = [...values, limit, offset];

    const dataQuery = `
    SELECT * FROM pedidos
    ${whereUnited}
    ORDER BY id ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

    const { rows } = await pool.query(dataQuery, dataValues);

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },
};
