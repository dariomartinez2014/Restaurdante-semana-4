interface estudiante {
  id: number;
  nombre: string;
  pais: string;
  edad: number;
  activo: boolean;
  notas: number[];
}
interface crearEstudiante {
  nombre: string;
  pais: string;
  edad: number;
  notas?: number[];
}
interface actualizarEstudiante {
  nombre: string;
  pais: string;
  edad: number;
  activo: boolean;
  notas: number[];
}
interface estudiantesFiltrados {
  nombre?: string;
  pais?: string;
  minEdad?: string;
  activo?: string;
}

interface idParam {
  id: string;
}
interface notasParams {
  id: string;
  notaIndex: string;
}

export type {
  estudiante,
  crearEstudiante,
  actualizarEstudiante,
  estudiantesFiltrados,
  idParam,
  notasParams,
};
