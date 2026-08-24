import { Router } from "express";
import type { Request, Response } from "express";
import {
  listaRepartidores,
  setListaRepartidores,
} from "../data/repartidores.data.js";
import { poolRepartidores } from "..//data/repartidores.data.js";

import type {
  repartidores,
  crearRepartidor,
  actualizarRepartidor,
  repartidoresFiltrados,
  pedidosParams,
} from "../types/repartidores.types.js";

const router = Router();

//endpoints
//repartidor filtrado por estado
router.get("/", async function (req: Request, res: Response) {
  try {
    const { activo } = req.query;

    let queryText = "SELECT * FROM repartidores";
    const queryParams: any[] = [];

    // Validar si viene el parámetro 'activo' y construir la consulta
    if (activo !== undefined) {
      if (activo === "true" || activo === "false") {
        queryText += " WHERE activo = $1";
        queryParams.push(activo === "true");
      } else {
        return res.status(400).json({
          error: "El parámetro 'activo' debe ser 'true' o 'false'",
        });
      }
    }

    queryText += ";";

    const resultado = await poolRepartidores.query(queryText, queryParams);

    res.json({
      message: "Conexión exitosa a la DB",
      total: resultado.rowCount,
      data: resultado.rows,
    });
  } catch (error) {
    console.error("Error en la consulta a la DB:", error);
    res.status(500).json({ error: "Error al conectar con la DB" });
  }
});

router.get("/db-test", async function (req: Request, res: Response) {
  try {
    const resultado = await poolRepartidores.query(
      "SELECT * FROM repartidores;",
    );
    res.json({
      message: "Conexion exitosa a la DB",
      total: resultado.rowCount,
      data: resultado.rows,
    });
  } catch (error) {
    console.error("error en la consulta a la DB");
    res.status(500).json({ error: "Error al conectar con la DB" });
  }
});

//endpoint para traer a un repartidor especifico por su id

router.get("/:id", function (req: Request<pedidosParams>, res: Response) {
  // #swagger.tags = ['Repartidores']
  // #swagger.description = 'Obtiene la informacion de un repartidor en especifico por su id'
  /*  #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID del repartidor a buscar',
          required: true,
          type: 'integer'
  } */
  const idBuscado = Number(req.params.id); //Number("Marco") === 32

  if (isNaN(idBuscado)) {
    return res
      .status(400)
      .json({ error: "El parametro id debe ser un numero valido" });
  }
  const repartidorFiltrado = listaRepartidores.find((e) => e.id === idBuscado);

  if (!repartidorFiltrado) {
    return res
      .status(404)
      .json({ error: "no existe un repartidor con ese ID" });
  }
  return res.json(repartidorFiltrado);
});

//CREAR UN REPARTIDOR NUEVO METODO POST

router.post(
  "/",
  async function (req: Request<{}, {}, crearRepartidor>, res: Response) {
    /*
      #swagger.tags = ['Repartidores']
      #swagger.summary = 'crear un repartidor nuevo'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para crear un repartidor nuevo',
        required: true,
        schema: {
          $nombre: "Marco",
          $vehiculo: "2507FRT",
          $telefono: "75060047",
          $activo: true
        }
      }
    */
    const { nombre, vehiculo, telefono, activo } = req.body;
    if (!nombre || !vehiculo || !telefono || activo === undefined) {
      return res
        .status(400)
        .json({ error: "faltan datos que son obligatorios" });
    }
    if (typeof activo !== "boolean") {
      return res.status(400).json({
        error: "El campo activo solamente puede ser true o false",
      });
    }
    try {
      const query = `
        INSERT INTO repartidores (nombre, vehiculo, telefono, activo)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [nombre, vehiculo, telefono, activo];
      const { rows } = await poolRepartidores.query(query, values);

      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al crear el repartidor" });
    }
  },
);

router.put(
  "/:id",
  async function (
    req: Request<{ id: string }, {}, crearRepartidor>,
    res: Response,
  ) {
    /*
    #swagger.tags = ['Repartidores']
    #swagger.summary = 'actualizar un repartidor existente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del repartidor a actualizar',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del repartidor',
      required: true,
      schema: {
        vehiculo: "4065GED",
        telefono: "60949745",
        activo: true
      }
    }
  */
    const { id } = req.params;
    const { nombre, vehiculo, telefono, activo } = req.body;

    try {
      const query = `
        UPDATE repartidores
        SET nombre = $1, vehiculo = $2, telefono = $3, activo = $4
        WHERE id = $5
        RETURNING *;
      `;
      const values = [nombre, vehiculo, telefono, activo, id];
      const { rows } = await poolRepartidores.query(query, values);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Repartidor no encontrado" });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Error al actualizar el repartidor" });
    }
  },
);

router.delete(
  "/:id",
  async function (req: Request<{ id: string }>, res: Response) {
    /*
    #swagger.tags = ['Repartidores']
    #swagger.summary = 'eliminar un repartidor'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del repartidor a eliminar',
      required: true,
      type: 'integer'
    }
  */
    const { id } = req.params;

    try {
      const query = `
        DELETE FROM repartidores
        WHERE id = $1
        RETURNING *;
      `;
      const { rows } = await poolRepartidores.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Repartidor no encontrado" });
      }

      return res.status(200).json({
        message: "Repartidor eliminado exitosamente",
        repartidor: rows[0],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al eliminar el repartidor" });
    }
  },
);

export default router;
