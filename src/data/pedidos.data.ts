import type { Pedido } from "../types/pedidos.types.js";

export let listaPedidos: Pedido[] = [
  {
    id: 1,
    clienteId: 1,
    detalles: "2 hamburguesas y 1 gaseosa",
    total: 80,
    estado: true,
  },
  {
    id: 2,
    clienteId: 2,
    detalles: "1 pizza familiar",
    total: 120,
    estado: true,
  },
  {
    id: 3,
    clienteId: 3,
    detalles: "3 hamburguesas clásicas y 2 papas fritas",
    total: 145,
    estado: false,
  },
  {
    id: 4,
    clienteId: 4,
    detalles: "1 pollo broaster y 1 gaseosa",
    total: 55,
    estado: true,
  },
  {
    id: 5,
    clienteId: 5,
    detalles: "2 pizzas medianas",
    total: 160,
    estado: false,
  },
  {
    id: 6,
    clienteId: 6,
    detalles: "1 salchipapa y 1 jugo natural",
    total: 42,
    estado: true,
  },
  {
    id: 7,
    clienteId: 7,
    detalles: "2 hamburguesas dobles y 2 papas fritas",
    total: 130,
    estado: false,
  },
  {
    id: 8,
    clienteId: 8,
    detalles: "1 pizza familiar, 1 gaseosa y 1 helado",
    total: 145,
    estado: true,
  },
  {
    id: 9,
    clienteId: 9,
    detalles: "2 pollos broaster y 2 jugos naturales",
    total: 114,
    estado: false,
  },
  {
    id: 10,
    clienteId: 10,
    detalles: "1 pizza familiar y 2 gaseosas",
    total: 140,
    estado: true,
  },
];
