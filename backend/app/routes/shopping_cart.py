from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import PurchaseCart, PurchaseCartItem, Book, User

bp = Blueprint("shopping_cart", __name__)

# ---------------------------
# Get shopping cart (approved purchase items only)
# ---------------------------
@bp.route("", methods=["GET"])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Find the user's purchase cart
    cart = PurchaseCart.query.filter_by(user_id=user_id).first()
    if not cart or not cart.items:
        return jsonify({"cart": [], "count": 0}), 200

    items = []
    for item in cart.items:
        book = Book.query.get(item.book_id)
        if book:
            items.append({
                "cart_item_id": item.id,
                "book_id": book.id,
                "title": book.title,
                "author": book.author,
                "price": getattr(book, "price", 0),
                "cover": getattr(book, "cover", None),
                "quantity": item.quantity,
            })

    return jsonify({"cart": items, "count": len(items)}), 200

# ---------------------------
# Add approved book to shopping cart (called from admin approve)
# ---------------------------
@bp.route("", methods=["POST"])
@jwt_required()
def add_to_cart():
    data = request.get_json()
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    if not all([user_id, book_id]):
        return jsonify({"error": "Missing fields"}), 400

    # Find or create the user's cart
    cart = PurchaseCart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = PurchaseCart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()  # ensure cart.id exists

    from ..models import PurchaseCartItem

    existing_item = PurchaseCartItem.query.filter_by(
        cart_id=cart.id, book_id=book_id
    ).first()

    if existing_item:
        existing_item.quantity += 1
    else:
        item = PurchaseCartItem(cart_id=cart.id, book_id=book_id, quantity=1)
        db.session.add(item)

    db.session.commit()
    return jsonify({"message": "Added to cart"}), 201
