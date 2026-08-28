import { Router } from "express";
import {
  getPedidos,
  getPedidosById,
  postPedido,
  putPedido,
  deletePedido,
} from "../controllers/pedidos.controllers.js";
import { validatePedidos } from "../middleware/pedidos.middleware.js";

const router = Router();

router.get("/", getPedidos);
router.get("/:id", getPedidosById);
router.post("/", validatePedidos, postPedido);
router.put("/:id", validatePedidos, putPedido);
router.delete("/:id", deletePedido);

export default router;
