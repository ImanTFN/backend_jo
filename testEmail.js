// testEmail.js
import dotenv from "dotenv";
dotenv.config();

import { envoyerBilletEmail } from "./src/utils/mailer.js";

async function test() {
  try {
    await envoyerBilletEmail(
      "imanetoufani4@gmail.com",        
      "Test Billet JO",            
      "<h1>Ceci est un test</h1><p>Si vous voyez ce message, l'email fonctionne.</p>"
    );
    console.log("Test terminé !");
  } catch (err) {
    console.error("Erreur pendant le test :", err);
  }
}

test();
