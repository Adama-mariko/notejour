from app import app, db
from models.user import User
from models.role import Role

def create_admin():
    with app.app_context():
        print("\n" + "="*50)
        print("   CRÉATION D'UN ADMINISTRATEUR")
        print("="*50 + "\n")
        
        # Créer ou récupérer le rôle admin
        admin_role = Role.query.filter_by(nom='admin').first()
        if not admin_role:
            admin_role = Role(nom='admin')
            db.session.add(admin_role)
            db.session.commit()
            print("✅ Rôle 'admin' créé")
        
        # Demander les informations
        nom = input("Nom: ").strip()
        prenom = input("Prénom: ").strip()
        email = input("Email: ").strip().lower()
        telephone = input("Téléphone (10 chiffres): ").strip()
        password = input("Mot de passe (min 6 caractères): ").strip()
        
        # Validation
        if not all([nom, prenom, email, telephone, password]):
            print("\n❌ Erreur: Tous les champs sont obligatoires")
            return
        
        if not (telephone.isdigit() and len(telephone) == 10):
            print("\n❌ Erreur: Le téléphone doit contenir exactement 10 chiffres")
            return
        
        if len(password) < 6:
            print("\n❌ Erreur: Le mot de passe doit contenir au moins 6 caractères")
            return
        
        # Vérifier si l'email existe déjà
        if User.query.filter_by(email=email).first():
            print(f"\n❌ Erreur: L'email {email} est déjà utilisé")
            return
        
        # Vérifier si le téléphone existe déjà
        if User.query.filter_by(telephone=telephone).first():
            print(f"\n❌ Erreur: Le numéro {telephone} est déjà utilisé")
            return
        
        # Créer l'admin
        try:
            admin = User(
                nom=nom,
                prenom=prenom,
                email=email,
                telephone=telephone,
                role_id=admin_role.id
            )
            admin.set_password(password)
            
            db.session.add(admin)
            db.session.commit()
            
            print("\n" + "="*50)
            print("✅ ADMINISTRATEUR CRÉÉ AVEC SUCCÈS!")
            print("="*50)
            print(f"   Nom: {admin.nom} {admin.prenom}")
            print(f"   Email: {admin.email}")
            print(f"   Téléphone: {admin.telephone}")
            print(f"   Rôle: {admin.role.nom}")
            print("="*50 + "\n")
            print("👉 Vous pouvez maintenant vous connecter sur http://localhost:5173")
            print()
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Erreur lors de la création: {str(e)}")

if __name__ == "__main__":
    create_admin()
