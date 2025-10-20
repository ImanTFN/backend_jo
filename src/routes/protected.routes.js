import express from "express";
import { verifieToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", verifieToken, (req, res) => {
  res.json({
    message: "Page sécurisée !",
    user: req.user,
  });
});

export default router;
