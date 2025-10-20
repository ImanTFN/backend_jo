import express from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { verifieToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/paiements/creer-session-paiement
router.post("/creer-session-paiement", verifieToken, async (req, res) => {
  try {
    const { idOffre } = req.body;
    const idUtilisateur = req.user.id;

    if (!idOffre) {
      return res.status(400).json({ error: "idOffre manquant" });
    }

    // Vérifier si l'offre existe
    const offre = await prisma.offre.findUnique({ where: { id: idOffre } });
    if (!offre) return res.status(404).json({ error: "Offre introuvable" });

    // Générer une clé d'achat unique
    const cleAchat = crypto.randomBytes(8).toString("hex");

    // Créer la commande en "cours"
    const commande = await prisma.commande.create({
      data: {
        cleAchat,
        total: offre.prix,
        statut: "en cours",
        idUtilisateur,
        idOffre: offre.id
      }
    });

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: offre.type },
            unit_amount: Math.round(offre.prix * 100)
          },
          quantity: 1
        }
      ],
      success_url: `http://localhost:5173/succes?cleAchat=${cleAchat}`,
      cancel_url: "http://localhost:5173/cancel"
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Erreur paiement :", err);
    res.status(500).json({ error: "Erreur lors de la création du paiement" });
  }
});

export default router;
