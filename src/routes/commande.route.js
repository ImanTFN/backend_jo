import express from "express";
import { confirmerPaiement } from "../controllers/commande.controller.js";
import { verifieToken } from "../middlewares/authMiddleware.js";

const router = express.Router();



// POST /api/commande/confirme confirmer la commande
router.post("/confirme", verifieToken, confirmerPaiement);

export default router;


