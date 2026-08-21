import { Router } from "express";
import type { Request, Response } from "express";
import { listaClientes, setListaClientes } from "../data/clientes.js";
import type { Cliente } from "../types/clientes.types.js";

const router = Router();

//endpoint GET clientes
router.get("/", (req: Request, res: Response) => {
  //GET clientes, muestro todos y si indican ciudad, lo filtro
  const { ciudad } = req.query;

  if (ciudad && typeof ciudad !== "string") {
    return res.status(400).json({
      mensaje: "Ciudad debe ser un texto",
    });
  }

  const resultado = ciudad
    ? listaClientes.filter(
        (cliente) => cliente.ciudad.toLowerCase() === ciudad.toLowerCase(),
      )
    : listaClientes;

  return res.status(200).json(resultado);
});

//GET clientes/:id
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      mensaje: "ID debe ser tipo numérico",
    });
  }

  const cliente = listaClientes.find((cliente) => cliente.id === id);

  if (!cliente) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado!",
    });
  }

  return res.status(200).json(cliente);
});

//POST clientes
router.post("/", (req: Request, res: Response) => {
  const { nombre, apellidos, telefono, direccion, ciudad, email } = req.body;

  if (!nombre || !telefono || !direccion || !ciudad) {
    return res.status(400).json({
      mensaje: "estos datos son obligatorios y deben ser del tipo correcto",
    });
  }

  const nuevoCliente: Cliente = {
    id: listaClientes.length > 0 ? listaClientes.length - 1 + 1 : 1,
    nombre,
    apellidos,
    telefono,
    direccion,
    ciudad,
    email,
  };

  listaClientes.push(nuevoCliente);

  return res.status(201).json(nuevoCliente);
});

//PUT clientes/:id
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      mensaje: "El id debe ser de tipo numerico",
    });
  }

  const cliente = listaClientes.find((cliente) => cliente.id === id);

  if (!cliente) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado!!",
    });
  }

  const { telefono, direccion } = req.body;

  if (telefono !== undefined && typeof telefono !== "number") {
    return res.status(400).json({
      mensaje: "El telefono debe ser tipo number",
    });
  }

  if (direccion !== undefined && typeof direccion !== "string") {
    return res.status(400).json({
      mensaje: "Direccion debe ser de tipo texto",
    });
  }

  if (telefono !== undefined) {
    cliente.telefono = telefono;
  }

  if (direccion !== undefined) {
    cliente.direccion = direccion;
  }

  return res.status(200).json(cliente);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      mensaje: "Id debe ser numérico",
    });
  }

  const indice = listaClientes.findIndex((cliente) => cliente.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado",
    });
  }

  const clienteEliminado = listaClientes.splice(indice, 1)[0];

  return res.status(200).json({
    mensaje: "Cliente eliminado!!",
    cliente: clienteEliminado,
  });
});

export default router;
