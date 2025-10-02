from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from ..extensions import db
from ..models import Order, OrderItem, PurchaseCart, PurchaseCartItem, User, PendingRequest

bp = Blueprint("orders", __name__)

# ---------------------------
# Helpers
# ---------------------------
def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == "admin"


# ---------------------------
# Checkout purchase cart -> order
# ---------------------------
@bp.route("/checkout", methods=["POST"])
@jwt_required()
def checkout_order():
    user_id = get_jwt_identity()
    cart = PurchaseCart.query.filter_by(user_id=user_id, checked_out=False).first()

    if not cart or cart.items.count() == 0:
        return jsonify({"error": "Cart empty"}), 400

    # Create new order
    order = Order(
        user_id=user_id,
        cart_id=cart.id,
        status="pending",
        total_amount=sum([i.book.price * i.quantity for i in cart.items])
    )
    db.session.add(order)

    # Copy items from cart -> order
    for item in cart.items:
        db.session.add(OrderItem(order_id=order.id, book_id=item.book_id, quantity=item.quantity))

    cart.checked_out = True
    db.session.commit()

    return jsonify({"message": "Order created", "order_id": order.id}), 201


# ---------------------------
# User views their orders (detailed)
# ---------------------------
@bp.route("/vieworders", methods=["GET"])
@jwt_required()
def view_orders():
    user_id = get_jwt_identity()

    # 1. Fetch actual orders
    orders = Order.query.filter_by(user_id=user_id).all()
    response = []
    for o in orders:
        response.append({
            "id": o.id,
            "user_id": o.user_id,   # include user_id
            "status": o.status,
            "total_amount": str(o.total_amount),
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "items": [
                {
                    "book_id": i.book_id,
                    "title": i.book.title if i.book else None,
                    "quantity": i.quantity,
                    "price": str(i.book.price) if i.book else None
                }
                for i in o.items
            ]
        })

    # 2. Fetch pending purchase requests
    pending_reqs = PendingRequest.query.filter_by(user_id=user_id, action="purchase").all()
    for p in pending_reqs:
        response.append({
            "id": f"pending-{p.id}",   # avoid clashing with real order IDs
            "user_id": p.user_id,      # include user_id here too
            "status": p.status,
            "total_amount": str(p.book.price) if p.book and p.book.price else "0",
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "items": [
                {
                    "book_id": p.book.id if p.book else None,
                    "title": p.book.title if p.book else "Unknown",
                    "quantity": 1,
                    "price": str(p.book.price) if p.book else None
                }
            ]
        })

    # 3. Sort all combined by created_at desc
    response.sort(
        key=lambda x: x["created_at"] or "",
        reverse=True
    )

    return jsonify(response), 200


# ---------------------------
# Admin approves/rejects order
# ---------------------------
@bp.route("/<order_id>/status", methods=["PUT"])
@jwt_required()
def update_order_status(order_id):
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        return jsonify({"error": "Admins only"}), 403

    data = request.get_json()
    decision = data.get("status")  # approved/rejected

    order = Order.query.get_or_404(order_id)
    if order.status not in ["pending"]:
        return jsonify({"error": "Order already processed"}), 400

    order.status = decision
    order.approved_by = user_id
    order.approved_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": f"Order {decision}"}), 200


# ---------------------------
# Admin views all orders
# ---------------------------
@bp.route("/all", methods=["GET"])
@jwt_required()
def all_orders():
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        return jsonify({"error": "Admins only"}), 403

    orders = Order.query.all()
    return jsonify([{
        "id": o.id,
        "user_id": o.user_id,
        "status": o.status,
        "total_amount": str(o.total_amount),
        "created_at": o.created_at.isoformat()
    } for o in orders])
