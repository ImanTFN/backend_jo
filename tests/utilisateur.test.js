import request from "supertest";
import app from "../src/server.js"; // ton serveur Express
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

describe("Utilisateur API", () => {
  const testUser = {
    nom: "Test",
    prenom: "Utilisateur",
    email: "testuser@example.com",
    motdepasse: "password123",
  };

  beforeAll(async () => {
    // Supprimer l'utilisateur test s'il existe déjà
    await prisma.utilisateur.deleteMany({ where: { email: testUser.email } });
  });

  afterAll(async () => {
    await prisma.utilisateur.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  describe("Inscription", () => {
    it("doit créer un utilisateur avec succès", async () => {
      const res = await request(app)
        .post("/api/utilisateurs/inscription")
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBeDefined();
      expect(res.body.utilisateur.email).toBe(testUser.email);
    });

    it("ne doit pas créer un utilisateur si email déjà utilisé", async () => {
      const res = await request(app)
        .post("/api/utilisateurs/inscription")
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email déjà utilisé.");
    });

    it("ne doit pas créer un utilisateur si des champs sont manquants", async () => {
      const res = await request(app)
        .post("/api/utilisateurs/inscription")
        .send({ nom: "Test" }); // email et motdepasse manquants

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe(
        "Nom, prénom, email et mot de passe sont requis."
      );
    });
  });

  describe("Connexion", () => {
    it("doit connecter l'utilisateur avec succès", async () => {
      const res = await request(app)
        .post("/api/utilisateurs/connexion")
        .send({ email: testUser.email, motdepasse: testUser.motdepasse });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it("ne doit pas connecter un utilisateur inexistant", async () => {
      const res = await request(app)
        .post("/api/utilisateurs/connexion")
        .send({ email: "inexistant@test.com", motdepasse: "password" });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Utilisateur non trouvé.");
    });

    it("ne doit pas connecter si mot de passe incorrect", async () => {
      const res = await request(app)
        .post("/api/utilisateurs/connexion")
        .send({ email: testUser.email, motdepasse: "mauvais" });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Mot de passe incorrect.");
    });

    it("ne doit pas connecter si email ou mot de passe manquant", async () => {
      const res = await request(app)
        .post("/api/utilisateurs/connexion")
        .send({ email: testUser.email });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email et mot de passe requis.");
    });
  });
});
