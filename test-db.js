import sequelize from "./src/config/database.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connecté à MySQL avec Sequelize !");
  } catch (error) {
    console.error("Impossible de se connecter :", error);
  }
})();
