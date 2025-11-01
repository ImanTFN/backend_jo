

import request from "supertest";
import app from "../src/server.js";

import { envoyerBilletEmail } from "../src/utils/mailer.js";
import { genererQRCode } from "../src/utils/qrcode.js";



describe("Routes principales API", () => {
  let tokenUser;
  let tokenAdmin;

  // 1. Connexion utilisateur
  it("doit connecter un utilisateur et récupérer un token", async () => {
    const res = await request(app)
      .post("/api/utilisateurs/connexion")
      .send({ email: "test@test", motdepasse: "test" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    tokenUser = res.body.token;
  });

  // 2. Connexion utilisateur avec mauvais mot de passe
  it("doit refuser la connexion si mot de passe incorrect", async () => {
    const res = await request(app)
      .post("/api/utilisateurs/connexion")
      .send({ email: "test@test", motdepasse: "mauvais" });

    expect([400, 401, 404]).toContain(res.statusCode);
    expect(res.body.error).toBeDefined();
  });

  // 3. Connexion utilisateur inexistant
  it("doit refuser la connexion si email inexistant", async () => {
    const res = await request(app)
      .post("/api/utilisateurs/connexion")
      .send({ email: "inexistant@test", motdepasse: "test" });

    expect([400, 401]).toContain(res.statusCode);
  });



  // 4. Connexion admin
  it("doit connecter un admin et récupérer un token", async () => {
    const res = await request(app)
      .post("/api/admin/connexion")
      .send({ email: "admin@admin", motdepasse: "admin" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    tokenAdmin = res.body.token;
  });


  // 5. Accès à une route protégée sans token
  it("doit refuser l'accès sans token", async () => {
    const res = await request(app).get("/api/admin/dashboard");
    expect(res.statusCode).toBe(401);
  });

  // 6. Accès avec token utilisateur sur route admin (interdit)
  it("doit refuser l'accès admin à un simple utilisateur", async () => {
    const res = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${tokenUser}`);
    expect(res.statusCode).toBe(403);
  });


  // 7. Vérifier accès dashboard admin
  it("doit accéder au dashboard admin avec le token", async () => {
    const res = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.utilisateurs).toBeInstanceOf(Array);
    expect(res.body.offres).toBeInstanceOf(Array);
    expect(res.body.commandes).toBeInstanceOf(Array);
  });

  // 8. Accéder aux offres publiques
  it("doit récupérer la liste des offres", async () => {
    const res = await request(app)
      .get("/api/offres");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  

  
});
