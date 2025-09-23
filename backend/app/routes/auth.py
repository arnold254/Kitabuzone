from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
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
    
    user = User(username=name, name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "user created", "user": user.to_dict()}), 201

@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({"msg": email and password required}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "invalid credentials"}), 401

# Add role as an additional claim so we can check admin-only endpoints
    access_token = create_access_token(identify=user.id, additional_claims={"role": user.role})

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
    # In production: email token. In dev return token for testing.
    return jsonify({"reset_token": token}), 200


@bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    data = request.get_json() or {}
    new_password = data.get("new_password")
    if not new_password:
        return jsonify({"msg": "password required"}), 400
    user = User.verify_reset_token(token)
    if not user:
        return jsonify({"msg": "invalid or expired token"}), 400
    user.set_password(new_password)
    db.session.commit()
    return jsonify({"msg": "password reset successful"}), 200
