import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

// Routes
import infoRoutes from "./routes/info.routes.js";
import utilisateurRoutes from "./routes/utilisateur.routes.js";
import offreRoutes from "./routes/offre.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import commandeRoutes from "./routes/commande.route.js";
import paiementRoutes from "./routes/paiement.route.js";

import adminDashboardRoute from "./routes/admin.routes.js";
import connAdminRoutes from "./routes/connAdmin.route.js"


dotenv.config();
const app = express();


//Middlewares de sécurité et de configuration
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes principales
app.use("/api/info", infoRoutes);
app.use("/api/utilisateurs", utilisateurRoutes);
app.use("/api/offres", offreRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/commande", commandeRoutes);
app.use("/api/paiements", paiementRoutes);

app.use("/api/admin", connAdminRoutes);
app.use("/api/admin", adminDashboardRoute);


// Route de statut test
app.get("/api/status", (req, res) => {
  res.json({ message: "Serveur opérationnel", time: new Date().toISOString() });
});

// Démarrer le serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));


export default app;