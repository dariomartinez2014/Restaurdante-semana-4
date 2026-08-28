import { ProductoModel } from "../models/producto.model.js";
import type { productoQueryParams } from "../schemas/producto.schema.js";
import type { paginaProductoResult, Productos } from "../models/producto.model.js";
import { number } from "zod";

export const productoService = {
    createProducto: async function name(
        nombre:string,
        categoria:string,
        precio:number,
    ):Promise<Productos> {
    // ELIMINA LOS ESPACIOS VACIOS DE NOMBRE Y DE CATEGORIA
    const cleanNombre = nombre.trim();
    const cleanCategoria = categoria.trim();

    //EVITA QUE SE CREEN 2 PRODUCTOS CON EL MISMO NOMBRE
    const productoExist = await ProductoModel.findByName(nombre);
    if (productoExist) {
      throw new Error("Este producto ya existe");
    }
    return await ProductoModel.create({ nombre, categoria, precio})
    },

    getProductosFilters: async (
        query: productoQueryParams
    ): Promise<paginaProductoResult<Productos>> => {
        let pagina = 1;
        let limite = 10;
        if (query.pagina) {
            pagina = Number(query.pagina);
        }
        if (query.limite) {
            limite = Number(query.limite)
        }
        const busqueda = query.busqueda?.trim();
        const minPrecio = query.minPrecio ? Number(query.minPrecio) : undefined;
        const maxPrecio = query.maxPrecio ? Number(query.maxPrecio) : undefined;

        return await ProductoModel.findWhitFilter(
            pagina,
            limite,
            busqueda,
            minPrecio,
            maxPrecio,
        );
    },
    
};