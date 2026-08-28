import { create } from "node:domain";
import { pool } from "../config/db.js";
import { updateProductoSchema } from "../schemas/producto.schema.js";

//TIPADO DE LA TABLA
export interface Productos {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  disponibilidad: boolean;
}

//TIPADO PARA LA PAGINACION
export interface paginaProductoResult<T> {
  data: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}


//Creación de types
export type CreateProductoInput = Omit<Productos, "id" | "disponibilidad">;
export type UpdateProductoInput = Partial<Omit<Productos, "id">>;

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
  findByCategoria: async (categoria: string): Promise<Productos | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM productos WHERE categoria = $1;",
      [categoria],
    );
    return rows[0] || null;
  },
  create: async (dato: CreateProductoInput): Promise<Productos> => {
    const { nombre, precio, categoria} = dato;
    const query =
      "INSERT INTO productos (nombre , precio , categoria) VALUES ($1,$2,$3) RETURNING *;";
    const { rows } = await pool.query(query, [nombre, precio, categoria]);
    return rows[0];
  },
  update: async (
    id: number,
    dato: UpdateProductoInput,
  ): Promise<Productos | null> => {
    const { rows } = await pool.query(
      `UPDATE productos
            SET nombre = COALESCE($1, nombre),
            precio = COALESCE($2, precio),
            categoria = COALESCE($3, categoria),
            disponibilidad = COALESCE($4, disponibilidad)
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


  // ------ AGREGADAS
  // ------ BUSCAR POR NOMBRES -------
  findByName: async (name: string): Promise<Productos | null> => {
    const { rows } = await pool.query<Productos>(
      "SELECT * FROM productos WHERE LOWER(nombre) = LOWER($1);",
      [name],
    );
    return rows[0] || null;
  },



  // ------ PAGINACION -----------------
  findWhitFilter: async (
    pagina: number = 1,
    limite: number = 10,
    busqueda?: string, // where name ILIKE %${search}%
    minPrecio?: number, // where precio >= ${minPirce}
    maxPrecio?: number, // where precio <= ${maxPrice}
  ): Promise<paginaProductoResult<Productos>> => {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    //la construccion de las condiciones
    if (busqueda) {
      conditions.push(`nombre ILIKE $${paramIndex}`);
      paramIndex++;
      values.push(`%${busqueda}%`);
    }

    if (minPrecio !== undefined) {
      conditions.push(`precio >= $${paramIndex}`);
      paramIndex++;
      values.push(minPrecio);
    }
    if (maxPrecio !== undefined) {
      conditions.push(`precio <= ${maxPrecio}`);
      paramIndex++;
      values.push(maxPrecio);
    }
    // unir las condiciones existentes con AND
    const whereUnited =
      conditions.length > 0 ? `WHERE ${conditions.join(` AND `)}` : "";
    //CONTEO TOTAL de prodcutos q coinciden con los filtros aplicados (en caso de haberlos)
    const countQuery = `SELECT COUNT(*) FROM productos ${whereUnited}`;
    const countResult = await pool.query(countQuery, values);
    const total = Number(countResult.rows[0].count);
    //consulta de datos con limit y offset
    const offset = (pagina - 1) * limite;
    //agregar el limit y offset a los placeholder dinamicos
    const dataValues = [...values, limite, offset];
    const dataQuery = `
    SELECT * FROM productos
    ${whereUnited}
    ORDER BY id ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const { rows } = await pool.query(dataQuery, dataValues);

    return {
      data: rows,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite) || 1,
    };
  },
};
