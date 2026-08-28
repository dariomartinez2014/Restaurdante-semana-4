import { z } from "zod";

export const createRepartidorSchema = z.object({
  nombre: z
    .string({ message: "el nombre debe ser un texto valido" })
    .trim()
    .min(1, "el nombre debe ser un texto valido"),
  vehiculo: z
    .string({ message: "el vehiculo debe ser un texto valido" })
    .trim()
    .min(1, "el vehiculo debe ser un texto valido"),
  telefono: z
    .string({ message: "el telefono debe ser un texto valido" })
    .trim()
    .min(1, "el telefono debe ser un texto valido"),
  activo: z.boolean({ message: "el campo activo debe ser booleano" }),
  pedidosAsignados: z.array(z.number().int(), {
    message: "pedidosAsignados en un array de numeros enteros [1, 2, 20]",
  }),
});

export const updateRepartidorSchema = createRepartidorSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

export const paramsIdSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive("El ID debe ser un número entero positivo"),
});

export const queryRepartidorSchema = z.object({
  nombre: z.string().trim().optional(),
  vehiculo: z.string().trim().optional(),
  activo: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(100).default(10),
  orderBy: z.enum(["id", "nombre", "vehiculo"]).default("id"),
  orderDir: z.enum(["ASC", "DESC", "asc", "desc"]).default("ASC"),
});

export type QueryRepartidor = z.infer<typeof queryRepartidorSchema>;
