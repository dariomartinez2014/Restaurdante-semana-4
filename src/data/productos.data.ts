import fs from "node:fs/promises";
import path from "node:path";
import type { Producto } from "../types/productos.types.js";

export let listaProductos: Producto[] = [];

export function setListaClientes(nuevaLista: Producto[]) {
  listaProductos = nuevaLista;
}
