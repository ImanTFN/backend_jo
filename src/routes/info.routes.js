import express from "express";
import { getHomeInfo } from "../controllers/info.controller.js";

const router = express.Router();

router.get("/", getHomeInfo);

export default router;
