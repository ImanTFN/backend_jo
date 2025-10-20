import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function main() {
  console.log("Début du seed...");
  // Création des offres 
  await prisma.offre.createMany({
    data: [
      {
        type: "Billet Solo",
        description: "Pas besoin d'un accompagant.",
        prix: 50.0,
      },
      {
        type: "Billet Duo",
        description: "Deux billets pour partager l’expérience.",
        prix: 90.0,
      },
      {
        type: "Pack Famille",
        description: "Quatre billets à tarif réduit.",
        prix: 160.0,
      },
    ],
    skipDuplicates: true,
  });

  // Compte d'administrateur
  await prisma.administrateur.create({
    data: {
      nom: "admin",
      email: "admin@admin",
      motdepasse: "admin",
    },
  });
  console.log("Seed ajouté avec succés!");
}



main()
  .then(() => {
    console.log("Offres ajoutées avec succès !");
  })
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
