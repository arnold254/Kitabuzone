from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import PendingRequest, User

bp = Blueprint("pendingRequests", __name__)

# ---------------------------
# Create a new pending request
# ---------------------------
@bp.route("", methods=["POST"])
@jwt_required()
def create_request():
    user_id = get_jwt_identity()
    data = request.get_json()
    book_id = data.get("book_id")
    action = data.get("action", "borrow")  # default to borrow for library

    if not book_id:
        return jsonify({"error": "book_id is required"}), 400

    pending = PendingRequest(
        user_id=user_id,
        book_id=book_id,
        action=action,
        status="pending"
    )
    db.session.add(pending)
    db.session.commit()

    print(f"Pending request created: {pending.id} for user {user_id}")
    return jsonify({"message": "Request submitted", "id": pending.id}), 201

# ---------------------------
# List pending requests with book info
# ---------------------------
@bp.route("", methods=["GET"])
@jwt_required()
def list_requests():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.role == "admin":
        requests = PendingRequest.query.all()
    else:
        requests = PendingRequest.query.filter_by(user_id=user_id).all()

    results = []
    for r in requests:
        results.append({
            "id": r.id,
            "user": r.user.name if r.user else r.user_id,
            "book_id": r.book_id,
            "book": {
                "id": r.book.id,
                "title": r.book.title,
                "author": r.book.author,
                "price": getattr(r.book, "price", None),
                "cover": getattr(r.book, "cover", None),
            } if r.book else None,
            "action": getattr(r, "action", None),
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        })

    return jsonify(results), 200

# ---------------------------
# Update pending request status
# ---------------------------
@bp.route("/<request_id>", methods=["PATCH"])
@jwt_required()
def update_request(request_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != "admin":
        return jsonify({"error": "Admins only"}), 403

    data = request.get_json()
    new_status = data.get("status")

    pending = PendingRequest.query.get_or_404(request_id)
    pending.status = new_status
    db.session.commit()
    print(f"Pending request {pending.id} updated to {new_status}")

    # ---------------------------
    # If approved, add to PurchaseCart
    # ---------------------------
    if new_status.lower() in ["approve", "approved"]:
        from ..models import PurchaseCart, PurchaseCartItem

        print("Adding book to cart for user:", pending.user_id)
        print("Book ID:", pending.book_id)

        # Find or create the user's cart
        cart = PurchaseCart.query.filter_by(user_id=pending.user_id).first()
        if not cart:
            cart = PurchaseCart(user_id=pending.user_id)
            db.session.add(cart)
            db.session.commit()
            print("Created new cart for user:", cart.id)

        # Add the approved book as an item (avoid duplicates)
        existing_item = PurchaseCartItem.query.filter_by(
            cart_id=cart.id, book_id=pending.book_id
        ).first()
        if existing_item:
            existing_item.quantity += 1
            print(f"Increased quantity for book {pending.book_id} in cart {cart.id}")
        else:
            item = PurchaseCartItem(cart_id=cart.id, book_id=pending.book_id, quantity=1)
            db.session.add(item)
            print(f"Added book {pending.book_id} to cart {cart.id}")

        db.session.commit()  # commit items

        print("Cart found:", cart.id)
        print("Cart items count:", len(list(cart.items)) if cart else 0)

    # ---------------------------
    # Log the action
    # ---------------------------
    from ..models import ActivityLog
    log = ActivityLog(
        user_id=user.id,
        action=new_status.capitalize(),
        item=f"Request {pending.id} for book '{pending.book.title if pending.book else pending.book_id}'"
    )
    db.session.add(log)
    db.session.commit()
    print(f"Action logged for request {pending.id}")

    return jsonify({"message": f"Request {new_status} and logged"}), 200
