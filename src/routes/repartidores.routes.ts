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
  validateParamsId,
  validateUpdateRepartidor,
  validateQueryRepartidor,
} from "../middleware/repartidores.middleware.js";

const router = Router();

router.get("/", validateQueryRepartidor, getRepartidores);
router.get("/:id", validateParamsId, getRepartidorPorId);
router.post("/", validateCreateRepartidor, crearRepartidor);
router.put(
  "/:id",
  validateParamsId,
  validateUpdateRepartidor,
  actualizarRepartidor,
);
router.delete("/:id", validateParamsId, eliminarRepartidor);

export default router;
