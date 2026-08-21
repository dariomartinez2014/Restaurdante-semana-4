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
];
