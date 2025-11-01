import request from "supertest";
import app from "../src/server.js";
import { jest } from "@jest/globals";
import * as mailer from "../src/utils/mailer.js";
import * as qrcode from "../src/utils/qrcode.js";

describe("Commandes et panier", () => {
  let tokenUser;
  let idOffre;
  let cleAchatValide;

  beforeAll(async () => {
    // Connexion utilisateur
    const resUser = await request(app)
      .post("/api/utilisateurs/connexion")
      .send({ email: "test@test", motdepasse: "test" });
    tokenUser = resUser.body.token;

    // Récupérer une offre pour tester
    const offres = await request(app).get("/api/offres");
    idOffre = offres.body[0].id;

    // Créer une commande pour récupérer la cleAchat
    const resPaiement = await request(app)
      .post("/api/paiements/creer-session-paiement")
      .send({ idOffre })
      .set("Authorization", `Bearer ${tokenUser}`);
    cleAchatValide = resPaiement.body.cleAchat || "5e5508b8399c7d77"; // fallback
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
      .send({ cleAchat: cleAchatValide })
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.cleBillet).toBeDefined();
  });

  it("doit renvoyer 404 si la commande n'existe pas", async () => {
    const res = await request(app)
      .post("/api/commande/confirme")
      .send({ cleAchat: "commande_inexistante" })
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  

  
});
