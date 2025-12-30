class Config:
    SECRET_KEY = "super-secret-key-changez-cela-en-production"
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:@localhost/notejour"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT_SECRET_KEY = "jwt-secret-key"
