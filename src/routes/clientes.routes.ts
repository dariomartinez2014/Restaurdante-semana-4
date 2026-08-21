import { Router } from "express";
import type { Request, Response } from "express";
import { listaClientes, setListaClientes } from "../data/clientes.js";
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
  function (req: Request<{}, {}, {}, clientesFiltrados>, res: Response) {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Obtiene la lista de clientes con filtros'
    /*  #swagger.parameters['ciudad'] = {
            in: 'query',
            description: 'coloca la cuidad del cliente',
            type: 'string'
    } */

    const ciudad = req.query.cuidad;
    let resultado = [...listaClientes];

    //filtro para el estado activo del repartidor
    if (ciudad) {
      resultado = resultado.filter(
        (e) => e.ciudad.toLowerCase() === ciudad.toLowerCase(),
      );
    }

    // mostrar el resultado filtrado
    return res.json({
      total: resultado.length,
      datos: resultado,
    });
  },
);

//GET clientes/:id
router.get("/:id", function (req: Request<idParams>, res: Response) {
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
  const clienteFiltrado = listaClientes.find((e) => e.id === idBuscado);

  if (!clienteFiltrado) {
    return res.status(404).json({ error: "no existe un cliente con ese ID" });
  }
  return res.json(clienteFiltrado);
});

//POST clientes
router.post("/", function (req: Request<{}, {}, crearCliente>, res: Response) {
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
  const { nombre, telefono, direccion, ciudad } = req.body;
  if (!nombre || !direccion || !telefono || !ciudad) {
    return res.status(400).json({ error: "faltan datos que son obligatorios" });
  }
  const nuevoCliente: Cliente = {
    id: listaClientes.length > 0 ? listaClientes.length + 1 : 1,
    nombre,
    telefono,
    direccion,
    ciudad,
  };
  listaClientes.push(nuevoCliente);
  res.status(201).json(nuevoCliente);
});

//PUT clientes/:id
router.put("/:id", function (req: Request, res: Response) {
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
  const index = listaClientes.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res.status(404).json({ error: "Cliente no encontrado" });
  } else {
    const cliente = listaClientes[index]!;
    const { telefono, direccion }: actualizarCliente = req.body;

    // actualizando la informacion del usuario
    listaClientes[index] = {
      id: idBuscado,
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      telefono: telefono ?? listaClientes[index]?.telefono,
      direccion: direccion ?? listaClientes[index]?.direccion,
      ciudad: cliente.ciudad,
      email: cliente.email,
    };
    res.json(listaClientes[index]);
  }
});

router.delete("/:id", function (req: Request, res: Response) {
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
  const index = listaClientes.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "Cliente no encontrado no podemos eliminarlo" });
  } else {
    let Listanueva = listaClientes.filter((e) => e.id !== idBuscado);
    setListaClientes(Listanueva);
    res.json({ mensaje: "CLIENTE ELIMINADO EXITOSAMENTE" });
  }
});

export default router;
