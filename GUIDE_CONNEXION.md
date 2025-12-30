# 🔐 Guide de Connexion et Création de Comptes

## 📝 Vue d'ensemble

Votre application dispose de **deux types de comptes** :
- **👑 Administrateur** : Peut créer des tâches, gérer les utilisateurs, valider les tâches
- **👤 Utilisateur** : Reçoit des tâches, les traite, envoie des notes

## 🚀 Comment créer et se connecter

---

### **1️⃣ CRÉER UN ADMINISTRATEUR (via Script Python)**

Pour des raisons de sécurité, les comptes administrateurs doivent être créés via un script Python.

#### Étape 1 : Aller dans le dossier server
```bash
cd server
```

#### Étape 2 : Activer l'environnement virtuel (si nécessaire)
**Windows :**
```bash
.venv\Scripts\activate
```

**Linux/Mac :**
```bash
source .venv/bin/activate
```

#### Étape 3 : Exécuter le script de création d'admin
```bash
python create_admin.py
```

#### Étape 4 : Suivre les instructions
Le script vous demandera :
- **Nom** : Votre nom de famille
- **Prénom** : Votre prénom
- **Email** : votre.email@exemple.com
- **Téléphone** : 0123456789 (exactement 10 chiffres)
- **Mot de passe** : minimum 6 caractères

#### Étape 5 : Confirmation
Vous verrez un message de succès :
```
✅ Administrateur créé avec succès!
   Nom: Votre Nom Prénom
   Email: votre.email@exemple.com
   Rôle: admin
```

---

### **2️⃣ CRÉER UN UTILISATEUR**

Les utilisateurs peuvent être créés de **deux façons** :

#### **Méthode 1 : Par l'Admin (RECOMMANDÉ)**

1. **Connectez-vous en tant qu'Admin**
2. Dans le Dashboard Admin, cliquez sur **"+ Créer"** dans la section Utilisateurs
3. Remplissez le formulaire :
   - Nom, Prénom, Email, Téléphone, Mot de passe
   - Rôle : Sélectionnez "Utilisateur" ou "Administrateur"
4. Cliquez sur **"Créer l'utilisateur"**
5. L'utilisateur peut maintenant se connecter avec ses identifiants

#### **Méthode 2 : Auto-inscription**

1. Sur la page de connexion, cliquez sur **"S'inscrire"**
2. Remplissez le formulaire :
   - Nom, Prénom, Email, Téléphone, Mot de passe
3. Cliquez sur **"Créer mon compte"**
4. Vous serez redirigé vers la page de connexion
5. Connectez-vous avec vos identifiants
6. Vous accédez au **Dashboard Utilisateur**

---

### **3️⃣ SE CONNECTER**

**Pour tous (Admin et Utilisateurs) :**

1. Allez sur `http://localhost:5173`
2. Entrez votre **email** et **mot de passe**
3. Cliquez sur **"Se connecter"**
4. Vous êtes redirigé vers votre dashboard :
   - **Admin** → Dashboard Administrateur
   - **User** → Dashboard Utilisateur

---

## 📊 Workflow Complet

### Pour l'Administrateur

1. **Se connecter** avec email/mot de passe
2. **Créer des utilisateurs** (bouton "+ Créer")
3. **Sélectionner un utilisateur** dans la liste
4. **Assigner des tâches** avec titre et description
5. **Voir les tâches terminées** dans l'onglet "Toutes les tâches"
6. **Lire les notes** des utilisateurs
7. **Valider les tâches** (bouton ✅)

### Pour l'Utilisateur

1. **Se connecter** avec email/mot de passe
2. **Voir ses tâches** assignées
3. **Mettre à jour le statut** (à faire → en cours → terminé)
4. **Ajouter une note** pour expliquer le travail effectué
5. **Voir la validation** de l'admin (badge vert)

---

## 🛠️ Dépannage

### Problèmes de Création de Compte

#### "Email déjà utilisé"
- Cet email existe déjà dans la base de données
- Utilisez un autre email ou connectez-vous avec cet email

#### "Numéro de téléphone déjà utilisé"
- Ce numéro existe déjà dans la base de données
- Utilisez un autre numéro

#### "Le numéro de téléphone doit contenir exactement 10 chiffres"
- Entrez uniquement des chiffres (pas d'espaces, pas de tirets)
- Exemple correct : `0123456789`
- Exemple incorrect : `01 23 45 67 89` ou `01-23-45-67-89`

#### "Mot de passe trop court"
- Le mot de passe doit contenir au moins 6 caractères
- Utilisez un mot de passe plus long

### Problèmes de Connexion

#### "Email incorrect"
- Vérifiez que vous avez bien entré votre email
- L'email est en minuscules dans la base de données

#### "Mot de passe incorrect"
- Vérifiez que vous avez bien entré votre mot de passe
- Attention aux majuscules/minuscules

#### Impossible de se connecter
- Vérifiez que le backend tourne sur `http://localhost:5000`
- Vérifiez que le frontend tourne sur `http://localhost:5173`
- Vérifiez que MySQL est démarré
- Vérifiez que la base de données `notejour` existe

### Problèmes avec le Script create_admin.py

#### "Un administrateur existe déjà"
- Un admin existe déjà dans la base de données
- Le script vous demande si vous voulez créer un autre admin
- Répondez `o` pour oui ou `n` pour non

#### "ModuleNotFoundError"
- L'environnement virtuel n'est pas activé
- Activez-le avec `.venv\Scripts\activate` (Windows) ou `source .venv/bin/activate` (Linux/Mac)

---

## 🔒 Sécurité

### Pourquoi les admins doivent être créés via script ?

1. **Sécurité renforcée** : Empêche n'importe qui de créer un compte admin
2. **Contrôle d'accès** : Seule une personne ayant accès au serveur peut créer un admin
3. **Traçabilité** : Les créations d'admin sont tracées dans les logs du serveur
4. **Bonnes pratiques** : C'est la méthode recommandée en production

### Recommandations

1. **Mots de passe forts** : Minimum 8 caractères, avec chiffres et symboles
2. **Ne partagez pas** vos identifiants
3. **Changez régulièrement** vos mots de passe
4. **Limitez le nombre d'admins** : Créez uniquement les admins nécessaires

### En Production

- Changez `SECRET_KEY` et `JWT_SECRET_KEY` dans `server/config.py`
- Utilisez HTTPS
- Configurez un vrai serveur de base de données (PostgreSQL)
- Activez les logs d'audit
- Mettez en place une politique de mots de passe forts

---

## ✅ Checklist de Démarrage

### Première Installation

- [ ] Backend installé (`pip install -r requirements.txt`)
- [ ] Frontend installé (`npm install`)
- [ ] Base de données créée (`flask db upgrade`)
- [ ] MySQL démarré

### Création du Premier Admin

- [ ] Script `create_admin.py` exécuté
- [ ] Admin créé avec succès
- [ ] Connexion admin testée

### Création d'Utilisateurs

- [ ] Admin connecté
- [ ] Utilisateur créé via Dashboard Admin
- [ ] Connexion utilisateur testée

### Test du Workflow

- [ ] Tâche créée par l'admin
- [ ] Tâche assignée à un utilisateur
- [ ] Utilisateur a mis à jour le statut
- [ ] Utilisateur a envoyé une note
- [ ] Admin a validé la tâche

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez la section **Dépannage** ci-dessus
2. Vérifiez les logs du serveur Flask
3. Vérifiez la console du navigateur (F12)
4. Consultez le fichier `README.md` principal

---

## 📝 Exemples de Commandes

### Démarrer l'application

**Terminal 1 (Backend) :**
```bash
cd server
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
python app.py
```

**Terminal 2 (Frontend) :**
```bash
cd noteweb
npm run dev
```

### Créer un admin

```bash
cd server
.venv\Scripts\activate  # Windows
python create_admin.py
```

### Réinitialiser la base de données (ATTENTION : Supprime toutes les données)

```bash
cd server
flask db downgrade base
flask db upgrade
python create_admin.py
```

---

**Votre application est prête à l'emploi ! 🎉**

Pour toute question, consultez le fichier `README.md` principal.
