import fs from "node:fs/promises";
import path from "node:path";
import type { Producto } from "../types/productos.types.js";

export let listaProductos: Producto[] = [
  {
    id: 1,
    nombre: "Hamburguesa Clásica",
    categoria: "Hamburguesas",
    precio: 35,
    disponible: true,
  },
  {
    id: 2,
    nombre: "Hamburguesa Doble",
    categoria: "Hamburguesas",
    precio: 45,
    disponible: true,
  },
  {
    id: 3,
    nombre: "Pizza Familiar",
    categoria: "Pizzas",
    precio: 120,
    disponible: true,
  },
  {
    id: 4,
    nombre: "Pizza Mediana",
    categoria: "Pizzas",
    precio: 80,
    disponible: true,
  },
  {
    id: 5,
    nombre: "Papas Fritas",
    categoria: "Acompañamientos",
    precio: 20,
    disponible: true,
  },
  {
    id: 6,
    nombre: "Alitas de Pollo",
    categoria: "Acompañamientos",
    precio: 40,
    disponible: true,
  },
  {
    id: 7,
    nombre: "Pollo Broaster",
    categoria: "Pollos",
    precio: 45,
    disponible: true,
  },
  {
    id: 8,
    nombre: "Salchipapa",
    categoria: "Comida rápida",
    precio: 30,
    disponible: true,
  },
  {
    id: 9,
    nombre: "Coca Cola",
    categoria: "Bebidas",
    precio: 10,
    disponible: true,
  },
  {
    id: 10,
    nombre: "Jugo Natural",
    categoria: "Bebidas",
    precio: 12,
    disponible: true,
  },
  {
    id: 11,
    nombre: "Agua Mineral",
    categoria: "Bebidas",
    precio: 7,
    disponible: true,
  },
  {
    id: 12,
    nombre: "Helado de Chocolate",
    categoria: "Postres",
    precio: 15,
    disponible: false,
  },
];

export function setListaClientes(nuevaLista: Producto[]) {
  listaProductos = nuevaLista;
}
