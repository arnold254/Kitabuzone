from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from ..extensions import db
from ..models import User

bp = Blueprint("auth", __name__)


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

    # Create user instance
    user = User(username=name, name=name, email=email)
    user.password_hash = User.generate_password_hash(password)  # generate hash
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "user created", "user": user.to_dict()}), 201


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({"msg": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not User.check_password(user, password):
        return jsonify({"msg": "invalid credentials"}), 401

    # Add role as an additional claim for admin-only endpoints
    access_token = create_access_token(
        identity=user.id,
        additional_claims={"role": user.role},
        expires_delta=current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES")
    )

    return jsonify({
        "access_token": access_token,
        "user": user.to_dict()
    }), 200


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
    # In production, you would email the token. Here we return it for dev/testing.
    return jsonify({"reset_token": token}), 200


@bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    """User clicks reset link and submits new password"""
    data = request.get_json() or {}
    new_password = data.get("new_password")
    if not new_password:
        return jsonify({"msg": "password required"}), 400

    user = User.verify_reset_token(token)
    if not user:
        return jsonify({"msg": "invalid or expired token"}), 400

    user.password_hash = User.generate_password_hash(new_password)
    user.clear_reset_token()  # clear token after use
    db.session.commit()

    return jsonify({"msg": "password reset successful"}), 200
