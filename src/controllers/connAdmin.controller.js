import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const connexionAdmin = async (req, res) => {
  const { email, motdepasse } = req.body;

  try {
    const administrateur = await prisma.administrateur.findUnique({ where: { email } });
    if (!administrateur) {
      return res.status(404).json({ error: "Administrateur non trouvé" });
    }

    const passwordValid = await bcrypt.compare(motdepasse, administrateur.motdepasse);
    if (!passwordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: administrateur.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      nom: administrateur.nom,
      email: administrateur.email,
    });

    
  } catch (error) {
    console.error("Erreur lors de la connexion administrateur:", error);
    res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
};
