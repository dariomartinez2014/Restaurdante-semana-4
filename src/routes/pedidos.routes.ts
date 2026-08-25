import { Router } from "express";
import {
  getPedidos,
  getPedidosById,
  postPedido,
  putPedido,
  deletePedido,
} from "../controllers/pedidos.controllers.js";

const router = Router();

router.get("/", getPedidos);
router.get("/:id", getPedidosById);
router.post("/", postPedido);
router.put("/:id", putPedido);
router.delete("/:id", deletePedido);

export default router;
