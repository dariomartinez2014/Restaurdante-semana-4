import fs from "node:fs/promises";
import path from "node:path";
import type { Producto } from "../types/productos.types.js";

export let listaProductos: Producto[] = [
  {
    id: 1,
    nombre: "Hamburguesa Clásica",
    categoria: "comida",
    precio: 25,
    disponible: true,
  },
  {
    id: 2,
    nombre: "Limonada Natural",
    categoria: "bebida",
    precio: 10,
    disponible: true,
  },
  {
    id: 3,
    nombre: "Pizza Pepperoni Grande",
    categoria: "comida",
    precio: 55,
    disponible: true,
  },
  {
    id: 4,
    nombre: "Tacos al Pastor (3 uds)",
    categoria: "comida",
    precio: 30,
    disponible: true,
  },
  {
    id: 5,
    nombre: "Cerveza Artesanal",
    categoria: "bebida",
    precio: 18,
    disponible: false,
  },
  {
    id: 6,
    nombre: "Papas Fritas Medianas",
    categoria: "comida",
    precio: 15,
    disponible: true,
  },
  {
    id: 7,
    nombre: "Café Americano",
    categoria: "bebida",
    precio: 8,
    disponible: true,
  },
  {
    id: 8,
    nombre: "Ensalada César con Pollo",
    categoria: "comida",
    precio: 32,
    disponible: true,
  },
  {
    id: 9,
    nombre: "Milkshake de Frutilla",
    categoria: "bebida",
    precio: 16,
    disponible: false,
  },
  {
    id: 10,
    nombre: "Brownie con Helado",
    categoria: "postre",
    precio: 20,
    disponible: true,
  },
];

export function setListaClientes(nuevaLista: Producto[]) {
  listaProductos = nuevaLista;
}
