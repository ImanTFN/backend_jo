import express from "express";
import { inscriptionUtilisateur, connexionUtilisateur } from "../controllers/utilisateur.controller.js";

const router = express.Router();

router.post("/inscription", inscriptionUtilisateur);
router.post("/connexion", connexionUtilisateur);

export default router;
