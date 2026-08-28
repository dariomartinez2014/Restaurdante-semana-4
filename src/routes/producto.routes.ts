import { Router } from "express";
import {
  getProductos,
  getProductosById,
  putProducto,
  postProducto,
  deleteProducto,
} from "../controllers/producto.controller.js";

import { crearProductoSchema } from "../schemas/producto.schema.js";
import { validateProducto } from "../middleware/producto.middleware.js";

const router = Router();

router.get("/", getProductos);
router.get("/:id", getProductosById);
router.post("/", postProducto);
router.put("/:id", putProducto);
router.delete("/:id", deleteProducto);

export default router;
