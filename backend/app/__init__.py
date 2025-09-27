from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(config_class)

    # Enable CORS for frontend access
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    from .routes.health import bp as health_bp
    app.register_blueprint(health_bp, url_prefix="/health")

    from .routes.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    from .routes.books import bp as books_bp
    app.register_blueprint(books_bp, url_prefix="/books")

    from .routes.carts import bp as carts_bp
    app.register_blueprint(carts_bp, url_prefix="/carts")

    from .routes.orders import bp as orders_bp
    app.register_blueprint(orders_bp, url_prefix="/orders")

    from .routes.lendings import bp as lendings_bp
    app.register_blueprint(lendings_bp, url_prefix="/lendings")

    from .routes.payments import bp as payments_bp
    app.register_blueprint(payments_bp, url_prefix="/payments")

    from .routes.returns import bp as returns_bp
    app.register_blueprint(returns_bp, url_prefix="/returns")

    return app
