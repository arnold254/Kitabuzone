from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import PendingRequest, User, ActivityLog, PurchaseCart, PurchaseCartItem

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
    action = data.get("action", "borrow")

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
# List pending requests
# ---------------------------
@bp.route("", methods=["GET"])
@jwt_required()
def list_requests():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    requests = PendingRequest.query.all() if user.role == "admin" else PendingRequest.query.filter_by(user_id=user_id).all()

    results = []
    for r in requests:
        results.append({
            "id": r.id,
            "user_id": r.user_id,
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
# Update single request status (Admin or User actions)
# ---------------------------
@bp.route("/<request_id>", methods=["PATCH"])
@jwt_required()
def update_request(request_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    new_status = data.get("status")
    pending = PendingRequest.query.get_or_404(request_id)

    # ---------- ADMIN ACTIONS ----------
    if user.role == "admin":
        if new_status.lower() in ["approve", "approved"]:
            pending.status = "approved"
            log_action = "Approved"

            # --- Automatically add to user's cart ---
            cart = PurchaseCart.query.filter_by(user_id=pending.user_id).first()
            if not cart:
                cart = PurchaseCart(user_id=pending.user_id)
                db.session.add(cart)
                db.session.commit()

            existing_item = PurchaseCartItem.query.filter_by(
                cart_id=cart.id,
                book_id=pending.book_id,
                checked_out=False
            ).first()

            if not existing_item:
                item = PurchaseCartItem(cart_id=cart.id, book_id=pending.book_id, quantity=1, checked_out=False)
                db.session.add(item)

        elif new_status.lower() in ["decline", "declined"]:
            pending.status = "declined"
            log_action = "Declined"

        elif new_status.lower() == "return_approved" and pending.status == "return_pending":
            pending.status = "returned"
            log_action = "Return Approved"
            if pending.book:
                pending.book.copies_available += 1
        else:
            return jsonify({"error": "Invalid status"}), 400

        log = ActivityLog(
            user_id=user.id,
            action=log_action,
            item=f"Request {pending.id} for book '{pending.book.title if pending.book else pending.book_id}'"
        )
        db.session.add(log)
        db.session.commit()
        return jsonify({"message": f"Request {pending.status} processed and logged", "status": pending.status}), 200

    # ---------- USER ACTIONS ----------
    else:
     if pending.user_id != user.id:
        return jsonify({"error": "Action not allowed: You do not own this request"}), 403

    # Confirm borrow
    if new_status.lower() == "confirm_borrow" and pending.status == "approved":
        pending.status = "borrowed"
        log_action = "Borrowed"

    # Request return
    elif new_status.lower() == "return_pending" and pending.status == "borrowed":
        pending.status = "return_pending"
        log_action = "Return Requested"

    # Mark as purchased
    elif new_status.lower() == "purchased" and pending.status == "approved":
        pending.status = "purchased"
        log_action = "Purchased"

        # --- Mark all cart items for this book as checked out ---
        cart = PurchaseCart.query.filter_by(user_id=user.id).first()
        if cart:
            cart_items = PurchaseCartItem.query.filter_by(
                cart_id=cart.id,
                book_id=pending.book_id,
                checked_out=False
            ).all()
            for item in cart_items:
                item.checked_out = True
        
        # --- DEBUG PRINT ---
        print(f"DEBUG: User {user.id} marked pending_request {pending.id} as purchased")
        print(f"DEBUG: Cart items checked out: {[item.id for item in cart_items]}")

    else:
        return jsonify({"error": "Action not allowed"}), 403

    log = ActivityLog(
        user_id=user.id,
        action=log_action,
        item=f"Request {pending.id} for book '{pending.book.title if pending.book else pending.book_id}'"
    )
    db.session.add(log)
    db.session.commit()
    print(f"DEBUG: Commit done for pending_request {pending.id}, status {pending.status}")
    return jsonify({"message": f"Request updated to {pending.status}", "status": pending.status}), 200


# ---------------------------
# Confirm borrow (User action to move approved -> borrowed)
# ---------------------------
@bp.route("/confirm/<request_id>", methods=["PATCH"])
@jwt_required()
def confirm_borrow(request_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    pending = PendingRequest.query.get_or_404(request_id)

    if pending.user_id != user.id:
        return jsonify({"error": "Not allowed"}), 403

    if pending.status != "approved" or pending.action.lower() != "borrow":
        return jsonify({"error": "Cannot confirm borrow"}), 400

    pending.status = "borrowed"

    log = ActivityLog(
        user_id=user.id,
        action="Borrowed",
        item=f"Borrow confirmed for book '{pending.book.title if pending.book else pending.book_id}'"
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Borrow confirmed", "status": "borrowed"}), 200
