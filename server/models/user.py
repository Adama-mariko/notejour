from extensions import db, bcrypt
from flask_jwt_extended import get_jwt_identity
from sqlalchemy.ext.hybrid import hybrid_property

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telephone = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    photo_profile = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    role = db.relationship('Role', backref='users')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    @hybrid_property
    def is_admin(self):
        return self.role.nom == 'admin'
    
    def to_dict(self):
        # Génère une photo de profil par défaut si aucune n'est définie
        default_photo = f'https://ui-avatars.com/api/?name={self.prenom}+{self.nom}&background=4F46E5&color=fff&size=200'
        return {
            'id': self.id,
            'nom': self.nom,
            'prenom': self.prenom,
            'email': self.email,
            'telephone': self.telephone,
            'photo_profile': self.photo_profile or default_photo,
            'role': self.role.nom if self.role else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def to_dict_with_tasks(self):
        data = self.to_dict()
        data['tasks'] = [task.to_dict() for task in self.tasks]
        return data