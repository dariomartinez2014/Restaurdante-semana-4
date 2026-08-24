import { Router } from "express";
import type { Request, Response } from "express";
import pool from "../config/database.js";
import type {
  Cliente,
  crearCliente,
  actualizarCliente,
  clientesFiltrados,
  idParams,
} from "../types/clientes.types.js";

const router = Router();

//endpoint GET clientes filtros
router.get(
  "/",
async function (req: Request<{}, {}, {}, clientesFiltrados>, res: Response) {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Obtiene la lista de clientes con filtros'
    /*  #swagger.parameters['ciudad'] = {
            in: 'query',
            description: 'coloca la cuidad del cliente',
            type: 'string'
    } */

    const ciudad = req.query.cuidad;
    const resultado = await pool.query("SELECT * FROM clientes");

    //filtro para el estado activo del repartidor
    if (ciudad) {
      resultado.rows = resultado.rows.filter(
        (e) => e.ciudad.toLowerCase() === ciudad.toLowerCase(),
      );
    }

    // mostrar el resultado filtrado
     return res.json({
    total: resultado.rows.length,
    datos: resultado.rows,
});
  },
);

//GET clientes/:id
router.get("/:id", async function (req: Request<idParams>, res: Response) {
  // #swagger.tags = ['Clientes']
  // #swagger.description = 'Obtiene la informacion de un Cliente en especifico por su id'
  /*  #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID del cliente a buscar',
          required: true,
          type: 'integer'
  } */
  const idBuscado = Number(req.params.id);

  if (isNaN(idBuscado)) {
    return res
      .status(400)
      .json({ error: "El parametro id debe ser un numero valido" });
  }
  const resultado = await pool.query("SELECT * FROM clientes WHERE id = $1", [idBuscado]);

if (resultado.rows.length === 0) {
  return res.status(404).json({ error: "no existe un cliente con ese ID" });
}

return res.json(resultado.rows[0]);
});

//POST clientes
router.post("/", async function (req: Request<{}, {}, crearCliente>, res: Response) {
  /*
      #swagger.tags = ['Clientes']
      #swagger.summary = 'crear un cliente nuevo'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para crear un cliente nuevo',
        required: true,
        schema: {
          $nombre: "Marco",
          $telefono: "75060047",
          $direccion: "calle tamu",
          $ciudad: "buenos aires"
        }
      }
    */
       const { nombre, apellido, telefono, direccion, ciudad } = req.body;

if (!nombre || !apellido || !direccion || !telefono || !ciudad) {
  return res.status(400).json({
    error: "faltan datos que son obligatorios"
  });
}

const resultado = await pool.query(
  `INSERT INTO clientes (nombre, apellido, telefono, direccion, ciudad)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING *`,
  [nombre, apellido, telefono, direccion, ciudad]
);

return res.status(201).json(resultado.rows[0]);
});

//PUT clientes/:id
router.put("/:id", async function (req: Request, res: Response) {
  /*
    #swagger.tags = ['Clientes']
    #swagger.summary = 'actualizar un cliente existente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del cliente a actualizar',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del cliente',
      required: true,
      schema: {
        direccion: "av. padilla",
        telefono: "60949745"
      }
    }
  */
  const idBuscado = Number(req.params.id);
 const { telefono, direccion }: actualizarCliente = req.body;
 const resultado = await pool.query(
  `UPDATE clientes
   SET telefono = COALESCE($1, telefono),
       direccion = COALESCE($2, direccion)
   WHERE id = $3
   RETURNING *`,
  [telefono, direccion, idBuscado]
);
if (resultado.rows.length === 0) {
  return res.status(404).json({ error: "Cliente no encontrado" });
}
return res.json(resultado.rows[0]);
});

router.delete("/:id", async function (req: Request, res: Response) {
  /*
    #swagger.tags = ['Clientes']
    #swagger.summary = 'eliminar un cliente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del cliente a eliminar',
      required: true,
      type: 'integer'
    }
  */
  const idBuscado = Number(req.params.id);
 const resultado = await pool.query(
  "DELETE FROM clientes WHERE id = $1 RETURNING *",
  [idBuscado]
);
if (resultado.rows.length === 0) {
  return res.status(404).json({
    error: "Cliente no encontrado"
  });
}
return res.json({
  mensaje: "CLIENTE ELIMINADO EXITOSAMENTE",
  cliente: resultado.rows[0]
});
});

export default router;
