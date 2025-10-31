import request from "supertest";
import app from "../src/server.js";

describe("Routes principales API", () => {
  let tokenUser;
  let tokenAdmin;

  // 1. Connexion utilisateur
  it("doit connecter un utilisateur et récupérer un token", async () => {
    const res = await request(app)
      .post("/api/connexion")
      .send({ email: "test@test", motdepasse: "test" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    tokenUser = res.body.token;
  });

  // 2. Connexion admin
  it("doit connecter un admin et récupérer un token", async () => {
    const res = await request(app)
      .post("/api/admin/connexion")
      .send({ email: "admin@admin", motdepasse: "admin" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    tokenAdmin = res.body.token;
  });

  // 3. Vérifier accès dashboard admin
  it("doit accéder au dashboard admin avec le token", async () => {
    const res = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.utilisateurs).toBeInstanceOf(Array);
    expect(res.body.offres).toBeInstanceOf(Array);
    expect(res.body.commandes).toBeInstanceOf(Array);
  });

  // 4. Accéder aux offres publiques
  it("doit récupérer la liste des offres", async () => {
    const res = await request(app)
      .get("/api/offres");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
