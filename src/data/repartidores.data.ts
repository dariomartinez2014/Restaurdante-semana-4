import fs from "node:fs/promises";
import path from "node:path";
import type { repartidores } from "../types/repartidores.types.js";

export let listaRepartidores: repartidores[] = [];

export function setListaRepartidores(nuevaLista: repartidores[]) {
  listaRepartidores = nuevaLista;
}
