from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from models.task import Task
from datetime import datetime
import json
from flask_jwt_extended import get_jwt

task_bp = Blueprint("tasks", __name__)


def get_current_user():
    """Récupère l'utilisateur actuel à partir du token (email)"""
    user_identity = get_jwt_identity()
    try:
        data = json.loads(user_identity)
        email = data.get("email")
    except:
        email = user_identity
    return User.query.filter_by(email=email).first()



def check_admin_access():
    current_user = get_current_user()
    
    if not current_user:
        return False, None
    
    if not current_user.role:
        return False, current_user
    
    is_admin = current_user.role.nom.lower() == 'admin'
    return is_admin, current_user


def check_user_role(user, expected_role='user'):
    """Vérifie le rôle d'un utilisateur (insensible à la casse)"""
    if not user or not user.role:
        return False
    return user.role.nom.lower() == expected_role


@task_bp.route("/admin/users", methods=["GET"])
@jwt_required()
def get_all_users():
    """Récupérer tous les utilisateurs (non-admin)"""
    is_admin, current_user = check_admin_access()
    
    if not is_admin:
        return jsonify({"error": "Accès non autorisé"}), 403
    
    # Récupérer les utilisateurs avec rôle 'user'
    users = User.query.filter(
        db.func.lower(User.role.nom) == 'user'
    ).all()
    
    return jsonify([user.to_dict() for user in users]), 200

@task_bp.route("/admin/tasks", methods=["GET"])
@jwt_required()
def get_all_tasks():
    """Récupérer toutes les tâches (pour l'admin)"""
    is_admin, current_user = check_admin_access()
    
    if not is_admin:
        return jsonify({"error": "Accès non autorisé"}), 403
    
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks]), 200

@task_bp.route("/admin/tasks", methods=["POST"])
@jwt_required()
def create_task():
    """Créer une nouvelle tâche et l'assigner à un utilisateur"""
    is_admin, current_user = check_admin_access()
    
    if not is_admin:
        return jsonify({"error": "Accès non autorisé"}), 403
    
    data = request.get_json()
    
    user_id = data.get("user_id")
    titre = data.get("titre")
    description = data.get("description", "")
    
    if not (user_id and titre):
        return jsonify({"error": "L'utilisateur et le titre sont obligatoires"}), 400
    
    # user_id est un ID numérique
    user = User.query.get(user_id)
    if not user or not check_user_role(user, 'user'):
        return jsonify({"error": "Utilisateur invalide. Doit être un utilisateur standard (non-admin)"}), 400
    
    task = Task(
        titre=titre,
        description=description,
        user_id=user_id,
        assigned_by_id=current_user.id,
        statut='à faire'  # Statut initial
    )
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify(task.to_dict()), 201

@task_bp.route("/admin/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    """Modifier une tâche (admin uniquement)"""
    is_admin, current_user = check_admin_access()
    
    if not is_admin:
        return jsonify({"error": "Accès non autorisé"}), 403
    
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Tâche non trouvée"}), 404
    
    data = request.get_json()
    
    if 'titre' in data:
        task.titre = data['titre']
    if 'description' in data:
        task.description = data['description']
    if 'statut' in data:
        # Vérifier que le statut est valide (admin peut tout faire)
        if data['statut'] not in ['à faire', 'en cours', 'terminé', 'validé']:
            return jsonify({"error": "Statut invalide"}), 400
        task.statut = data['statut']
    
    db.session.commit()
    return jsonify(task.to_dict()), 200

@task_bp.route("/admin/tasks/<int:task_id>/validate", methods=["PUT"])
@jwt_required()
def validate_task(task_id):
    """Admin valide une tâche que l'utilisateur a marqué comme terminée"""
    is_admin, current_user = check_admin_access()
    
    if not is_admin:
        return jsonify({"error": "Accès non autorisé"}), 403
    
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Tâche non trouvée"}), 404
    
    if task.statut != 'terminé':
        return jsonify({
            "error": "Action impossible",
            "message": "Seules les tâches 'terminé' peuvent être validées",
            "statut_actuel": task.statut
        }), 400
    
    task.valide_par_admin = True
    task.statut = 'validé'
    task.date_validation = datetime.utcnow()
    task.validated_by_id = current_user.id
    
    db.session.commit()
    
    return jsonify({
        "message": "Tâche validée avec succès",
        "task": task.to_dict()
    }), 200

@task_bp.route("/admin/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    """Supprimer une tâche"""
    is_admin, current_user = check_admin_access()
    
    if not is_admin:
        return jsonify({"error": "Accès non autorisé"}), 403
    
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Tâche non trouvée"}), 404
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({"message": "Tâche supprimée avec succès"}), 200

@task_bp.route("/admin/users/<int:user_id>/tasks", methods=["GET"])
@jwt_required()
def get_user_tasks(user_id):
    """Récupérer les tâches d'un utilisateur spécifique"""
    is_admin, current_user = check_admin_access()
    
    if not is_admin:
        return jsonify({"error": "Accès non autorisé"}), 403
    
    user = User.query.get(user_id)
    if not user or not check_user_role(user, 'user'):
        return jsonify({"error": "Utilisateur invalide"}), 400
    
    tasks = Task.query.filter_by(user_id=user_id).order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks]), 200

# ============= ROUTES UTILISATEUR =============

@task_bp.route("/user/tasks", methods=["GET"])
@jwt_required()
def get_my_tasks():
    """Récupérer mes tâches"""
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    tasks = Task.query.filter_by(user_id=current_user.id).order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks]), 200

@task_bp.route("/user/tasks/<int:task_id>/status", methods=["PUT"])
@jwt_required()
def update_task_status(task_id):
    """Utilisateur met à jour le statut"""
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    task = Task.query.get(task_id)
    if not task or task.user_id != current_user.id:
        return jsonify({"error": "Tâche non trouvée"}), 404
    
    data = request.get_json()
    new_status = data.get("statut")
    
    print(f"DEBUG update_task_status:")
    print(f"  Task ID: {task_id}")
    print(f"  Current status: {task.statut}")
    print(f"  New status received: {new_status}")
    
    # Vérifier le statut reçu
    if new_status not in ['en cours', 'terminé']:
        return jsonify({
            "error": "Statut invalide",
            "message": "Utilisez 'en cours' ou 'terminé'",
            "statuts_autorisés": ["en cours", "terminé"]
        }), 400
    
    # Vérifier les transitions autorisées
    if task.statut == 'à faire' and new_status == 'terminé':
        # On peut passer directement de "à faire" à "terminé"
        pass
    elif task.statut == 'à faire' and new_status == 'en cours':
        # Normal : à faire → en cours
        pass
    elif task.statut == 'en cours' and new_status == 'terminé':
        # Normal : en cours → terminé
        pass
    else:
        # Transition non autorisée
        return jsonify({
            "error": "Transition non autorisée",
            "message": f"Impossible de passer de '{task.statut}' à '{new_status}'",
            "statut_actuel": task.statut,
            "statut_demandé": new_status
        }), 400
    
    # Appliquer le nouveau statut
    task.statut = new_status
    
    # Si l'utilisateur marque comme terminé, ajouter la date de fin
    if new_status == 'terminé':
        task.date_fin = datetime.utcnow()
    
    db.session.commit()
    
    print(f"  SUCCESS: Status updated to {new_status}")
    
    return jsonify({
        "message": f"Tâche marquée comme '{new_status}'",
        "task": task.to_dict()
    }), 200

@task_bp.route("/user/tasks/<int:task_id>/note", methods=["PUT"])
@jwt_required()
def submit_task_note(task_id):
    """Soumettre une note pour une tâche"""
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    task = Task.query.get(task_id)
    if not task or task.user_id != current_user.id:
        return jsonify({"error": "Tâche non trouvée"}), 404
    
    data = request.get_json()
    note = data.get("note_utilisateur", "")
    
    task.note_utilisateur = note
    
    # Optionnel : si l'utilisateur soumet une note, on peut automatiquement passer en "terminé"
    # Décommentez si vous voulez cette fonctionnalité :
    # if note and task.statut == 'en cours':
    #     task.statut = 'terminé'
    #     task.date_fin = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        "message": "Note enregistrée avec succès",
        "task": task.to_dict()
    }), 200

@task_bp.route("/user/profile", methods=["GET"])
@jwt_required()
def get_my_profile():
    """Récupérer mon profil"""
    current_user = get_current_user()
    
    if not current_user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    return jsonify(current_user.to_dict()), 200

@task_bp.route("/user/tasks/<int:task_id>", methods=["GET"])
@jwt_required()
def get_my_task(task_id):
    """Récupérer une tâche spécifique"""
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    task = Task.query.get(task_id)
    if not task or task.user_id != current_user.id:
        return jsonify({"error": "Tâche non trouvée"}), 404
    
    return jsonify(task.to_dict()), 200

# ============= ROUTES DEBUG/UTILITAIRES =============

@task_bp.route("/debug/whoami", methods=["GET"])
@jwt_required()
def debug_whoami():
    """Débogage: voir les infos de l'utilisateur connecté"""
    user_identity = get_jwt_identity()
    user = User.query.filter_by(email=user_identity).first()
    
    if not user:
        return jsonify({
            "error": "Utilisateur non trouvé",
            "email_in_token": user_identity
        }), 404
    
    return jsonify({
        "email_in_token": user_identity,
        "user": user.to_dict()
    }), 200

@task_bp.route("/admin/test", methods=["GET"])
@jwt_required()
def admin_test():
    """Route de test pour vérifier l'accès admin"""
    is_admin, current_user = check_admin_access()
    
    if not is_admin:
        return jsonify({
            "error": "Accès non autorisé",
            "user_email": get_jwt_identity()
        }), 403
    
    return jsonify({
        "message": "Accès admin autorisé",
        "user": current_user.to_dict()
    }), 200

@task_bp.route("/debug/user/<int:user_id>", methods=["GET"])
@jwt_required()
def debug_user(user_id):
    """Vérifier un utilisateur spécifique"""
    is_admin, current_user = check_admin_access()
    
    if not is_admin:
        return jsonify({"error": "Accès non autorisé"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": f"Utilisateur {user_id} non trouvé"}), 404
    
    return jsonify(user.to_dict()), 200

@task_bp.route("/debug/task/<int:task_id>", methods=["GET"])
@jwt_required()
def debug_task(task_id):
    """Vérifier une tâche spécifique"""
    is_admin, current_user = check_admin_access()
    
    if not is_admin:
        # Les utilisateurs normaux peuvent voir leurs propres tâches
        current_user = get_current_user()
        if not current_user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        
        task = Task.query.get(task_id)
        if not task or task.user_id != current_user.id:
            return jsonify({"error": "Tâche non trouvée"}), 404
        
        return jsonify(task.to_dict()), 200
    
    # Admin peut voir toutes les tâches
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Tâche non trouvée"}), 404
    
    return jsonify(task.to_dict()), 200