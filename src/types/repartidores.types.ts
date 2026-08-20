interface repartidores {
  id: number;
  nombre: string;
  vehiculo: string;
  activo: boolean;
  pedidosAsignados: number[];
}
interface crearRepartidor {
  nombre: string;
  vehiculo: string;
  pedidosAsignados?: number[];
}
interface actualizarRepartidor {
  nombre: string;
  vehiculo: string;
  activo: boolean;
  pedidosAsignados: number[];
}
interface repartidoresFiltrados {
  nombre?: string;
  vehiculo?: string;
  activo?: string;
}

interface pedidosParams {
  id: string;
  pedidoAsignadoIndex: string;
}

export type {
  repartidores,
  crearRepartidor,
  actualizarRepartidor,
  repartidoresFiltrados,
  pedidosParams,
};
