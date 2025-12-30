from app import app
from extensions import db
from models.user import User
from models.role import Role

def create_admin():
    with app.app_context():
        admin_role = Role.query.filter_by(nom='admin').first()
        
        if not admin_role:
            admin_role = Role(nom='admin')
            db.session.add(admin_role)
            db.session.commit()
            print("✅ Rôle 'admin' créé")
        existing_admin = User.query.filter(User.role.has(nom='admin')).first()
        
        if existing_admin:
            print(f"⚠️  Un administrateur existe déjà: {existing_admin.email}")
            response = input("Voulez-vous créer un autre admin? (o/n): ")
            if response.lower() != 'o':
                return
        print("\n📝 Création d'un nouvel administrateur")
        print("-" * 40)
        
        nom = input("Nom: ").strip()
        prenom = input("Prénom: ").strip()
        email = input("Email: ").strip().lower()
        telephone = input("Téléphone (10 chiffres): ").strip()
        password = input("Mot de passe (min 6 caractères): ").strip()
        if not (nom and prenom and email and telephone and password):
            print("❌ Tous les champs sont obligatoires")
            return
        
        if not (telephone.isdigit() and len(telephone) == 10):
            print("❌ Le téléphone doit contenir exactement 10 chiffres")
            return
        
        if len(password) < 6:
            print("❌ Le mot de passe doit contenir au moins 6 caractères")
            return
        if User.query.filter_by(email=email).first():
            print("❌ Cet email est déjà utilisé")
            return
        
        if User.query.filter_by(telephone=telephone).first():
            print("❌ Ce numéro de téléphone est déjà utilisé")
            return
        
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
        
        print("\n✅ Administrateur créé avec succès!")
        print(f"   Nom: {admin.nom} {admin.prenom}")
        print(f"   Email: {admin.email}")
        print(f"   Rôle: {admin.role.nom}")

if __name__ == "__main__":
    create_admin()
