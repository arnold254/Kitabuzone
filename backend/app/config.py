import os
from datetime import timedelta

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'postgresql://kitabu_user:secret123@localhost:5432/kitabu_db'  # default fallback
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    # Token expiry for password reset links or similar
    RESET_TOKEN_EXPIRES = timedelta(minutes=30)

    # Pagination defaults
    PAGE_SIZE = int(os.environ.get("PAGE_SIZE", 10))

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
