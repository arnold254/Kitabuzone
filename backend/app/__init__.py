from flask import Flask
from flask_cors import CORS
from .config import DevelopmentConfig
from .extensions import db, migrate, jwt

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(config_class)

    # Allow both /books and /books/ without redirect
    app.url_map.strict_slashes = False

    # Ensure the instance folder exists
    try:
        import os
        os.makedirs(app.instance_path, exist_ok=True)
    except Exception:
        pass

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db, directory="backend/migrations")
    jwt.init_app(app)

    # Enable CORS for React frontend
    CORS(
        app,
        resources={r"/*": {"origins": "https://kitabuzone-ktpc.onrender.com"}},
        supports_credentials=True
    )

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

    from .routes.lending import bp as lendings_bp
    app.register_blueprint(lendings_bp, url_prefix="/lendings")

    from .routes.payments import bp as payments_bp
    app.register_blueprint(payments_bp, url_prefix="/payments")

    from .routes.returns import bp as returns_bp
    app.register_blueprint(returns_bp, url_prefix="/returns")

    from .routes.dashboard import dashboard_bp
    app.register_blueprint(dashboard_bp)

    from .routes.admin import bp as admin_bp
    app.register_blueprint(admin_bp)
    
    from .routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix="/users")

    from .routes.pendingRequests import bp as pending_requests_bp
    app.register_blueprint(pending_requests_bp, url_prefix="/pendingRequests")

    from app.routes.activity_logs import activity_logs_bp
    app.register_blueprint(activity_logs_bp)
 
    from .routes import shopping_cart
    app.register_blueprint(shopping_cart.bp, url_prefix="/shoppingCart")

    from .routes.borrowing_cart import bp as borrowing_cart_bp
    app.register_blueprint(borrowing_cart_bp, url_prefix="/borrowingCart")

    return app
