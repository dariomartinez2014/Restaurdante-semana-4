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

export const updatePedidoSchema = z.object({
  detalles: z
    .string({
      message: "El detalle es obligatorio",
    })
    .min(3, "El detalle debe tener al menos 3 caracteres")
    .trim()
    .min(1)
    .optional(),

  total: z
    .number({
      message: "El total es obligatorio",
    })
    .positive("El total debe ser mayor a 0")
    .optional(),

  cliente_id: z
    .number({
      message: "El cliente_id es obligatorio",
    })
    .positive("El cliente_id debe ser mayor a 0")
    .optional(),

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
    )
    .optional(),
});

export type UpdatePedidoInput = z.infer<typeof updatePedidoSchema>;
