from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User
from models.role import Role
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity, decode_token
from datetime import datetime, timedelta
import json

auth_bp = Blueprint("auth", __name__)

token_blacklist = {}

@auth_bp.post("/login")
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    remember_me = data.get("remember_me", True)

    if not (email and password):
        return {"error": "Email et mot de passe obligatoires"}, 400

    email = email.strip().lower()
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return {"error": "Email ou mot de passe incorrect"}, 401

    expires_delta = timedelta(days=30)
    token_data = {"email": str(user.email), "user_id": user.id}

    access_token = create_access_token(
        identity=json.dumps(token_data),
        expires_delta=expires_delta
    )

    return {
        "message": "Connexion réussie",
        "token": access_token,
        "user": {
            "id": user.id,
            "nom": user.nom,
            "prenom": user.prenom,
            "email": user.email,
            "telephone": user.telephone,
            "role": user.role.nom
        },
        "expires_in_days": 30
    }, 200

@auth_bp.post("/logout")
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    token_blacklist[jti] = datetime.utcnow().isoformat()
    return {"message": "Déconnexion réussie", "logout_time": datetime.utcnow().isoformat()}, 200

def is_token_blacklisted(jti):
    return jti in token_blacklist

def cleanup_old_tokens(max_age_days=7):
    cutoff_time = datetime.utcnow() - timedelta(days=max_age_days)
    to_remove = []
    for jti, t in token_blacklist.items():
        try:
            if datetime.fromisoformat(t) < cutoff_time:
                to_remove.append(jti)
        except:
            to_remove.append(jti)
    for jti in to_remove:
        token_blacklist.pop(jti, None)

@auth_bp.post("/register")
def register():
    data = request.get_json()
    nom = data.get("nom")
    prenom = data.get("prenom")
    email = data.get("email")
    telephone = data.get("telephone")
    password = data.get("password")
    role_name = data.get("role", "user")

    if not all([nom, prenom, email, telephone, password]):
        return {"error": "Veuillez remplir tous les champs"}, 400

    if not (telephone.isdigit() and len(telephone) == 10):
        return {"error": "Le numéro de téléphone doit contenir 10 chiffres"}, 400

    if len(password) < 6:
        return {"error": "Mot de passe trop court"}, 400

    if User.query.filter_by(email=email).first():
        return {"error": "Email déjà utilisé"}, 400
    if User.query.filter_by(telephone=telephone).first():
        return {"error": "Numéro de téléphone déjà utilisé"}, 400

    role_obj = Role.query.filter_by(nom=role_name.lower()).first()
    if not role_obj:
        role_obj = Role(nom=role_name.lower())
        db.session.add(role_obj)
        db.session.flush()

    user = User(nom=nom, prenom=prenom, email=email, telephone=telephone, role_id=role_obj.id)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return {"message": "Utilisateur créé avec succès"}, 201

@auth_bp.get("/me")
@jwt_required()
def get_current_user():
    identity = get_jwt_identity()
    try:
        email = json.loads(identity).get("email")
    except:
        email = identity
    user = User.query.filter_by(email=email).first()
    if not user:
        return {"error": "Utilisateur non trouvé"}, 404
    return jsonify(user.to_dict()), 200

@auth_bp.get("/users")
@jwt_required()
def get_users():
    identity = get_jwt_identity()
    try:
        email = json.loads(identity).get("email")
    except:
        email = identity
    current_user = User.query.filter_by(email=email).first()
    if not current_user or current_user.role.nom != "admin":
        return {"error": "Accès non autorisé"}, 403
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200


@auth_bp.post("/admin/create-user")
@jwt_required()
def admin_create_user():
    identity = get_jwt_identity()
    try:
        email = json.loads(identity).get("email")
    except:
        email = identity
    
    current_user = User.query.filter_by(email=email).first()
    
    if not current_user or current_user.role.nom.lower() != "admin":
        return {"error": "Accès non autorisé"}, 403

    data = request.get_json()
    required_fields = ["nom", "prenom", "email", "telephone", "password"]

    for field in required_fields:
        if not data.get(field):
            return {"error": f"Le champ {field} est requis"}, 400

    nom = data["nom"].strip()
    prenom = data["prenom"].strip()
    email = data["email"].strip().lower()
    telephone = data["telephone"].strip()
    password = data["password"]
    role_name = data.get("role", "user").lower()

    if User.query.filter_by(email=email).first():
        return {"error": "Email déjà utilisé"}, 400
    if User.query.filter_by(telephone=telephone).first():
        return {"error": "Numéro de téléphone déjà utilisé"}, 400
    if not (telephone.isdigit() and len(telephone) == 10):
        return {"error": "Le numéro de téléphone doit contenir 10 chiffres"}, 400
    if len(password) < 6:
        return {"error": "Mot de passe trop court"}, 400

    role_obj = Role.query.filter_by(nom=role_name).first()
    if not role_obj:
        role_obj = Role(nom=role_name)
        db.session.add(role_obj)
        db.session.flush()

    new_user = User(
        nom=nom,
        prenom=prenom,
        email=email,
        telephone=telephone,
        role_id=role_obj.id
    )
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return {
        "message": "Utilisateur créé avec succès",
        "user": {
            "id": new_user.id,
            "nom": new_user.nom,
            "prenom": new_user.prenom,
            "email": new_user.email,
            "telephone": new_user.telephone,
            "role": role_obj.nom
        }
    }, 201
