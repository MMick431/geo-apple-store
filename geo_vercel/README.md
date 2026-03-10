# 🚀 GEO Apple Store — Guide de déploiement Vercel

## Structure du projet
```
geo-apple-store/
├── api/
│   ├── send-order.js          → Commandes iPhone neuf
│   ├── send-order-occasion.js → Commandes iPhone occasion
│   ├── send-order-samsung.js  → Commandes Samsung
│   └── products.js            → Lecture des catalogues
├── public/
│   ├── index.html
│   ├── occasions.html
│   ├── samsung.html
│   ├── admin-secure.html
│   ├── script.js
│   ├── style.css
│   ├── sitemap.xml
│   └── data/
│       ├── occasions.json
│       └── samsung.json
├── vercel.json
├── package.json
└── .gitignore
```

---

## 📋 Étapes de déploiement

### 1. Mettre le code sur GitHub
1. Crée un compte sur https://github.com
2. Crée un nouveau dépôt (repo) — ex: `geo-apple-store`
3. Sur ton PC, installe Git : https://git-scm.com
4. Dans le dossier du projet, ouvre un terminal et tape :
```bash
git init
git add .
git commit -m "Premier déploiement"
git remote add origin https://github.com/TON-USERNAME/geo-apple-store.git
git push -u origin main
```

### 2. Déployer sur Vercel
1. Crée un compte sur https://vercel.com (gratuit à vie)
2. Clique "Add New Project"
3. Connecte ton compte GitHub
4. Sélectionne ton repo `geo-apple-store`
5. Clique "Deploy" → Vercel détecte tout automatiquement ✅

### 3. Ajouter les variables d'environnement sur Vercel
Dans ton projet Vercel → Settings → Environment Variables, ajoute :

| Nom | Valeur |
|-----|--------|
| RESEND_API_KEY | re_9HT51rM1_EYL1si4zD71C5eRnta6mkEWU |
| STORE_EMAIL | michaelhologan45@gmail.com |
| WHATSAPP_NUMBER | 22943924728 |
| ADMIN_PASSWORD | geo2025admin |

### 4. Connecter ton domaine .com
1. Achète ton domaine sur https://namecheap.com (~$9/an)
2. Dans Vercel → Settings → Domains → Ajoute ton domaine
3. Dans Namecheap → DNS → Ajoute le CNAME que Vercel te donne
4. Le HTTPS est automatique et gratuit ✅

### 5. Mettre à jour le sitemap.xml
Dans `public/sitemap.xml`, remplace `tondomaine.com` par ton vrai domaine.

---

## 🔍 Apparaître sur Google

1. Va sur https://search.google.com/search-console
2. Ajoute ton domaine
3. Soumettre le sitemap : `https://tondomaine.com/sitemap.xml`
4. Google indexe en 1 à 4 semaines ✅

---

## ⚠️ Note importante sur l'admin
Sur Vercel (serverless), la gestion admin avec sessions en mémoire ne persiste pas.
Pour gérer ton catalogue, utilise directement les fichiers `data/occasions.json` 
et `data/samsung.json` sur GitHub — les changements se redéploient automatiquement.
