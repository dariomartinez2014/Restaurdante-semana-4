interface Cliente {
  id: number;
  nombre: string;
  apellidos?: string | undefined; //es opcional
  telefono: string;
  direccion: string;
  ciudad: string; //pide filtrar por ciudad
  email?: string | undefined; //es opcional
}

interface crearCliente {
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  ciudad: string;
}
interface actualizarCliente {
  direccion: string;
  telefono: string;
}
interface clientesFiltrados {
  cuidad?: string;
}

interface idParams {
  id: string;
}

export type {
  Cliente,
  crearCliente,
  actualizarCliente,
  clientesFiltrados,
  idParams,
};
