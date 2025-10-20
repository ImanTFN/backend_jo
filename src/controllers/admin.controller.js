import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Visualiser les ventes, les billets et les commandes
export const getDashboard = async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany();
    const offres = await prisma.offre.findMany();
    const commandes = await prisma.commande.findMany({
      include: { utilisateur: true, offre: true, billet: true, paiement: true }
    });

    res.json({ utilisateurs, offres, commandes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur dashboard" });
  }
};

// CRUD offres
export const creerOffre = async (req, res) => {
  const { type, description, prix } = req.body;
  try {
    const nouvelleOffre = await prisma.offre.create({ data: { type, description, prix } });
    res.json(nouvelleOffre);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur de création d'offre" });
  }
};

export const modifierOffre = async (req, res) => {
  const { id } = req.params;
  const { type, description, prix } = req.body;
  try {
    const updated = await prisma.offre.update({
      where: { id: parseInt(id) },
      data: { type, description, prix }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur de mise à jour d'offre" });
  }
};

export const supprimerOffre = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.offre.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Offre supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur de suppression d'offre" });
  }
};
