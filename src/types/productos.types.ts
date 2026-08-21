interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  disponible: boolean;
}

// Interfaz para la creación (campos obligatorios en req.body)
interface CrearProductoBody {
  nombre: string;
  categoria: string;
  precio: number;
  disponible: boolean;
}
interface ActualizarProducto {
  nombre: string;
  categoria: string;
  precio: number;
  disponible: boolean;
}

//export type ActualizarProducto = Partial<CrearProductoBody>;

// Tipo para la actualización (todos los campos opcionales)
export type { Producto, CrearProductoBody, ActualizarProducto };
