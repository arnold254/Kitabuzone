from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from ..extensions import db
from ..models import ReturnRequest, LendingRequest, User

bp = Blueprint("returns", __name__)

# ---------------------------
# Helpers
# ---------------------------
def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == "admin"


# ---------------------------
# User requests return
# ---------------------------
@bp.route("/<int:lending_id>/request", methods=["POST"])
@jwt_required()
def request_return(lending_id):
    user_id = get_jwt_identity()
    lending = LendingRequest.query.get_or_404(lending_id)

    if lending.user_id != user_id:
        return jsonify({"error": "Not your lending record"}), 403

    if lending.status != "borrowed":
        return jsonify({"error": "Book not currently borrowed"}), 400

    existing = ReturnRequest.query.filter_by(
        lending_id=lending.id, status="pending"
    ).first()
    if existing:
        return jsonify({"error": "Return already requested"}), 400

    return_req = ReturnRequest(lending_id=lending.id)
    db.session.add(return_req)
    db.session.commit()

    return jsonify({
        "message": "Return requested",
        "request_id": return_req.id
    }), 201


# ---------------------------
# Admin processes return
# ---------------------------
@bp.route("/<int:return_id>/process", methods=["PUT"])
@jwt_required()
def process_return(return_id):
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        return jsonify({"error": "Admins only"}), 403

    data = request.get_json()
    decision = data.get("status")  # "approved" or "rejected"

    if decision not in ["approved", "rejected"]:
        return jsonify({"error": "Invalid status"}), 400

    return_req = ReturnRequest.query.get_or_404(return_id)
    if return_req.status != "pending":
        return jsonify({"error": "Already processed"}), 400

    return_req.status = decision
    return_req.processed_at = datetime.utcnow()

    if decision == "approved":
        lending = LendingRequest.query.get(return_req.lending_id)
        lending.status = "returned"
        lending.returned_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": f"Return {decision}"}), 200


# ---------------------------
# User sees own returns
# ---------------------------
@bp.route("/my", methods=["GET"])
@jwt_required()
def my_returns():
    user_id = get_jwt_identity()
    returns = ReturnRequest.query.join(LendingRequest).filter(
        LendingRequest.user_id == user_id
    ).all()

    return jsonify([{
        "id": r.id,
        "lending_id": r.lending_id,
        "status": r.status,
        "requested_at": r.requested_at.isoformat() if r.requested_at else None,
        "processed_at": r.processed_at.isoformat() if r.processed_at else None
    } for r in returns]), 200


# ---------------------------
# Admin sees pending returns
# ---------------------------
@bp.route("/pending", methods=["GET"])
@jwt_required()
def pending_returns():
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        return jsonify({"error": "Admins only"}), 403

    returns = ReturnRequest.query.filter_by(status="pending").all()
    return jsonify([{
        "id": r.id,
        "lending_id": r.lending_id,
        "status": r.status,
        "requested_at": r.requested_at.isoformat() if r.requested_at else None
    } for r in returns]), 200
