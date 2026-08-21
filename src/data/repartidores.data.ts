import fs from "node:fs/promises";
import path from "node:path";
import type { repartidores } from "../types/repartidores.types.js";

export let listaRepartidores: repartidores[] = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    vehiculo: "ABC-1234",
    activo: true,
    pedidosAsignados: [1, 3],
    telefono: "75012345",
  },
  {
    id: 2,
    nombre: "Luis Fernández",
    vehiculo: "BDF-5678",
    activo: true,
    pedidosAsignados: [2],
    telefono: "76543210",
  },
  {
    id: 3,
    nombre: "Jorge Ramírez",
    vehiculo: "CDE-9012",
    activo: false,
    pedidosAsignados: [],
    telefono: "71234567",
  },
  {
    id: 4,
    nombre: "Diego Vargas",
    vehiculo: "DEF-3456",
    activo: true,
    pedidosAsignados: [4, 5],
    telefono: "78901234",
  },
  {
    id: 5,
    nombre: "Miguel Torres",
    vehiculo: "FGH-7890",
    activo: true,
    pedidosAsignados: [6],
    telefono: "70123456",
  },
  {
    id: 6,
    nombre: "Andrés López",
    vehiculo: "GHI-2345",
    activo: false,
    pedidosAsignados: [],
    telefono: "77654321",
  },
  {
    id: 7,
    nombre: "Fernando Castillo",
    vehiculo: "JKL-6789",
    activo: true,
    pedidosAsignados: [7, 8],
    telefono: "73456789",
  },
  {
    id: 8,
    nombre: "Ricardo Salazar",
    vehiculo: "LMN-0123",
    activo: true,
    pedidosAsignados: [9],
    telefono: "70987654",
  },
  {
    id: 9,
    nombre: "José Paredes",
    vehiculo: "MNP-4567",
    activo: true,
    pedidosAsignados: [],
    telefono: "72123456",
  },
  {
    id: 10,
    nombre: "Ángel Rojas",
    vehiculo: "PQR-8901",
    activo: false,
    pedidosAsignados: [10],
    telefono: "69874521",
  },
];

export function setListaRepartidores(nuevaLista: repartidores[]) {
  listaRepartidores = nuevaLista;
}
