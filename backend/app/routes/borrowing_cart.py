# backend/app/routes/borrowing_cart.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import PendingRequest

bp = Blueprint("borrowingCart", __name__)

@bp.route("", methods=["GET"])
@jwt_required()
def get_borrowing_cart():
    user_id = get_jwt_identity()

    # Get only approved requests for the current user
    approved_requests = PendingRequest.query.filter_by(user_id=user_id, status="approved").all()

    cart_items = []
    for req in approved_requests:
        if req.book:
            cart_items.append({
                "id": req.id,              # ✅ use pending request ID
                "title": req.book.title,
                "cover": req.book.cover,
                "price": getattr(req.book, "price", 0),
                "quantity": 1,             # default quantity
                 "created_at": req.created_at
            })

    return jsonify(cart_items), 200
