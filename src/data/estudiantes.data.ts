import fs from "node:fs/promises";
import path from "node:path";
import type { estudiante } from "../types/estudiante.types.js";

export let listaEstudiantesFunvaleros: estudiante[] = [];

export async function cargarDatos() {
  try {
    const ruta = path.resolve("src/ejercicio.json");
    const data = await fs.readFile(ruta, "utf-8");
    listaEstudiantesFunvaleros = JSON.parse(data);
    console.log(
      `DATOS CARGADOS EN MEMORIA: ${listaEstudiantesFunvaleros.length} estudiantse cargados`,
    );
  } catch (error) {
    console.log("No se encontraron estudiantes en la lista o lista vacia");
    listaEstudiantesFunvaleros = [];
  }
}

export function setListaEstudiantes(nuevaLista: estudiante[]) {
  listaEstudiantesFunvaleros = nuevaLista;
}
