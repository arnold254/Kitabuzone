from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from ..extensions import db
from ..models import LendingRequest, LendingCart, LendingCartItem, Book, User

bp = Blueprint("lending", __name__)

# ---------------------------
# Helpers
# ---------------------------
def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == "admin"


# ---------------------------
# Checkout lending cart -> request
# ---------------------------
@bp.route("/checkout", methods=["POST"])
@jwt_required()
def checkout_lending():
    user_id = get_jwt_identity()
    cart = LendingCart.query.filter_by(user_id=user_id, checked_out=False).first()

    if not cart or cart.items.count() == 0:
        return jsonify({"error": "Cart empty"}), 400

    # Create lending request
    lending = LendingRequest(
        user_id=user_id,
        cart_id=cart.id,
        status="pending",
        created_at=datetime.utcnow()
    )
    db.session.add(lending)

    cart.checked_out = True
    db.session.commit()

    return jsonify({"message": "Lending request submitted", "lending_id": lending.id}), 201


# ---------------------------
# User views their lending requests
# ---------------------------
@bp.route("/my", methods=["GET"])
@jwt_required()
def my_lendings():
    user_id = get_jwt_identity()
    lendings = LendingRequest.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": l.id,
        "status": l.status,
        "created_at": l.created_at.isoformat(),
        "due_date": l.due_date.isoformat() if l.due_date else None,
        "returned_at": l.returned_at.isoformat() if l.returned_at else None
    } for l in lendings])


# ---------------------------
# Admin approves/rejects lending
# ---------------------------
@bp.route("/<lending_id>/status", methods=["PUT"])
@jwt_required()
def update_lending_status(lending_id):
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        return jsonify({"error": "Admins only"}), 403

    data = request.get_json()
    decision = data.get("status")  # approved/rejected

    lending = LendingRequest.query.get_or_404(lending_id)
    if lending.status != "pending":
        return jsonify({"error": "Already processed"}), 400

    lending.status = decision
    lending.approved_by = user_id
    lending.approved_at = datetime.utcnow()

    if decision == "approved":
        lending.due_date = datetime.utcnow() + timedelta(days=14)  # 2 weeks default

    db.session.commit()
    return jsonify({"message": f"Lending {decision}"}), 200


# ---------------------------
# Admin views all lending requests
# ---------------------------
@bp.route("/all", methods=["GET"])
@jwt_required()
def all_lendings():
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        return jsonify({"error": "Admins only"}), 403

    lendings = LendingRequest.query.all()
    return jsonify([{
        "id": l.id,
        "user_id": l.user_id,
        "status": l.status,
        "created_at": l.created_at.isoformat(),
        "due_date": l.due_date.isoformat() if l.due_date else None
    } for l in lendings])
