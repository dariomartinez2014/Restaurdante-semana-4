import fs from "node:fs/promises";
import path from "node:path";
import type { Cliente } from "../types/clientes.types.js";

export let listaClientes: Cliente[] = [];

export function setListaClientes(nuevaLista: Cliente[]) {
  listaClientes = nuevaLista;
}
