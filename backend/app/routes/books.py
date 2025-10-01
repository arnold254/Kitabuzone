from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..extensions import db
from ..models import Book
from functools import wraps

bp = Blueprint("books", __name__)

# -------------------------
# Admin-only decorator
# -------------------------
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"msg": "Admin privileges required!"}), 403
        return fn(*args, **kwargs)
    return wrapper

# -------------------------
# List books (optional filter by location)
# -------------------------
@bp.route("/", methods=["GET"])
def list_books():
    location = request.args.get("location")  # ?location=Store or Library
    query = Book.query
    if location:
        query = query.filter_by(location=location)
    books = query.all()
    return jsonify([book.to_dict() for book in books]), 200

# -------------------------
# Get a single book
# -------------------------
@bp.route("/<string:book_id>", methods=["GET"])
def get_book(book_id):
    # Use filter_by for string/UUID primary key
    book = Book.query.filter_by(id=book_id).first()
    if not book:
        return jsonify({"msg": "Book not found"}), 404
    return jsonify(book.to_dict()), 200

# -------------------------
# Create book (admin only)
# -------------------------
@bp.route("/", methods=["POST"])
@admin_required
def create_book():
    data = request.get_json() or {}
    title = data.get("title")
    if not title:
        return jsonify({"msg": "title is required"}), 400

    location = data.get("location", "Library")
    if location == "Store" and not data.get("price"):
        return jsonify({"msg": "Price is required when adding a book to the Store"}), 400

    book = Book(
        title=title,
        author=data.get("author"),
        isbn=data.get("isbn"),
        category=data.get("category"),
        price=data.get("price") if location == "Store" else None,
        copies_available=data.get("copies_available", 1),
        description=data.get("description"),
        location=location,
        is_available_for_sale=(location == "Store"),
        is_available_for_lending=(location == "Library"),
        uploaded_by=get_jwt_identity(),
    )
    db.session.add(book)
    db.session.commit()
    return jsonify(book.to_dict()), 201

# -------------------------
# Update book (admin only)
# -------------------------
@bp.route("/<string:book_id>", methods=["PUT"])
@admin_required
def update_book(book_id):
    book = Book.query.filter_by(id=book_id).first()
    if not book:
        return jsonify({"msg": "Book not found"}), 404

    data = request.get_json() or {}
    for field in [
        "title", "author", "isbn", "category", "price", "copies_available",
        "description", "location", "is_available_for_sale", "is_available_for_lending"
    ]:
        if field in data:
            setattr(book, field, data[field])
    db.session.commit()
    return jsonify(book.to_dict()), 200

# -------------------------
# Delete book (admin only)
# -------------------------
@bp.route("/<string:book_id>", methods=["DELETE"])
@admin_required
def delete_book(book_id):
    book = Book.query.filter_by(id=book_id).first()
    if not book:
        return jsonify({"msg": "Book not found"}), 404

    from ..models import PurchaseCartItem, PurchaseCart, PendingRequest

    # Delete related cart items first
    cart_items = PurchaseCartItem.query.filter_by(book_id=book.id).all()
    if cart_items:
        print(f"DEBUG: Deleting cart items for book {book.id}: {[item.id for item in cart_items]}")
    for item in cart_items:
        db.session.delete(item)

    # Delete related pending requests
    pending_requests = PendingRequest.query.filter_by(book_id=book.id).all()
    if pending_requests:
        print(f"DEBUG: Deleting pending requests for book {book.id}: {[req.id for req in pending_requests]}")
    for req in pending_requests:
        db.session.delete(req)

    # Remove empty carts
    carts = PurchaseCart.query.all()
    for cart in carts:
        remaining_items = PurchaseCartItem.query.filter_by(cart_id=cart.id).count()
        if remaining_items == 0:
            print(f"DEBUG: Deleting empty cart {cart.id}")
            db.session.delete(cart)

    # Now delete the book
    print(f"DEBUG: Deleting book {book.id} - {book.title}")
    db.session.delete(book)
    db.session.commit()

    print(f"DEBUG: Deletion complete for book {book.id}")
    return jsonify({"msg": "Book, related cart items, pending requests, and empty carts deleted"}), 200
