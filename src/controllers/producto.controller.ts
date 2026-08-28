import type { Request, Response } from "express";
import { ProductoModel } from "../models/producto.model.js";
import { crearProductoSchema } from "../schemas/producto.schema.js";
import { productoService } from "../services/producto.service.js";

// GET /productos
export async function getProductos(req: Request, res: Response) {
  /*
    #swagger.tags = ['PRODUCTOS']
    #swagger.summary = 'VER TODOS LOS PRODUCTOS'

    #swagger.parameters['pagina'] = {
      in: 'query',
      description: 'Pon el numero de pagina',
      type: 'integer',
      default: 1
    }

    #swagger.responses[200] = {
      description: 'LISTA DE PRODUCTOS',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            nombre: { type: 'string', example: 'Pollo' },
            categoria: { type: 'string', example: 'Proteinas' },
            precio: { type: 'number', example: 20 }
            disponibilidad: { type: 'boolean', example: true }
          }
        }
      }
    }
  */
  try {
    const product = await productoService.getProductosFilters(req.query);
    res.json(product);
  } catch (error) {
    console.error("Error al consultar productos:", error);

    return res.status(500).json({
      message: "Error en la conexión del servidor",
    });
  }
}

// GET /productos/:id
export async function getProductosById(req: Request, res: Response) {
  // #swagger.tags = ['LISTA DE PRODUCTOS POR ID']
  // #swagger.description = 'BUSCAR UN PRODUCTO POR SU ID'
  /*  #swagger.parameters['id'] = {
          in: 'path',
          description: 'BUSCAR ID DEL PRODUCTO',
          required: true,
          type: 'integer'
  } */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El ID ingresado debe ser numerico" });
      return;
    }
    const product = await ProductoModel.findById(id);
    if (!product) {
      res.status(400).json({ error: "No se ha encontrado el producto" });
      return;
    }
    res.json({ data: product });
    /*const product = await ProductoModel.findById(result.data.id);
    if (!product) {
      res.status(400).json({ error: "No se ha encontrado el producto" });
      return;
    }
    
    res.json({ data: product });*/
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

// POST /productos
export async function postProducto(req: Request, res: Response) {
  /*
    #swagger.tags = ['LISTA DE PRODUCTOS']
    #swagger.summary = 'CREAR A UN PRODUCTO'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'INGRESE ESTA INFORMACION PARA PODER CREAR UN PRODUCTO',
      required: true,
      schema: {
        $nombre: "Alimentos",
        $categoria: "De todo"
        &precio: 50
        &disponibilidad: "TRUE"
      }
    }
  */
  try {
    const result = crearProductoSchema.safeParse(req.body);
    console.log(result);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const newProduct = await ProductoModel.create(result.data);
    res.status(201).json({ data: newProduct });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

// PUT /productos/:id
export async function putProducto(req: Request, res: Response) {
  /*
      #swagger.tags = ['LISTA DE PRODUCTOS']
      #swagger.summary = 'ACTUALIZAR UN PRODUCTO'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'SE NECESITA LA ID DEL PRODUCTO PARA ACTUALIZARLO',
        required: true,
        type: 'integer'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'INGRESE LA INFORMACION A ACTUALIZAR DE LA SIGUIENTE MANERA',
        required: true,
        schema: {
          nombre: "Coca Cola",
          categoria: "Refrescos",
          precio: 80
          disponibilidad: "FALSE" 
        }
      }
    */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res
        .status(400)
        .json({ error: "El ID ingresado debe ser un valor numerico" });
    }
    const productoUpdate = await ProductoModel.update(id, req.body);
    if (!productoUpdate) {
      res.status(404).json({ error: "No se ha encontrado el producto" });
      return;
    }
    res.json({ data: productoUpdate });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

// DELETE /productos/:id
export async function deleteProducto(req: Request, res: Response) {
  /*
    #swagger.tags = ['LISTA DE PRODUCTOS']
    #swagger.summary = 'ELIMINAR UN PRODUCTO'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'SE DEBE INGRESAR LA ID DEL PRODUCTO A ELIMINAR',
      required: true,
      type: 'integer'
    }
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El ID ingresado debe ser numerico" });
    }
    const productEliminado = await ProductoModel.delete(id);
    if (productEliminado) {
      res
        .status(200)
        .json({ message: "El producto ha sido eliminado con exito" });
    } else {
      res.status(404).json({ message: "No se ha encontrado el producto" });
    }
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
