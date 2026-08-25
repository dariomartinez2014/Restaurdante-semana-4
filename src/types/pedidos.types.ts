interface Pedido {
  id: number;
  clienteId: number;
  detalles: string;
  total: number;
  estado: boolean;
}

interface crearPedido {
  clienteId: number;
  detalles: string;
  total: number;
  estado: boolean;
}

interface actualizarPedido {
  estado: boolean;
}

interface pedidosFiltrados {
  estado?: boolean;
}

interface idParams {
  id: string;
}

export type {
  Pedido,
  crearPedido,
  actualizarPedido,
  pedidosFiltrados,
  idParams,
};