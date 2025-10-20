import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// INSCRIPTION
export const inscriptionUtilisateur = async (req, res) => {
  const { nom, prenom, email, motdepasse } = req.body;

  if (!nom || !prenom || !email || !motdepasse) {
    return res
      .status(400)
      .json({ error: "Nom, prénom, email et mot de passe sont requis." });
  }

  try {
    const existant = await prisma.utilisateur.findUnique({ where: { email } });
    if (existant) return res.status(400).json({ error: "Email déjà utilisé." });

    const hashed = await bcrypt.hash(motdepasse, 10);
    const utilisateur = await prisma.utilisateur.create({
      data: { nom, prenom, email, motdepasse: hashed },
    });

    res.status(201).json({
      message: "Votre compte a bien été créé.",
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// CONNEXION
export const connexionUtilisateur = async (req, res) => {
  const { email, motdepasse } = req.body;

  if (!email || !motdepasse) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  try {
    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });
    if (!utilisateur) return res.status(400).json({ error: "Utilisateur non trouvé." });

    const valid = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
    if (!valid) return res.status(400).json({ error: "Mot de passe incorrect." });

    const token = jwt.sign(
      {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({token});

    res.json({ message: "Connexion réussie", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
