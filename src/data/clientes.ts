import fs from "node:fs/promises";
import path from "node:path";
import type { Cliente } from "../types/clientes.types.js";

export let listaClientes: Cliente[] = [
  {
    id: 1,
    nombre: "Marco",
    apellidos: "García López",
    telefono: "75060047",
    direccion: "Av. Busch",
    ciudad: "Santa Cruz",
    email: "marco@gmail.com",
  },
  {
    id: 2,
    nombre: "María",
    apellidos: "Fernández Rojas",
    telefono: "71234567",
    direccion: "Calle Warnes",
    ciudad: "Santa Cruz",
    email: "maria@gmail.com",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellidos: "Mendoza Pérez",
    telefono: "76543210",
    direccion: "Av. Banzer",
    ciudad: "Santa Cruz",
  },
  {
    id: 4,
    nombre: "Ana",
    apellidos: "Torrez Vargas",
    telefono: "69874521",
    direccion: "Calle Aroma",
    ciudad: "Cochabamba",
    email: "ana@gmail.com",
  },
  {
    id: 5,
    nombre: "Luis",
    apellidos: "Quispe Mamani",
    telefono: "73456789",
    direccion: "Av. 6 de Agosto",
    ciudad: "La Paz",
    email: "luis@gmail.com",
  },
  {
    id: 6,
    nombre: "Sofía",
    apellidos: "Rodríguez Castro",
    telefono: "70123456",
    direccion: "Calle Sucre",
    ciudad: "Sucre",
  },
  {
    id: 7,
    nombre: "Jorge",
    apellidos: "Paredes Silva",
    telefono: "78901234",
    direccion: "Av. Blanco Galindo",
    ciudad: "Cochabamba",
    email: "jorge@gmail.com",
  },
  {
    id: 8,
    nombre: "Valeria",
    apellidos: "Gómez Herrera",
    telefono: "72123456",
    direccion: "Calle Beni",
    ciudad: "Santa Cruz",
    email: "valeria@gmail.com",
  },
  {
    id: 9,
    nombre: "Diego",
    apellidos: "Salazar Flores",
    telefono: "77654321",
    direccion: "Av. Mariscal Santa Cruz",
    ciudad: "La Paz",
  },
  {
    id: 10,
    nombre: "Camila",
    apellidos: "Vargas Molina",
    telefono: "70987654",
    direccion: "Calle Junín ",
    ciudad: "Sucre",
    email: "camila@gmail.com",
  },
];

export function setListaClientes(nuevaLista: Cliente[]) {
  listaClientes = nuevaLista;
}
