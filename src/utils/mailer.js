import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

export const envoyerBilletEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: "imantoufani@gmail.com",
      to,
      subject,
      html: htmlContent,
    });
    console.log("Email envoyé à", info);
  } catch (err) {
    console.error("Erreur envoi email :", err.response?.body || err);
  }
};
