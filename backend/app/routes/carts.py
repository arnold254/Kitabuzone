from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import PurchaseCart, PurchaseCartItem, LendingCart, LendingCartItem, Book

bp = Blueprint("carts", __name__)

# ---------------------------
# Helpers
# ---------------------------
def _get_or_create_cart(user_id, cart_model):
    cart = cart_model.query.filter_by(user_id=user_id, checked_out=False).first()
    if not cart:
        cart = cart_model(user_id=user_id)
        db.session.add(cart)
        db.session.commit()
    return cart


# ---------------------------
# Add to purchase cart
# ---------------------------
@bp.route("/purchase/add", methods=["POST"])
@jwt_required()
def add_purchase_cart_item():
    user_id = get_jwt_identity()
    data = request.get_json()
    book_id = data.get("book_id")
    quantity = data.get("quantity", 1)

    if not book_id:
        return jsonify({"error": "book_id required"}), 400

    book = Book.query.get_or_404(book_id)
    if not book.is_available_for_sale:
        return jsonify({"error": "Book not available for sale"}), 400

    cart = _get_or_create_cart(user_id, PurchaseCart)

    item = PurchaseCartItem.query.filter_by(cart_id=cart.id, book_id=book_id).first()
    if item:
        item.quantity += quantity
    else:
        item = PurchaseCartItem(cart_id=cart.id, book_id=book_id, quantity=quantity)
        db.session.add(item)

    db.session.commit()
    return jsonify({"message": "Added to purchase cart"}), 201


# ---------------------------
# Add to lending cart
# ---------------------------
@bp.route("/lending/add", methods=["POST"])
@jwt_required()
def add_lending_cart_item():
    user_id = get_jwt_identity()
    data = request.get_json()
    book_id = data.get("book_id")
    quantity = data.get("quantity", 1)

    if not book_id:
        return jsonify({"error": "book_id required"}), 400

    book = Book.query.get_or_404(book_id)
    if not book.is_available_for_lending:
        return jsonify({"error": "Book not available for lending"}), 400

    cart = _get_or_create_cart(user_id, LendingCart)

    item = LendingCartItem.query.filter_by(cart_id=cart.id, book_id=book_id).first()
    if item:
        item.quantity += quantity
    else:
        item = LendingCartItem(cart_id=cart.id, book_id=book_id, quantity=quantity)
        db.session.add(item)

    db.session.commit()
    return jsonify({"message": "Added to lending cart"}), 201


# ---------------------------
# View purchase cart
# ---------------------------
@bp.route("/purchase", methods=["GET"])
@jwt_required()
def view_purchase_cart():
    user_id = get_jwt_identity()
    cart = PurchaseCart.query.filter_by(user_id=user_id, checked_out=False).first()
    if not cart:
        return jsonify({"items": []})

    return jsonify({
        "id": cart.id,
        "items": [{
            "book_id": i.book_id,
            "title": i.book.title,
            "quantity": i.quantity
        } for i in cart.items]
    })


# ---------------------------
# View lending cart
# ---------------------------
@bp.route("/lending", methods=["GET"])
@jwt_required()
def view_lending_cart():
    user_id = get_jwt_identity()
    cart = LendingCart.query.filter_by(user_id=user_id, checked_out=False).first()
    if not cart:
        return jsonify({"items": []})

    return jsonify({
        "id": cart.id,
        "items": [{
            "book_id": i.book_id,
            "title": i.book.title,
            "quantity": i.quantity
        } for i in cart.items]
    })
