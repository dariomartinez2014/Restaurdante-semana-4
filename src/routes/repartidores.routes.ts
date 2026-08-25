import { Router } from "express";
import type { Request, Response } from "express";
import { poolRepartidores } from "../data/repartidores.data.js";

const router = Router();

// GET /repartidores
// Lista todos los repartidores y permite filtrar por activo
router.get("/", async (req: Request, res: Response) => {
  try {
    const { activo } = req.query;

    let queryText = "SELECT * FROM repartidores";
    const queryParams: any[] = [];

    if (activo !== undefined) {
      if (activo === "true" || activo === "false") {
        queryText += " WHERE activo = $1";
        queryParams.push(activo === "true");
      } else {
        return res.status(400).json({
          error: "El parámetro activo debe ser true o false",
        });
      }
    }

    queryText += " ORDER BY id;";

    const resultado = await poolRepartidores.query(
      queryText,
      queryParams,
    );

    return res.json({
      message: "Conexión exitosa a la DB",
      total: resultado.rowCount,
      data: resultado.rows,
    });
  } catch (error) {
    console.error("Error al consultar repartidores:", error);

    return res.status(500).json({
      error: "Error al conectar con la DB",
    });
  }
});

// GET /repartidores/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El parámetro id debe ser un número válido",
      });
    }

    const resultado = await poolRepartidores.query(
      "SELECT * FROM repartidores WHERE id = $1;",
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "No existe un repartidor con ese ID",
      });
    }

    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al buscar repartidor:", error);

    return res.status(500).json({
      error: "Error al buscar el repartidor",
    });
  }
});

// POST /repartidores
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      vehiculo,
      telefono,
      activo,
    } = req.body;

    if (
      !nombre ||
      !vehiculo ||
      !telefono ||
      typeof activo !== "boolean"
    ) {
      return res.status(400).json({
        error:
          "nombre, vehiculo, telefono y activo son obligatorios",
      });
    }

    const resultado = await poolRepartidores.query(
      `
      INSERT INTO repartidores
      (nombre, vehiculo, telefono, activo)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [nombre, vehiculo, telefono, activo],
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear repartidor:", error);

    return res.status(500).json({
      error: "Error al crear el repartidor",
    });
  }
});

// PUT /repartidores/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El parámetro id debe ser un número válido",
      });
    }

    const {
      nombre,
      vehiculo,
      telefono,
      activo,
    } = req.body;

    if (
      !nombre ||
      !vehiculo ||
      !telefono ||
      typeof activo !== "boolean"
    ) {
      return res.status(400).json({
        error:
          "nombre, vehiculo, telefono y activo son obligatorios",
      });
    }

    const resultado = await poolRepartidores.query(
      `
      UPDATE repartidores
      SET nombre = $1,
          vehiculo = $2,
          telefono = $3,
          activo = $4
      WHERE id = $5
      RETURNING *;
      `,
      [
        nombre,
        vehiculo,
        telefono,
        activo,
        id,
      ],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Repartidor no encontrado",
      });
    }

    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al actualizar repartidor:", error);

    return res.status(500).json({
      error: "Error al actualizar el repartidor",
    });
  }
});

// DELETE /repartidores/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El parámetro id debe ser un número válido",
      });
    }

    const resultado = await poolRepartidores.query(
      `
      DELETE FROM repartidores
      WHERE id = $1
      RETURNING *;
      `,
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Repartidor no encontrado",
      });
    }

    return res.json({
      message: "Repartidor eliminado exitosamente",
      repartidor: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar repartidor:", error);

    return res.status(500).json({
      error: "Error al eliminar el repartidor",
    });
  }
});

export default router;