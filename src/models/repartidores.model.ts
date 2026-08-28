import { pool } from "../config/db.js";
import type { QueryRepartidor } from "../schemas/repartidores.schema.js";

interface repartidores {
  id: number;
  nombre: string;
  vehiculo: string;
  activo: boolean;
  pedidosAsignados: number[];
  telefono: string;
}
interface repartidoresFiltrados {
  nombre?: string;
  vehiculo?: string;
  activo?: string;
}

interface pedidosParams {
  id: string;
  pedidoAsignadoIndex: string;
}

export type crearRepartidor = Omit<repartidores, "id">;
export type actualizarRepartidor = Partial<crearRepartidor>;
export type { repartidores, repartidoresFiltrados, pedidosParams };

const COLUMNAS_PERMITIDAS = ["id", "nombre", "vehichulo"] as const;
const DIRECCIONES_PERMITIDAS = ["ASC", "DESC"] as const;

function construirWhere(
  filtros: Omit<QueryRepartidor, "pagina" | "limite" | "orderBy" | "orderDir">,
) {
  const condiciones: string[] = [];
  const parametros: unknown[] = [];
  let indice = 1;

  if (filtros.nombre !== undefined) {
    condiciones.push(`nombre ILIKE $${indice}`);
    parametros.push(`%${filtros.nombre}%`);
    indice++;
  }

  if (filtros.vehiculo !== undefined) {
    condiciones.push(`vehiculo ILIKE $${indice}`);
    parametros.push(`%${filtros.vehiculo}%`);
    indice++;
  }

  if (filtros.activo !== undefined) {
    condiciones.push(`activo = $${indice}`);
    parametros.push(filtros.activo);
    indice++;
  }

  const where =
    condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";

  return { where, parametros, ultimoIndice: indice };
}

export const RepartidorModel = {
  async obtenerTodos(filtros: QueryRepartidor): Promise<repartidores[]> {
    const { pagina, limite, orderBy, orderDir, ...filtrosBusqueda } = filtros;
    const { where, parametros, ultimoIndice } = construirWhere(filtrosBusqueda);

    // Validación mediante Lista Blanca
    const colOrder = COLUMNAS_PERMITIDAS.includes(orderBy as any)
      ? orderBy
      : "id";
    const dirOrder = DIRECCIONES_PERMITIDAS.includes(
      orderDir.toUpperCase() as any,
    )
      ? orderDir.toUpperCase()
      : "ASC";

    const offset = (pagina - 1) * limite;
    parametros.push(limite);
    parametros.push(offset);

    const sql = `
      SELECT 
        id, 
        nombre, 
        vehiculo, 
        telefono, 
        activo, 
        pedidosasignados AS "pedidosAsignados"
      FROM repartidores
      ${where}
      ORDER BY ${colOrder} ${dirOrder}
      LIMIT $${ultimoIndice} OFFSET $${ultimoIndice + 1}
    `;

    const result = await pool.query(sql, parametros);
    return result.rows;
  },

  async contarTodos(
    filtros: Omit<
      QueryRepartidor,
      "pagina" | "limite" | "orderBy" | "orderDir"
    >,
  ): Promise<number> {
    const { where, parametros } = construirWhere(filtros);

    const sql = `SELECT COUNT(*) AS total FROM repartidores ${where}`;
    const result = await pool.query(sql, parametros);

    return parseInt(result.rows[0].total, 10);
  },

  async obtenerPorId(id: number): Promise<repartidores | null> {
    const result = await pool.query(
      `SELECT id, nombre, telefono, vehiculo, activo, pedidosasignados AS "pedidosAsignados" 
       FROM repartidores WHERE id = $1`,
      [id],
    );
    return result.rows[0] || null;
  },

  async crear(datos: crearRepartidor): Promise<repartidores> {
    const {
      nombre,
      telefono,
      vehiculo,
      activo = true,
      pedidosAsignados,
    } = datos;
    const result = await pool.query(
      `INSERT INTO repartidores (nombre, telefono, vehiculo, activo, pedidosasignados) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, nombre, vehiculo, telefono, activo, pedidosasignados AS "pedidosAsignados"`,
      [nombre, telefono, vehiculo, activo, pedidosAsignados],
    );
    return result.rows[0];
  },

  async actualizar(
    id: number,
    datos: actualizarRepartidor,
  ): Promise<repartidores | null> {
    const { nombre, telefono, vehiculo, activo, pedidosAsignados } = datos;

    const result = await pool.query(
      `UPDATE repartidores 
       SET 
         nombre = COALESCE($1, nombre),
         telefono = COALESCE($2, telefono),
         vehiculo = COALESCE($3, vehiculo),
         activo = COALESCE($4, activo),
         pedidosasignados = COALESCE($5, pedidosasignados)
       WHERE id = $6
       RETURNING id, nombre, vehiculo, telefono, activo, pedidosasignados AS "pedidosAsignados"`,
      [
        nombre ?? null,
        telefono ?? null,
        vehiculo ?? null,
        activo ?? null,
        pedidosAsignados ?? null,
        id,
      ],
    );

    return result.rows[0] || null;
  },

  async eliminar(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM repartidores WHERE id = $1 RETURNING id",
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
