import request from "supertest";
import app from "../src/server.js";

describe("CRUD Offres Admin", () => {
  let tokenAdmin;
  let offreId;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/admin/connexion")
      .send({ email: "admin@admin", motdepasse: "admin" });

    tokenAdmin = res.body.token;
  });

  it("doit créer une offre", async () => {
    const res = await request(app)
      .post("/api/admin/offres")
      .send({ type: "VIP", description: "Accès complet", prix: 199.99 })
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();
    offreId = res.body.id;
  });

  it("doit modifier une offre", async () => {
    const res = await request(app)
      .put(`/api/admin/offres/${offreId}`)
      .send({ type: "VIP+", description: "Accès complet + bonus", prix: 249.99 })
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.type).toBe("VIP+");
  });

  it("doit supprimer une offre", async () => {
    const res = await request(app)
      .delete(`/api/admin/offres/${offreId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Offre supprimée");
  });
});
