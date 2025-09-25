from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ..extensions import db
from ..models import Book
from functools import wraps

bp = Blueprint("books", __name__)

#simple decorator to restrict routes to admin users only
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"msg": "Admin priviledges required!"}), 403
        return fn(*args, **kwargs)
    return wrapper

@bp.route("/", methods=["GET"])
def list_books():

    #simple list; in a real app, implement pagination
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books]), 200

@bp.route("/<string:book_id>", methods=["GET"])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict()), 200

@bp.route("/", methods=["POST"])
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
        price=data.get("price"),
        is_available_for_sale=data.get("is_available_for_sale", True),
        is_available_for_lending=data.get("is_available_for_lending", True),
    )
    db.session.add(book)
    db.session.commit()
    return jsonify(book.to_dict()), 201

@bp.route("/<string:book_id>", methods=["PUT"])
@admin_required
def update_book(book_id):
    book = Book.query.get_or_404(book_id)
    data = request.get_json() or {}

    #update allowed fields
    for field in ["title", "author", "genre", "price", "is_available_for_sale", "is_available_for_lending"]:
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