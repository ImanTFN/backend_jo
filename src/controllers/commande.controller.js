import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { genererQRCode } from "../utils/qrcode.js";
import { envoyerBilletEmail } from "../utils/mailer.js";

const prisma = new PrismaClient();

export const confirmerPaiement = async (req, res) => {
  const { cleAchat, paiementIntentId, montant } = req.body;

  try {
    // Récupérer la commande
    const commande = await prisma.commande.findUnique({
      where: { cleAchat },
      include: { utilisateur: true, offre: true },
    });

    if (!commande) return res.status(404).json({ error: "Commande introuvable" });

    // Vérifier si le paiement existe déjà
    let paiementExistant = await prisma.paiement.findFirst({ where: { idCommande: commande.id } });

    if (!paiementExistant) {
      console.log("commande récupérée:", commande);
      await prisma.paiement.create({
        data: {
          paiementIntent: paiementIntentId ?? "paiement non defini",
          montant: commande.total,
          statut: "paye",
          methode: "card",
          idCommande: commande.id,
        },
      });
    }

    // Générer la clé du billet
    const cleBillet = crypto.createHash("sha256")
      .update(`${cleAchat}-${commande.idUtilisateur}`)
      .digest("hex");

    // Générer le QR code
    const qrCodeUrl = await genererQRCode(cleBillet);

    // Créer le billet si inexistant
    let billet = await prisma.billet.findFirst({ where: { idCommande: commande.id } });
    if (!billet) {
      billet = await prisma.billet.create({
        data: { cleBillet, qrCodeUrl, idCommande: commande.id },
      });
    }

    // Marquer la commande comme payé
    await prisma.commande.update({
      where: { id: commande.id },
      data: { statut: "paye" },
    });

    // Envoyer l'email
    const emailHtml = `
      <h2>Votre billet pour les Jeux Olympiques</h2>
      <p>Nom : ${commande.utilisateur.name}</p>
      <p>Offre : ${commande.offre.title}</p>
      <p>Date d'achat : ${commande.dateAchat.toLocaleDateString()}</p>
      <p>Billet unique : ${cleBillet}</p>
      <img src="${qrCodeUrl}" alt="QR code du billet" />
    `;
    await envoyerBilletEmail(commande.utilisateur.email, "Votre billet JO", emailHtml);

    res.json({ message: "Paiement confirmé, vous recevrez votre billet sur votre boite mail.", cleBillet, qrCodeUrl,
      utilisateur: {
        nom: commande.utilisateur.nom,
        email: commande.utilisateur.email
      },
      offre: {
        titre: commande.offre.type
      },
      dateAchat: commande.dateAchat
     });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la confirmation du paiement" });
  }
};
