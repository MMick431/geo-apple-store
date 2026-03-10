const path = require("path");
const fs = require("fs");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ success: false, error: "Méthode non autorisée." });

  // L'URL sera /api/products?catalogue=occasions ou /api/products?catalogue=samsung
  const catalogue = req.query.catalogue;
  if (!["occasions", "samsung"].includes(catalogue)) {
    return res.status(400).json({ success: false, error: "Catalogue invalide." });
  }

  // Sur Vercel, les fichiers JSON sont dans /public/data/
  const filePath = path.join(process.cwd(), "public", "data", `${catalogue}.json`);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json({ success: true, data });
  } catch {
    res.json({ success: true, data: [] });
  }
};
