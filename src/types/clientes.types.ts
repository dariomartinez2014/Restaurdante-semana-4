interface Cliente {
  id: number;
  nombre: string;
  apellidos?: string; //es opcional
  telefono: number;
  direccion: string;
  ciudad: string; //pide filtrar por ciudad
  email?: string; //es opcional
}

export type { Cliente };
