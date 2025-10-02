from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User, Book, ActivityLog, PendingRequest, LendingRequest, Lending, Order, OrderItem, Payment
from sqlalchemy import func
from datetime import datetime, timedelta
from functools import wraps

bp = Blueprint("admin", __name__, url_prefix="/admin")


# ✅ Admin-only decorator
def admin_required(f):
    @wraps(f)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != "admin":
            return jsonify({"msg": "Admin access required"}), 403
        return f(*args, **kwargs)
    return wrapper


@bp.route("/dashboard", methods=["GET"])
@admin_required
def dashboard():
    total_books = Book.query.count()
    total_users = User.query.count()
    borrowed_books = Lending.query.filter_by(status="borrowed").count()
    total_sales = db.session.query(func.sum(Payment.amount)).filter(
        Payment.status == "completed",
        Payment.created_at >= datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    ).scalar() or 0

    return jsonify({
        "total_books": total_books,
        "total_users": total_users,
        "borrowed_books": borrowed_books,
        "sales": f"${total_sales:.2f}"
    }), 200


@bp.route("/users", methods=["GET"])
@admin_required
def get_users():
    search_term = request.args.get("search", "")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))

    query = User.query.filter(
        (User.name.ilike(f"%{search_term}%")) | (User.email.ilike(f"%{search_term}%"))
    )
    paginated_users = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "users": [{
            "id": user.id,
            "name": user.name or user.email,
            "email": user.email,
            "role": user.role,  # ✅ added role
            "borrowed_count": user.lendings.filter_by(status="borrowed").count(),
            "status": "Active" if user.lendings.filter_by(status="borrowed").count() > 0 else "Inactive"
        } for user in paginated_users.items],
        "total": paginated_users.total,
        "pages": paginated_users.pages,
        "page": page
    }), 200


@bp.route("/users/<user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"}), 200

@bp.route("/users", methods=["POST"])
@admin_required
def create_user():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "customer")  # default role = customer

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # check if email exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # create user
    new_user = User(
        name=name,
        email=email,
        role=role
    )
    new_user.set_password(password)  # assuming you have set_password for hashing

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "status": "Inactive"
        }
    }), 201


@bp.route("/books", methods=["GET"])
@admin_required
def get_books():
    search_term = request.args.get("search", "")
    books = Book.query.filter(
        (Book.title.ilike(f"%{search_term}%")) | (Book.author.ilike(f"%{search_term}%"))
    ).all()
    return jsonify([{
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "category": book.category,
        "description": book.description,
        "is_available_for_sale": book.is_available_for_sale,
        "is_available_for_lending": book.is_available_for_lending,
        "status": "Available" if book.copies_available > 0 else "Unavailable",
        "location": "Store" if book.price else "Library",
        "price": f"${book.price:.2f}" if book.price else None
    } for book in books]), 200


@bp.route("/books", methods=["POST"])
@admin_required
def add_book():
    data = request.get_json() or {}
    required_fields = ["title", "author", "category", "location"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Missing required fields"}), 400
    if data["location"] == "Store" and "price" not in data:
        return jsonify({"msg": "Price required for Store books"}), 400

    book = Book(
        title=data["title"],
        author=data["author"],
        category=data["category"],
        price=float(data["price"]) if data.get("price") else None,
        isbn=data.get("isbn"),
        copies_available=1,
        description=data.get("description"),
        is_available_for_sale=data["location"] == "Store",
        is_available_for_lending=data["location"] == "Library",
        uploaded_by=get_jwt_identity()
    )
    db.session.add(book)
    db.session.commit()
    return jsonify({"msg": "Book added", "book": {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "category": book.category,
        "description": book.description,
        "is_available_for_sale": book.is_available_for_sale,
        "is_available_for_lending": book.is_available_for_lending,
        "status": "Available",
        "location": data["location"],
        "price": f"${book.price:.2f}" if book.price else None
    }}), 201


@bp.route("/books/<book_id>", methods=["DELETE"])
@admin_required
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"msg": "Book not found"}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({"msg": "Book deleted"}), 200


@bp.route("/activity-logs", methods=["GET"])
@admin_required
def get_activity_logs():
    action_filter = request.args.get("action", "All")
    date_filter = request.args.get("date", "")
    query = ActivityLog.query
    if action_filter != "All":
        query = query.filter_by(action=action_filter)
    if date_filter:
        try:
            date = datetime.strptime(date_filter, "%Y-%m-%d")
            query = query.filter(db.func.date(ActivityLog.created_at) == date)
        except ValueError:
            return jsonify({"msg": "Invalid date format"}), 400
    logs = query.all()
    return jsonify([log.to_dict() for log in logs]), 200


@bp.route("/pending-requests", methods=["GET"])
@admin_required
def get_pending_requests():
    requests = PendingRequest.query.all()
    return jsonify([req.to_dict() for req in requests]), 200


@bp.route("/pending-requests/<request_id>", methods=["POST"])
@admin_required
def handle_pending_request(request_id):
    data = request.get_json() or {}
    action = data.get("action")
    if action not in ["approve", "decline"]:
        return jsonify({"msg": "Invalid action"}), 400

    req = PendingRequest.query.get(request_id)
    if not req:
        return jsonify({"msg": "Request not found"}), 404

    if action == "approve":
        if req.request_type == "Borrow":
            lending_request = LendingRequest(
                user_id=req.user_id,
                book_id=req.book_id,
                cart_id=req.id,  # Placeholder
                status="Approved",
                approved_by=get_jwt_identity(),
                approved_at=datetime.utcnow(),
                due_date=datetime.utcnow() + timedelta(days=14)
            )
            lending = Lending(
                user_id=req.user_id,
                book_id=req.book_id,
                status="borrowed",
                borrowed_at=datetime.utcnow(),
                due_date=datetime.utcnow() + timedelta(days=14)
            )
            book = Book.query.get(req.book_id)
            if book and book.copies_available > 0 and book.is_available_for_lending:
                book.copies_available -= 1
            else:
                return jsonify({"msg": "Book not available for lending"}), 400
            db.session.add(lending_request)
            db.session.add(lending)
        elif req.request_type == "Purchase":
            order = Order(
                user_id=req.user_id,
                cart_id=req.id,  # Placeholder
                status="Approved",
                approved_by=get_jwt_identity(),
                total_amount=Book.query.get(req.book_id).price,
                approved_at=datetime.utcnow(),
                paid_at=datetime.utcnow()
            )
            order_item = OrderItem(
                order=order,
                book_id=req.book_id,
                quantity=1
            )
            book = Book.query.get(req.book_id)
            if book and book.copies_available > 0 and book.is_available_for_sale:
                book.copies_available -= 1
            else:
                return jsonify({"msg": "Book not available for purchase"}), 400
            db.session.add(order)
            db.session.add(order_item)
        db.session.add(ActivityLog(
            user_id=req.user_id,
            action=req.request_type,
            item=req.book.title
        ))
    db.session.delete(req)
    db.session.commit()
    return jsonify({"msg": f"Request {action}d"}), 200


@bp.route("/borrowing-report", methods=["GET"])
@admin_required
def borrowing_report():
    month_filter = request.args.get("month", "All")
    query = db.session.query(
        db.func.strftime("%b", Lending.borrowed_at).label("month"),
        db.func.count().label("borrowings")
    ).filter(Lending.status == "borrowed").group_by(db.func.strftime("%b", Lending.borrowed_at))
    if month_filter != "All":
        query = query.filter(db.func.strftime("%b", Lending.borrowed_at) == month_filter)
    data = [{"month": row.month, "borrowings": row.borrowings} for row in query.all()]
    return jsonify(data), 200


@bp.route("/sales-report", methods=["GET"])
@admin_required
def sales_report():
    month_filter = request.args.get("month", "All")
    query = db.session.query(
        db.func.strftime("%b", Order.created_at).label("month"),
        db.func.count().label("sales")
    ).filter(Order.status == "Approved").group_by(db.func.strftime("%b", Order.created_at))
    if month_filter != "All":
        query = query.filter(db.func.strftime("%b", Order.created_at) == month_filter)
    data = [{"month": row.month, "sales": row.sales} for row in query.all()]
    return jsonify(data), 200
