import { Router } from "express";
import {
  getRepartidores,
  getRepartidorPorId,
  crearRepartidor,
  actualizarRepartidor,
  eliminarRepartidor,
} from "../controllers/repartidores.controller.js";
import {
  validateCreateRepartidor,
  validateDeleteRepartidor,
  validateUpdateRepartidor,
} from "../middleware/repartidores.middleware.js";

const router = Router();

router.get("/", getRepartidores);
router.get("/:id", getRepartidorPorId);
router.post("/", validateCreateRepartidor, crearRepartidor);
router.put("/:id", validateUpdateRepartidor, actualizarRepartidor);
router.delete("/:id", validateDeleteRepartidor, eliminarRepartidor);

export default router;
