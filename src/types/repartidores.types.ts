interface repartidores {
  id: number;
  nombre: string;
  vehiculo: string;
  activo: boolean;
  pedidosAsignados: number[];
  telefono: string;
}
interface crearRepartidor {
  nombre: string;
  vehiculo: string;
  telefono: string;
  activo: boolean;
}
interface actualizarRepartidor {
  vehiculo: string;
  activo: boolean;
  telefono: string;
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
