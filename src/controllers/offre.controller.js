import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getOffres = async (req, res) => {
  try {
    const offres = await prisma.offre.findMany();
    res.json(offres);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
