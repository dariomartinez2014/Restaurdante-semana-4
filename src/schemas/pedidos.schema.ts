import { z } from "zod";

export const createPedidoSchema = z.object({
  detalles: z
    .string({
      message: "El detalle es obligatorio",
    })
    .min(3, "El detalle debe tener al menos 3 caracteres")
    .trim()
    .min(1),

  total: z
    .number({
      message: "El total es obligatorio",
    })
    .positive("El total debe ser mayor a 0"),

  cliente_id: z
    .number({
      message: "El cliente_id es obligatorio",
    })
    .positive("El cliente_id debe ser mayor a 0"),

  estado: z
    .string({
      message: "El estado es obligatorio",
    })
    .trim()
    .toLowerCase()
    .pipe(
      z.enum(["pendiente", "preparando", "entregado"], {
        message: "El estado debe ser pendiente, preparando o entregado",
      }),
    ),
});

export interface pedidoQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  minTotal?: string;
  maxTotal?: string;
}

export const updatePedidoSchema = createPedidoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });
