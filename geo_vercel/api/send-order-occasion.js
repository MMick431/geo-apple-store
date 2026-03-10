const { Resend } = require("resend");

function sanitize(str, maxLen = 500) {
  return String(str || "")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
    .replace(/`/g, "&#x60;").trim().slice(0, maxLen);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Méthode non autorisée." });

  const { customerName, customerPhone, customerEmail, customerAddress, productName, productPrice, notes, orderDate } = req.body;

  if (!customerName || !customerPhone || !customerEmail || !productName)
    return res.status(400).json({ success: false, error: "Champs obligatoires manquants." });
  if (!isValidEmail(customerEmail))
    return res.status(400).json({ success: false, error: "Email invalide." });

  const sName    = sanitize(customerName, 100);
  const sPhone   = sanitize(customerPhone, 30);
  const sEmail   = sanitize(customerEmail, 254);
  const sAddress = sanitize(customerAddress, 300);
  const sProduct = sanitize(productName, 200);
  const sPrice   = sanitize(String(productPrice), 50);
  const sNotes   = sanitize(notes, 1000);
  const sDate    = sanitize(orderDate, 100);

  const waNum = process.env.WHATSAPP_NUMBER || "22943924728";
  const waMsg = encodeURIComponent(`Bonjour ${sName}, j'ai bien reçu votre commande pour ${sProduct}. Je reviens vers vous rapidement ! - GEO APPLE STORE`);

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:20px;overflow:hidden;border:1px solid #222;">
      <tr><td style="background:linear-gradient(135deg,#b87000,#e8a000);padding:36px 40px;text-align:center;">
        <p style="margin:0;color:rgba(0,0,0,0.5);font-size:12px;letter-spacing:3px;text-transform:uppercase;">Nouvelle Commande Occasion</p>
        <h1 style="margin:8px 0 0;color:#000;font-size:26px;font-weight:900;letter-spacing:2px;">GEO APPLE STORE</h1>
      </td></tr>
      <tr><td style="padding:0 40px;">
        <div style="background:#1e1e1e;border:1px solid #e8a00033;border-radius:10px;padding:16px 20px;margin:24px 0;">
          <span style="color:#e8a000;font-weight:700;font-size:13px;text-transform:uppercase;">Commande iPhone Occasion — Traitement requis</span>
        </div>
      </td></tr>
      <tr><td style="padding:0 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #333;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">${sProduct}</p>
            <p style="margin:6px 0 0;color:#e8a000;font-size:22px;font-weight:900;">${sPrice} FCFA</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #333;">
          <tr><td style="padding:20px 24px;">
            <table width="100%" cellpadding="8" cellspacing="0">
              <tr><td style="color:#888;font-size:13px;width:120px;">Nom</td><td style="color:#fff;font-size:14px;font-weight:600;">${sName}</td></tr>
              <tr style="border-top:1px solid #222;"><td style="color:#888;font-size:13px;">Téléphone</td><td><a href="tel:${sPhone}" style="color:#25d366;text-decoration:none;font-size:14px;font-weight:600;">${sPhone}</a></td></tr>
              <tr style="border-top:1px solid #222;"><td style="color:#888;font-size:13px;">Email</td><td><a href="mailto:${sEmail}" style="color:#58a6ff;text-decoration:none;font-size:14px;font-weight:600;">${sEmail}</a></td></tr>
              <tr style="border-top:1px solid #222;"><td style="color:#888;font-size:13px;">Adresse</td><td style="color:#fff;font-size:14px;font-weight:600;">${sAddress}</td></tr>
              ${sNotes ? `<tr style="border-top:1px solid #222;"><td style="color:#888;font-size:13px;">Note</td><td style="color:#f0c040;font-size:13px;font-style:italic;">${sNotes}</td></tr>` : ""}
            </table>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 40px 0;">
        <a href="https://wa.me/${waNum}?text=${waMsg}" style="display:block;background:#25d366;color:#fff;text-align:center;padding:16px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;">
          Répondre au client via WhatsApp
        </a>
      </td></tr>
      <tr><td style="padding:30px 40px;text-align:center;border-top:1px solid #222;">
        <p style="margin:0;color:#555;font-size:12px;">Reçue le ${sDate}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await resend.emails.send({
      from: "GEO Apple Store <onboarding@resend.dev>",
      to: [process.env.STORE_EMAIL || "michaelhologan45@gmail.com"],
      subject: `Commande Occasion — ${sProduct} | GEO APPLE STORE`,
      html,
      reply_to: sEmail,
    });
    res.json({ success: true, emailId: data.id });
  } catch (error) {
    console.error("Erreur Resend occasion:", error);
    res.status(500).json({ success: false, error: "Erreur envoi email." });
  }
};
