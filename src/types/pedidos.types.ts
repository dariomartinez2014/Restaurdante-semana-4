interface Pedido {
  id: number;
  cliente_id: number;
  detalles: string;
  total: number;
  estado: string;
}

interface crearPedido {
  cliente_id: number;
  detalles: string;
  total: number;
  estado: string;
}

interface actualizarPedido {
  estado: string;
}

interface pedidosFiltrados {
  estado?: string;
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
