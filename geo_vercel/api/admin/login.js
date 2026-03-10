export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  const { email, password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_EMAIL = "admin@geoapplestore.com";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    return res.json({ success: true, token });
  }
  
  return res.json({ success: false, error: "Email ou mot de passe incorrect." });
}
