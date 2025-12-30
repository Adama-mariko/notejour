from app import app
from extensions import db
from models.role import Role

with app.app_context():
    roles = ['admin', 'user']
    
    for role_name in roles:
        if not Role.query.filter_by(nom=role_name).first():
            role = Role(nom=role_name)
            db.session.add(role)
            print(f"Rôle '{role_name}' créé")
    
    db.session.commit()
    print("Rôles initialisés avec succès")