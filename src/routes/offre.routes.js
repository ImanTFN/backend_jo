import express from "express";
import { getOffres } from "../controllers/offre.controller.js";

const router = express.Router();

router.get("/", getOffres);

export default router;
