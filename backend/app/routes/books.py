from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from ..extensions import db
from ..models import Book
from functools import wraps

bp = Blueprint("books", __name__)

# Simple decorator to restrict routes to admin users only
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"msg": "Admin privileges required!"}), 403
        return fn(*args, **kwargs)
    return wrapper


@bp.route("/", methods=["GET"])
def list_books():
    # simple list; in a real app, implement pagination
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books]), 200


@bp.route("/<string:book_id>", methods=["GET"])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict()), 200


@bp.route("/books", methods=["POST"])
@admin_required
def create_book():
    data = request.get_json() or {}
    title = data.get("title")
    if not title:
        return jsonify({"msg": "title is required"}), 400

    book = Book(
        title=title,
        author=data.get("author"),
        genre=data.get("genre"),
        description=data.get("description"),
        price=data.get("price"),
        is_available=data.get("is_available", "available"),  # ✅ match model
        is_library_copy=data.get("is_library_copy", True),
        uploaded_by=get_jwt_identity()  # track who uploaded
    )
    db.session.add(book)
    db.session.commit()
    return jsonify(book.to_dict()), 201


@bp.route("/<string:book_id>", methods=["PUT"])
@admin_required
def update_book(book_id):
    book = Book.query.get_or_404(book_id)
    data = request.get_json() or {}

    # update allowed fields
    for field in ["title", "author", "genre", "description", "price", "is_available", "is_library_copy"]:
        if field in data:
            setattr(book, field, data[field])

    db.session.commit()
    return jsonify(book.to_dict()), 200


@bp.route("/<string:book_id>", methods=["DELETE"])
@admin_required
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"msg": "book deleted"}), 200
