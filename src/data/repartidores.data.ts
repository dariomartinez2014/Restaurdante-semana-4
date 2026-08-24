import fs from "node:fs/promises";
import path from "node:path";
import type { repartidores } from "../types/repartidores.types.js";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const poolRepartidores = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

let resultado = await poolRepartidores.query("SELECT * FROM repartidores;");

export let listaRepartidores: repartidores[] = [];
listaRepartidores = resultado.rows;

export function setListaRepartidores(nuevaLista: repartidores[]) {
  listaRepartidores = nuevaLista;
}

export function setListaRepartidoresDB(nuevaLista: repartidores[]) {}
