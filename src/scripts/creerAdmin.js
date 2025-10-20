import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const creerAdmin = async () => {
  const email = "admin@admin";
  const motdepasseClair = "admin";
  const motdepasseHache = await bcrypt.hash(motdepasseClair, 10);

  const admin = await prisma.administrateur.create({
    data: {
      nom: "Administrateur Principal",
      email,
      motdepasse: motdepasseHache,
    },
  });

  console.log("Admin créé :", admin);
  process.exit(0);
};

creerAdmin().catch(console.error);
