from extensions import db

class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(20), unique=True, nullable=False)

    def __init__(self, nom, **kwargs):
        super().__init__(nom=nom.lower(), **kwargs)