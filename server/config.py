import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-key-changez-cela-en-production")
    # Utilise DATABASE_URL si defini (Render), sinon la base locale MySQL
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "mysql+pymysql://root:@localhost/notejour")
    # Fix pour Render qui utilise postgres:// au lieu de postgresql://
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
