import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))
instance_dir = os.path.join(os.path.dirname(basedir), "instance")

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.join(instance_dir, 'dev.db'))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

     # Token expiry for password reset links or similar
    RESET_TOKEN_EXPIRES = timedelta(minutes=30)

    # pagination defaults
    PAGE_SIZE = int(os.getenv("PAGE_SIZE", 10))

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False