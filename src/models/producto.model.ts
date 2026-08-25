import { create } from "node:domain";
import { pool } from "../config/db.js";

//TIPADO DE LA TABLA
export interface Productos {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  disponibilidad: boolean;
}

//Creación de types
export type CreateProductoInput = Omit<Productos, "id">;
export type UpdateProductoInput = Partial<CreateProductoInput>;

//LAS FUNCIONES PARA CONSULTAR LA BASE DE DATOS DE LOS PRODUCTOS
export const ProductoModel = {
  findAll: async (): Promise<Productos[]> => {
    const { rows } = await pool.query(
      "SELECT * FROM productos ORDER BY id ASC;",
    );
    return rows;
  },
  findById: async (id: number): Promise<Productos | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM productos WHERE id = $1;",
      [id],
    );
    return rows[0] || null;
  },
  create: async (dato: CreateProductoInput): Promise<Productos> => {
    const { nombre, precio, categoria, disponibilidad } = dato;
    const query =
      "INSERT INTO productos (nombre , precio , categoria, disponibilidiad) VALUES ($1,$2,$3,$4) RETURNING *;";
    const { rows } = await pool.query(query, [
      nombre,
      precio,
      categoria,
      disponibilidad,
    ]);
    return rows[0];
  },
  update: async (
    id: number,
    dato: UpdateProductoInput,
  ): Promise<Productos | null> => {
    const { rows } = await pool.query(
      `UPDATE productos
            SET nombre = $1,
            precio = $2,
            categoria = $3
            disponibilidad = $4
            WHERE id = $5
            RETURNING *;
`,
      [dato.nombre, dato.precio, dato.categoria, dato.disponibilidad, id],
    );
    return rows[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      "DELETE FROM productos WHERE id = $1;",
      [id],
    );
    return (rowCount ?? 0) > 0;
  },
};
