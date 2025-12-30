from extensions import db
from datetime import datetime

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    statut = db.Column(db.String(50), default='à faire')  # 'à faire', 'en cours', 'terminé', 'validé'
    note_utilisateur = db.Column(db.Text, nullable=True)  # Note envoyée par l'utilisateur
    valide_par_admin = db.Column(db.Boolean, default=False)  # Validation par l'admin
    date_validation = db.Column(db.DateTime, nullable=True)  # Date de validation
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    user = db.relationship('User', foreign_keys=[user_id], backref='tasks')
    assigned_by = db.relationship('User', foreign_keys=[assigned_by_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'titre': self.titre,
            'description': self.description,
            'statut': self.statut,
            'note_utilisateur': self.note_utilisateur,
            'valide_par_admin': self.valide_par_admin,
            'date_validation': self.date_validation.isoformat() if self.date_validation else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user_id': self.user_id,
            'assigned_by_id': self.assigned_by_id,
            'user': {
                'id': self.user.id,
                'nom': self.user.nom,
                'prenom': self.user.prenom,
                'email': self.user.email
            } if self.user else None
        }