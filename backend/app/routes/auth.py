from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, decode_token
from ..extensions import db
from ..models import User

bp = Blueprint("auth", __name__)

# -------------------- REGISTER --------------------
@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not (name and email and password):
        return jsonify({"msg": "name, email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "user with this email already exists"}), 409

    user = User(username=name, name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "user created", "user": user.to_dict()}), 201

# -------------------- LOGIN --------------------
@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({"msg": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "invalid credentials"}), 401

    access_token = create_access_token(
        identity=user.id,
        additional_claims={"role": user.role},
        expires_delta=current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES")
    )

    return jsonify({
        "access_token": access_token,
        "user": user.to_dict()
    }), 200

# -------------------- REQUEST PASSWORD RESET --------------------
@bp.route("/request-password-reset", methods=["POST"])
def request_password_reset():
    data = request.get_json() or {}
    email = data.get("email")
    if not email:
        return jsonify({"msg": "email required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    token = user.generate_reset_token()
    # In production, you would email this token. For dev/testing we return it.
    print("Generated reset token:", token)  # <-- debug
    return jsonify({"reset_token": token}), 200

# -------------------- RESET PASSWORD --------------------
@bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    data = request.get_json() or {}
    new_password = data.get("new_password")
    if not new_password:
        return jsonify({"msg": "password required"}), 400

    print("Received token for reset:", token)  # <-- debug
    user = User.verify_reset_token(token)
    if not user:
        print("Token verification failed")  # <-- debug
        return jsonify({"msg": "invalid or expired token"}), 400
    print("Token verified for user:", user.email)  # <-- debug

    user.set_password(new_password)
    # Optional: clear the token after use
    if hasattr(user, "reset_token"):
        user.reset_token = None
        user.reset_token_expiration = None

    db.session.commit()

    return jsonify({"msg": "password reset successful"}), 200
