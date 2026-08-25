import { pool } from "../config/db.js";
import type { Request, Response } from "express";


//lectura de los Productos GET
export async function getProductos(req: Request, res: Response) {
try {
    const result = await pool.query("SELECT * FROM productos;");
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
};


//Busqueda por ID de los productos
export async function getProductosById (req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const resu = await pool.query("SELECT * FROM productos WHERE id =$1", [id]);
    if (resu.rows.length === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.json(resu.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}


//Crear un nuevo Producto POST
export async function postProducto (req: Request, res: Response) {
  try {
    const { nombre, categoria, precio, disponibilidad } = req.body;
    if (!nombre || !categoria || !precio || !disponibilidad) {
      res.status(400).json({ error: "faltan datos obligatorios" });
    }
    const query =
      "INSERT INTO productos (nombre , categoria , precio, disponibilidad) VALUES ($1,$2,$3,$4) RETURNING *;";
    const result = await pool.query(query, [nombre, categoria, precio, disponibilidad]);

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}


//Actualizar un Producto PUT
export async function putProducto(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const resu = await pool.query("SELECT * FROM productos WHERE id =$1", [id]);
    if (resu.rows.length === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    const { nombre, categoria, precio, disponibilidad } = req.body;
    if (!nombre || !categoria || !precio || !disponibilidad) {
      res.status(400).json({ error: "faltan datos obligatorios" });
    }
    const query = `UPDATE productos
            SET nombre = $1,
            categoria = $2,
            precio = $3
            disponibilidad = $4
            WHERE id = $5
            RETURNING *;
`;
    const result = await pool.query(query, [nombre, categoria, precio, disponibilidad, id]);
    res.status(202).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}



//Eliminar un producto por ID
export async function deleteProducto(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const resu = await pool.query("DELETE FROM productos WHERE id = $1;", [id]);
    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
