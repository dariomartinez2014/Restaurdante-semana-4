import { pool } from "../config/db.js";
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

export const RepartidorModel = {
  async obtenerTodos(activo?: boolean): Promise<repartidores[]> {
    if (activo !== undefined) {
      const result = await pool.query(
        "SELECT * FROM repartidores WHERE activo = $1 ORDER BY id ASC",
        [activo],
      );
      return result.rows;
    }

    const result = await pool.query(
      "SELECT * FROM repartidores ORDER BY id ASC",
    );
    return result.rows;
  },

  async obtenerPorId(id: number): Promise<repartidores | null> {
    const result = await pool.query(
      "SELECT * FROM repartidores WHERE id = $1",
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
      "INSERT INTO repartidores (nombre, telefono, vehiculo, activo, pedidos_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre, telefono, vehiculo, activo, pedidosAsignados],
    );
    return result.rows[0];
  },

  async actualizar(
    id: number,
    datos: actualizarRepartidor,
  ): Promise<repartidores | null> {
    const repartidorActual = await this.obtenerPorId(id);
    if (!repartidorActual) return null;

    const nombre = datos.nombre ?? repartidorActual.nombre;
    const telefono = datos.telefono ?? repartidorActual.telefono;
    const vehiculo = datos.vehiculo ?? repartidorActual.vehiculo;
    const activo = datos.activo ?? repartidorActual.activo;
    const pedidosAsignados =
      datos.pedidosAsignados ?? repartidorActual.pedidosAsignados;

    const result = await pool.query(
      "UPDATE repartidores SET nombre = $1, telefono = $2, vehiculo = $3, activo = $4, pedidos_id = $5 WHERE id = $6 RETURNING *",
      [nombre, telefono, vehiculo, activo, pedidosAsignados, id],
    );

    return result.rows[0];
  },

  async eliminar(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM repartidores WHERE id = $1 RETURNING id",
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
