from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from ..extensions import db
from ..models import Order, Payment, User

bp = Blueprint("payments", __name__)

# ---------------------------
# Helpers
# ---------------------------
def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == "admin"


# ---------------------------
# Make a payment (user)
# ---------------------------
@bp.route("/<order_id>", methods=["POST"])
@jwt_required()
def make_payment(order_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    order = Order.query.get_or_404(order_id)
    if order.user_id != user_id:
        return jsonify({"error": "Not your order"}), 403

    if order.status not in ["pending", "approved"]:
        return jsonify({"error": "Order not payable"}), 400

    amount = data.get("amount")
    method = data.get("payment_method", "manual")

    if not amount or float(amount) <= 0:
        return jsonify({"error": "Invalid amount"}), 400

    payment = Payment(
        order_id=order.id,
        user_id=user_id,
        amount=amount,
        payment_method=method,
        paid_at=datetime.utcnow()
    )
    db.session.add(payment)
    order.paid_at = datetime.utcnow()
    order.status = "completed"
    db.session.commit()

    return jsonify({
        "message": "Payment successful",
        "payment_id": payment.id,
        "order_id": order.id
    }), 201


# ---------------------------
# View my payments
# ---------------------------
@bp.route("/my", methods=["GET"])
@jwt_required()
def my_payments():
    user_id = get_jwt_identity()
    payments = Payment.query.filter_by(user_id=user_id).all()

    return jsonify([{
        "id": p.id,
        "order_id": p.order_id,
        "amount": str(p.amount),
        "method": p.payment_method,
        "paid_at": p.paid_at.isoformat() if p.paid_at else None
    } for p in payments])


# ---------------------------
# View all payments (admin only)
# ---------------------------
@bp.route("/all", methods=["GET"])
@jwt_required()
def all_payments():
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        return jsonify({"error": "Admins only"}), 403

    payments = Payment.query.all()
    return jsonify([{
        "id": p.id,
        "order_id": p.order_id,
        "user_id": p.user_id,
        "amount": str(p.amount),
        "method": p.payment_method,
        "paid_at": p.paid_at.isoformat() if p.paid_at else None
    } for p in payments])
