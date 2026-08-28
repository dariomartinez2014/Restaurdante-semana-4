import { PedidosModel } from "../models/pedidos.models.js";
import type { pedidoQueryParams } from "../schemas/pedidos.schema.js";
import type { paginaResult, pedido } from "../models/pedidos.models.js";

export const pedidoService = {
  createPedido: async function (
    cliente_id: number,
    estado: string,
    total: number,
    detalles: string,
  ): Promise<pedido> {
    // limpiar espacios vacios al final e inicio del estado y detalles
    const cleanEstado = estado.trim();
    const cleanDetalles = detalles.trim();
    // validar que el estado sea permitido
    const estadosPermitidos = ["pendiente", "preparando", "entregado"];
    if (!estadosPermitidos.includes(cleanEstado)) {
      throw new Error("EL ESTADO NO ES VALIDO!!!");
    }
    return await PedidosModel.create({
      cliente_id,
      estado: cleanEstado,
      total,
      detalles: cleanDetalles,
    });
  },
  getPedidosFilters: async (
    query: pedidoQueryParams,
  ): Promise<paginaResult<pedido>> => {
    let page = 1;
    let limit = 10;
    if (query.page) {
      page = Number(query.page);
    }
    if (query.limit) {
      limit = Number(query.limit);
    }
    const search = query.search?.trim();
    const minTotal = query.minTotal ? Number(query.minTotal) : undefined;
    const maxTotal = query.maxTotal ? Number(query.maxTotal) : undefined;
    return await PedidosModel.findWhitFilter(
      page,
      limit,
      search,
      minTotal,
      maxTotal,
    );
  },
};
