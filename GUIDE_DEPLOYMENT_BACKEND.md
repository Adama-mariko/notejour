# 🚀 Guide de Déploiement du Backend sur Render

Votre Frontend est sur Netlify, mais il a besoin d'un Backend en ligne pour fonctionner. Nous allons déployer le Backend (Python/Flask) et la Base de Données (PostgreSQL) sur **Render** (une plateforme gratuite et performante).

## ✅ Pré-requis (Déjà fait par moi)
- [x] Configuration de CORS pour accepter Netlify
- [x] Configuration dynamique de la base de données
- [x] Ajout de `gunicorn` et `psycopg2-binary`
- [x] Mise à jour du Frontend pour utiliser l'URL de l'API via variable d'environnement

---

## 🛠️ Étape 1 : Créer votre compte et base de données sur Render

1. Allez sur [render.com](https://render.com/) et créez un compte (connectez-vous avec GitHub, c'est plus simple).
2. Une fois connecté, cliquez sur **"New +"** en haut à droite et choisissez **"PostgreSQL"**.
3. Remplissez le formulaire :
   - **Name**: `notejour-db`
   - **Database**: `notejour`
   - **User**: `admin`
   - **Region**: `Frankfurt (EU Central)` (plus proche de nous)
   - **Instance Type**: **Free**
4. Cliquez sur **"Create Database"**.
5. ⏳ Attendez que la base soit créée (Status: "Available").
6. **Copiez l'URL de connexion interne** (`Internal Database URL`) pour plus tard. Elle ressemble à `postgres://admin:...@.../notejour`.

---

## 🛠️ Étape 2 : Déployer le Backend (Web Service)

1. Cliquez sur **"New +"** et choisissez **"Web Service"**.
2. Connectez votre compte GitHub et sélectionnez votre dépôt `notejour`.
3. Configurez le service :
   - **Name**: `notejour-api`
   - **Region**: `Frankfurt (EU Central)` (Même région que la DB !)
   - **Branch**: `master` (ou `main`)
   - **Root Directory**: `server` (⚠️ Très important : indiquez `server` car votre code backend est dans ce sous-dossier)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app` (ou `gunicorn app:app --bind 0.0.0.0:$PORT`)
   - **Instance Type**: **Free**

4. **Variables d'Environnement** (Section "Environment Variables") :
   Ajoutez les variables suivantes :
   
   | Clé | Valeur |
   | --- | --- |
   | `DATABASE_URL` | Collez l'URL de la base de données (**Internal Database URL**) copiée à l'étape 1 |
   | `SECRET_KEY` | Mettez une longue chaîne de caractères aléatoires |
   | `FRONTEND_URL` | L'URL de votre site Netlify (ex: `https://votre-site.netlify.app`) |
   | `PYTHON_VERSION` | `3.10.0` (Optionnel, recommandé) |

5. Cliquez sur **"Create Web Service"**.

---

## 🛠️ Étape 3 : Initialiser la Base de Données

Une fois le service déployé, votre base de données est vide. Il faut créer les tables et l'admin.

1. Sur le tableau de bord Render de votre **Web Service**, allez dans l'onglet **"Shell"** (c'est un terminal connecté à votre serveur).
2. Exécutez ces commandes une par une :

```bash
# Initialiser les tables
flask db upgrade

# Créer l'administrateur
python create_admin.py
```
*(Si `create_admin.py` vous demande des infos, suivez les instructions)*

---

## 🛠️ Étape 4 : Connecter le Frontend (Netlify) au Backend (Render)

Maintenant que le backend est en ligne, il faut dire au frontend où le trouver.

1. Sur Render, copiez l'URL de votre Web Service (en haut à gauche, ex: `https://notejour-api.onrender.com`).
2. Allez sur **Netlify**.
3. Sélectionnez votre site `notejour`.
4. Allez dans **Site configuration** > **Environment variables**.
5. Cliquez sur **"Add a variable"**.
   - **Key**: `VITE_API_URL`
   - **Value**: L'URL de votre backend Render (ex: `https://notejour-api.onrender.com`) **sans le slash à la fin**.
   - **Scope**: Build local, Deploy, etc. (Tout coché).
6. Cliquez sur **"Create variable"**.
7. Allez dans l'onglet **Deploys** et cliquez sur **"Trigger deploy"** > **"Deploy site"** pour forcer une reconstruction avec la nouvelle variable.

---

## 🎉 C'est fini !

Attendez que Netlify finisse le déploiement. Votre application devrait maintenant fonctionner avec :
- Frontend : Netlify
- Backend : Render
- Database : Render PostgreSQL

### Dépannage

- **Erreur 500** : Vérifiez les logs sur Render ("Logs").
- **Erreur CORS** : Vérifiez que `FRONTEND_URL` sur Render correspond bien à l'URL de votre site Netlify.
- **Page blanche** : Vérifiez la console du navigateur (F12) pour voir si l'URL de l'API est correcte.
