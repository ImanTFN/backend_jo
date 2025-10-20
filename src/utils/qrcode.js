import QRCode from "qrcode";

export const genererQRCode = async (text) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(text);
    return qrDataUrl;
  } catch (err) {
    console.error("Erreur de génération du QR code :", err);
    return null;
  }
};
