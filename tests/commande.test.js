import request from "supertest";
import app from "../src/server.js";

describe("Commandes et panier", () => {
  let tokenUser;
  let idOffre;

  beforeAll(async () => {
    // Connexion utilisateur
    const resUser = await request(app)
      .post("/api/connexion")
      .send({ email: "test@test", motdepasse: "test" });
    tokenUser = resUser.body.token;

    // Récupérer une offre pour tester
    const offres = await request(app).get("/api/offres");
    idOffre = offres.body[0].id;
  });

  it("doit créer une commande pour l'utilisateur", async () => {
    const res = await request(app)
      .post("/api/paiements/creer-session-paiement")
      .send({ idOffre })
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.url).toBeDefined();
  });

  it("doit confirmer la commande après paiement", async () => {
    const res = await request(app)
      .post("/api/commande/confirme")
      .send({ cleAchat: "5e5508b8399c7d77" })
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.cleBillet).toBeDefined();
  });
});
