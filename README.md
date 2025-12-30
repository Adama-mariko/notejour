# 📋 Application de Gestion de Tâches - Version Professionnelle

Application complète de gestion de tâches avec Flask (Backend) et React + Vite + TailwindCSS (Frontend).

## ✨ Nouvelles Fonctionnalités Professionnelles

### Interface Moderne
- 🎨 **Sidebar professionnel** avec navigation intuitive
- 🎨 **Navbar élégante** avec notifications en temps réel
- 🎨 **Photos de profil** pour tous les utilisateurs
- 🎨 **Design responsive** adapté à tous les écrans
- 🎨 **Animations fluides** et transitions modernes
- 🎨 **Palette de couleurs** professionnelle et cohérente

### Corrections Importantes
- ✅ **Erreur 422 corrigée** lors de la création d'utilisateurs
- ✅ **Champ photo_profile** ajouté au modèle User
- ✅ **Génération automatique** d'avatars avec initiales
- ✅ **Interface professionnelle** digne d'un développeur senior

## 🎯 Fonctionnalités

### Pour l'Administrateur
- ✅ Créer des utilisateurs (erreur 422 corrigée)
- ✅ Assigner des tâches aux utilisateurs
- ✅ Voir toutes les tâches de tous les utilisateurs
- ✅ Valider les tâches terminées par les utilisateurs
- ✅ Supprimer des tâches
- ✅ Voir les notes envoyées par les utilisateurs
- ✅ **Nouveau**: Tableau de bord avec statistiques
- ✅ **Nouveau**: Navigation par onglets
- ✅ **Nouveau**: Interface moderne avec sidebar et navbar

### Pour l'Utilisateur
- ✅ Voir ses tâches assignées
- ✅ Mettre à jour le statut des tâches (à faire, en cours, terminé)
- ✅ Envoyer des notes à l'admin pour les tâches terminées
- ✅ Voir si ses tâches ont été validées par l'admin
- ✅ **Nouveau**: Interface utilisateur améliorée
- ✅ **Nouveau**: Photo de profil visible

## 🚀 Installation et Démarrage

### Backend (Flask)

1. **Aller dans le dossier server**
   ```bash
   cd server
   ```

2. **Créer un environnement virtuel (si pas déjà fait)**
   ```bash
   python -m venv .venv
   ```

3. **Activer l'environnement virtuel**
   - Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source .venv/bin/activate
     ```

4. **Installer les dépendances**
   ```bash
   pip install -r requirements.txt
   ```

5. **Créer la base de données**
   ```bash
   flask db upgrade
   ```

6. **⚠️ IMPORTANT: Appliquer la migration pour photo_profile**
   ```bash
   python migrate_photo_profile.py
   ```

7. **Créer un administrateur**
   ```bash
   python create_admin.py
   ```
   Suivez les instructions pour créer votre premier admin.

8. **Lancer le serveur**
   ```bash
   python app.py
   ```
   Le serveur démarre sur `http://localhost:5000`

### Frontend (React + Vite)

1. **Aller dans le dossier noteweb**
   ```bash
   cd noteweb
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer l'application**
   ```bash
   npm run dev
   ```
   L'application démarre sur `http://localhost:5173`

## 📝 Utilisation

### Première Connexion

1. **Créer un admin** avec le script `create_admin.py`
2. **Se connecter** avec les identifiants admin
3. **Créer des utilisateurs** depuis le dashboard admin
4. **Assigner des tâches** aux utilisateurs

### Workflow Complet

1. **Admin** : Crée une tâche et l'assigne à un utilisateur
2. **Utilisateur** : Reçoit la tâche et met à jour son statut (à faire → en cours → terminé)
3. **Utilisateur** : Envoie une note à l'admin pour expliquer le travail effectué
4. **Admin** : Lit la note et valide la tâche si elle est bien faite
5. **Utilisateur** : Voit que sa tâche a été validée ✅

## 🗄️ Structure de la Base de Données

### Table `roles`
- `id`: Identifiant unique
- `nom`: Nom du rôle (admin, user)

### Table `users`
- `id`: Identifiant unique
- `nom`: Nom de famille
- `prenom`: Prénom
- `email`: Email (unique)
- `telephone`: Numéro de téléphone (unique)
- `password_hash`: Mot de passe hashé
- `role_id`: Référence au rôle
- `created_at`: Date de création
- `updated_at`: Date de modification

### Table `tasks`
- `id`: Identifiant unique
- `titre`: Titre de la tâche
- `description`: Description détaillée
- `statut`: Statut (à faire, en cours, terminé, validé)
- `note_utilisateur`: Note envoyée par l'utilisateur
- `valide_par_admin`: Boolean (validé ou non)
- `date_validation`: Date de validation par l'admin
- `user_id`: Utilisateur assigné
- `assigned_by_id`: Admin qui a créé la tâche
- `created_at`: Date de création
- `updated_at`: Date de modification

## 🔐 Sécurité

- Authentification par JWT (JSON Web Tokens)
- Mots de passe hashés avec bcrypt
- Protection des routes par rôle (admin/user)
- Validation des données côté serveur

## 🎨 Technologies Utilisées

### Backend
- **Flask**: Framework web Python
- **SQLAlchemy**: ORM pour la base de données
- **Flask-JWT-Extended**: Gestion des tokens JWT
- **Flask-Bcrypt**: Hashage des mots de passe
- **Flask-CORS**: Gestion des CORS
- **MySQL**: Base de données

### Frontend
- **React 19**: Bibliothèque UI
- **Vite**: Build tool rapide
- **TailwindCSS 4**: Framework CSS
- **TypeScript**: Typage statique
- **React Hot Toast**: Notifications

## 📦 API Endpoints

### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/admin/create-user` - Créer un utilisateur (admin)
- `GET /auth/me` - Profil utilisateur connecté

### Tâches (Utilisateur)
- `GET /api/user/tasks` - Mes tâches
- `PUT /api/user/tasks/:id/status` - Mettre à jour le statut
- `PUT /api/user/tasks/:id/note` - Envoyer une note
- `GET /api/user/profile` - Mon profil

### Tâches (Admin)
- `GET /api/admin/users` - Liste des utilisateurs
- `GET /api/admin/tasks` - Toutes les tâches
- `POST /api/admin/tasks` - Créer une tâche
- `PUT /api/admin/tasks/:id` - Modifier une tâche
- `PUT /api/admin/tasks/:id/validate` - Valider une tâche
- `DELETE /api/admin/tasks/:id` - Supprimer une tâche
- `GET /api/admin/users/:id/tasks` - Tâches d'un utilisateur

## 🐛 Dépannage

### Le serveur Flask ne démarre pas
- Vérifiez que MySQL est bien démarré
- Vérifiez les credentials dans `config.py`
- Assurez-vous que la base de données `notejour` existe

### Erreur CORS
- Vérifiez que le frontend tourne sur `http://localhost:5173`
- Vérifiez la configuration CORS dans `app.py`

### Erreur de connexion
- Vérifiez que le backend tourne sur `http://localhost:5000`
- Vérifiez l'URL dans les services frontend

## 📄 Licence

Ce projet est développé pour un usage interne.

## 👨‍💻 Auteur

Développé avec ❤️ pour la gestion efficace des tâches.

## 🎨 Design & Icônes

### Material Icons (Google)
L'application utilise les **Material Icons** de Google pour une expérience visuelle professionnelle:
- Icônes dans les formulaires (Email, Lock, Person, Phone)
- Icônes de navigation (Dashboard, Users, Tasks)
- Icônes d'action (Login, Register, Validate, Delete)
- Icônes d'information (Info, Admin, Success, Error)

### Palette de Couleurs
- **Primary (Indigo)**: #4F46E5
- **Success (Green)**: #22C55E
- **Warning (Amber)**: #F59E0B
- **Error (Red)**: #EF4444
- **Info (Blue)**: #3B82F6

### Typographie
- **Font principale**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

## 📚 Documentation Complète

- **README.md** (ce fichier) - Vue d'ensemble
- **GUIDE_MISE_A_JOUR.md** - Guide de mise à jour détaillé
- **RECAPITULATIF.md** - Récapitulatif des fonctionnalités
- **DEMARRAGE_RAPIDE.md** - Guide de démarrage rapide
- **VERSION_FINALE.md** - Documentation de la version finale
- **RESUME_COMPLET.md** - Résumé complet du projet
- **GUIDE_CONNEXION.md** - Guide de connexion

## 🎉 Version Actuelle: 2.0 - Professionnelle

Cette version inclut:
- ✅ Interface professionnelle avec Material Icons
- ✅ Sidebar et Navbar modernes
- ✅ Photos de profil automatiques
- ✅ Login & Register redesignés
- ✅ Dashboards professionnels
- ✅ Erreur 422 corrigée
- ✅ Design TailwindCSS optimisé
- ✅ Documentation complète

---

**🚀 Application prête pour la production!**
