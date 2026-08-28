import { z } from "zod";


// ZOD PARA POST (CREAR)
export const crearProductoSchema = z.object({
    //NOMBRE
    nombre: z
    .string({
      message: "El nombre es ser obligatorio",
    })
    .min(3, "el nombre debe tener 3 letras o más")
    .trim()
    .min(1),

    //CATEGORIA
    categoria: z
    .string({
      message: "la categoria es ser obligatorio",
    })
    .min(3, "la categoria debe tener más de 3 letas")
    .trim()
    .min(1),

    //PRECIO
      precio: z
    .number({
      message: "El precio es obligatorio",
    })
    .positive("el precio debe ser mayor a 0"),
});



//PAGINACION Y ZOD PARA PUT

export interface productoQueryParams {
  pagina?: string;
  limite?: string;
  busqueda?: string;
  minPrecio?: string;
  maxPrecio?: string;
}



//ZOD PARA PUT (ACTUALIZAR)

export const updateProductoSchema = crearProductoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "SE DEBE INGRESAR AL MENOS UN DATO PARA ACTUALIZAR",
  });
