import { Router } from "express";
import type { Request, Response } from "express";
import { listaProductos } from "../data/productos.data.js";
import type {
  Producto,
  CrearProductoBody,
  ActualizarProducto,
} from "../types/productos.types.js";

const router = Router();

// 1. GET /productos (Listar todos / filtrar por categoría)
router.get("/", (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Productos']
    #swagger.summary = 'Obtener catálogo de productos'
    #swagger.description = 'Devuelve todos los productos o permite filtrarlos opcionalmente por categoría'
    #swagger.parameters['categoria'] = {
      in: 'query',
      description: 'Filtrar por categoría (ej: comida, bebida)',
      required: false,
      type: 'string'
    }
    #swagger.responses[200] = { description: 'Lista de productos enviada exitosamente' }
  */
  const { categoria } = req.query;

  if (categoria) {
    const categoriaStr = String(categoria).toLowerCase();
    const filtrados = listaProductos.filter(
      (p) => p.categoria.toLowerCase() === categoriaStr,
    );
    return res.json(filtrados);
  }

  return res.json(listaProductos);
});

// 2. GET /listaProductos/:id (Detalles de un producto)
router.get("/:id", (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Productos']
    #swagger.summary = 'Obtener producto por ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del producto',
      required: true,
      type: 'number'
    }
    #swagger.responses[200] = { description: 'Producto encontrado' }
    #swagger.responses[400] = { description: 'ID inválido' }
    #swagger.responses[404] = { description: 'Producto no encontrado' }
  */
  const idBuscado = Number(req.params.id);

  if (isNaN(idBuscado)) {
    return res.status(400).json({ error: "El ID debe ser un número válido" });
  }

  const producto = listaProductos.find((p) => p.id === idBuscado);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  return res.json(producto);
});

// 3. POST /productos (Agregar nuevo producto)
router.post("/", (req: Request<{}, {}, CrearProductoBody>, res: Response) => {
  /*
      #swagger.tags = ['Productos']
      #swagger.summary = 'Modificar producto existente'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del producto a modificar',
        required: true,
        type: 'number'
      }
      #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del producto',
      required: true,
        schema: {
          nombre: 'nombre',
          categoria: 'comida, bebida, etc.',
          precio: 50
        }
      }    
      #swagger.responses[200] = { description: 'Producto actualizado' }
      #swagger.responses[400] = { description: 'Precio inválido' }
      #swagger.responses[404] = { description: 'Producto no encontrado' }
    */
  const { nombre, categoria, precio, disponible } = req.body;

  if (
    !nombre ||
    !categoria ||
    precio === undefined ||
    disponible === undefined
  ) {
    return res.status(400).json({
      error:
        "Los campos nombre, categoria, precio y disponible son obligatorios",
    });
  }

  if (typeof precio !== "number" || precio <= 0) {
    return res.status(400).json({
      error: "El precio debe ser un número estrictamente mayor a 0",
    });
  }

  const nuevoProducto: Producto = {
    id:
      listaProductos.length > 0
        ? Math.max(...listaProductos.map((p) => p.id)) + 1
        : 1,
    nombre: String(nombre).trim(),
    categoria: String(categoria).trim(),
    precio,
    disponible: Boolean(disponible),
  };

  listaProductos.push(nuevoProducto);
  return res.status(201).json(nuevoProducto);
});

router.put(
  "/:id",
  (req: Request<{ id: string }, {}, ActualizarProducto>, res: Response) => {
    /* 
      #swagger.tags = ['Productos']
      #swagger.summary = 'Modificar producto existente'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del producto a modificar',
        required: true,
        type: 'number'
      }
      #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                nombre: { type: 'string', example: 'Hamburguesa Doble' },
                categoria: { type: 'string', example: 'comida' },
                precio: { type: 'number', example: 30 },
                disponible: { type: 'boolean', example: false }
              }
            }
          }
        }
      }
      #swagger.responses[200] = { description: 'Producto actualizado' }
      #swagger.responses[400] = { description: 'Precio inválido' }
      #swagger.responses[404] = { description: 'Producto no encontrado' }
    */
    const idBuscado = Number(req.params.id);
    const index = listaProductos.findIndex((p) => p.id === idBuscado);

    if (index === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (req.body.precio !== undefined) {
      if (typeof req.body.precio !== "number" || req.body.precio <= 0) {
        return res.status(400).json({
          error: "El precio debe ser un número mayor a 0",
        });
      }
    }
    const productoActualizado: Producto = {
      ...listaProductos[index],
      ...req.body,
      id: idBuscado,
    };
    listaProductos[index] = productoActualizado;

    return res.json(listaProductos[index]);
  },
);

// 5. DELETE /productos/:id (Eliminar producto)
router.delete("/:id", (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Productos']
    #swagger.summary = 'Eliminar producto del catálogo'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del producto a eliminar',
      required: true,
      type: 'number'
    }
    #swagger.responses[200] = { description: 'Producto eliminado correctamente' }
    #swagger.responses[404] = { description: 'Producto no encontrado' }
  */
  const idBuscado = Number(req.params.id);
  const index = listaProductos.findIndex((p) => p.id === idBuscado);

  if (index === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const [eliminado] = listaProductos.splice(index, 1);
  return res.json({ mensaje: "Producto eliminado", producto: eliminado });
});

export default router;
