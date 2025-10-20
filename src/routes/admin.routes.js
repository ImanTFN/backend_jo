import express from "express";
import { verifieAdmin } from "../middlewares/authMiddleware.js";
import {
  getDashboard,
  creerOffre,
  modifierOffre,
  supprimerOffre
} from "../controllers/admin.controller.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", verifieAdmin, getDashboard);

// Gestion des offres
router.post("/offres", verifieAdmin, creerOffre);
router.put("/offres/:id", verifieAdmin, modifierOffre);
router.delete("/offres/:id", verifieAdmin, supprimerOffre);

export default router;
