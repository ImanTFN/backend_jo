import express from "express";
import { connexionAdmin } from "../controllers/connAdmin.controller.js";

const router = express.Router();

router.post("/connexion", connexionAdmin);

export default router;
