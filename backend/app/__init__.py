from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt

def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    from .routes.health import bp as health_bp
    app.register_blueprint(health_bp, url_prefix="/")

    return app