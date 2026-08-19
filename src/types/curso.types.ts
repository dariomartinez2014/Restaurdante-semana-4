interface curso {
  id: number;
  titulo: string;
  duracionSemanas: number;
  publicado: boolean;
}

interface crearCurso {
  titulo: string;
  duracionSemanas: number;
}
interface actualizarCurso {
  titulo: string;
  duracionSemanas: number;
  publicado: boolean;
}

export type { curso, crearCurso, actualizarCurso };
