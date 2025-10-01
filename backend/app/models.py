from datetime import datetime
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, decode_token
from .extensions import db
from .utils import gen_id


# ===========================
# USER MODEL
# ===========================
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    username = db.Column(db.String(255), unique=True, nullable=True)
    name = db.Column(db.String(120), nullable=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="customer")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    purchase_carts = db.relationship("PurchaseCart", back_populates="user", lazy="dynamic")
    lending_carts = db.relationship("LendingCart", back_populates="user", lazy="dynamic")
    orders = db.relationship("Order", back_populates="user", lazy="dynamic", foreign_keys="Order.user_id")
    approved_orders = db.relationship("Order", back_populates="approver", lazy="dynamic", foreign_keys="Order.approved_by")
    lending_requests = db.relationship("LendingRequest", back_populates="user", lazy="dynamic", foreign_keys="LendingRequest.user_id")
    approved_lendings = db.relationship("LendingRequest", back_populates="approver", lazy="dynamic", foreign_keys="LendingRequest.approved_by")
    payments = db.relationship("Payment", back_populates="user", lazy="dynamic")
    return_requests = db.relationship("ReturnRequest", back_populates="user", lazy="dynamic", foreign_keys="ReturnRequest.user_id")
    processed_returns = db.relationship("ReturnRequest", back_populates="processor", lazy="dynamic", foreign_keys="ReturnRequest.processed_by")

    # Password helpers
    def set_password(self, raw_password: str):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password_hash, raw_password)

    def generate_reset_token(self):
        return create_access_token(
            identity=self.id,
            additional_claims={"reset": True},
            expires_delta=current_app.config["RESET_TOKEN_EXPIRES"]
        )

    @staticmethod
    def verify_reset_token(token):
        try:
            data = decode_token(token)
            if data.get("claims", {}).get("reset"):
                return User.query.get(data["sub"])
        except Exception:
            return None
        return None

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<User {self.email}>"


# ===========================
# BOOK MODEL
# ===========================
class Book(db.Model):
    __tablename__ = "books"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255))
    genre = db.Column(db.String(100))
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=True)
    is_available_for_sale = db.Column(db.Boolean, default=True)
    is_available_for_lending = db.Column(db.Boolean, default=True)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    uploaded_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)

    # Relationships
    purchase_items = db.relationship("PurchaseCartItem", back_populates="book", lazy="dynamic")
    lending_items = db.relationship("LendingCartItem", back_populates="book", lazy="dynamic")
    order_items = db.relationship("OrderItem", back_populates="book", lazy="dynamic")
    lendings = db.relationship("LendingRequest", back_populates="book", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "genre": self.genre,
            "description": self.description,
            "price": float(self.price) if self.price is not None else None,
            "is_available_for_sale": self.is_available_for_sale,
            "is_available_for_lending": self.is_available_for_lending,
            "uploaded_at": self.uploaded_at.isoformat() if self.uploaded_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "uploaded_by": self.uploaded_by,
        }

    def __repr__(self):
        return f"<Book {self.title}>"


# ===========================
# PURCHASE CART + ITEMS
# ===========================
class PurchaseCart(db.Model):
    __tablename__ = "purchase_carts"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="purchase_carts")
    items = db.relationship("PurchaseCartItem", back_populates="cart", cascade="all, delete-orphan", lazy="dynamic")

    def __repr__(self):
        return f"<PurchaseCart {self.id}>"


class PurchaseCartItem(db.Model):
    __tablename__ = "purchase_cart_items"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    cart_id = db.Column(db.String(50), db.ForeignKey("purchase_carts.id"))
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"))
    quantity = db.Column(db.Integer, default=1)

    cart = db.relationship("PurchaseCart", back_populates="items")
    book = db.relationship("Book", back_populates="purchase_items")

    def __repr__(self):
        return f"<PurchaseCartItem {self.id}>"


# ===========================
# LENDING CART + ITEMS
# ===========================
class LendingCart(db.Model):
    __tablename__ = "lending_carts"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="lending_carts")
    items = db.relationship("LendingCartItem", back_populates="cart", cascade="all, delete-orphan", lazy="dynamic")

    def __repr__(self):
        return f"<LendingCart {self.id}>"


class LendingCartItem(db.Model):
    __tablename__ = "lending_cart_items"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    cart_id = db.Column(db.String(50), db.ForeignKey("lending_carts.id"))
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"))
    quantity = db.Column(db.Integer, default=1)

    cart = db.relationship("LendingCart", back_populates="items")
    book = db.relationship("Book", back_populates="lending_items")

    def __repr__(self):
        return f"<LendingCartItem {self.id}>"


# ===========================
# ORDERS + ITEMS
# ===========================
class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"))
    approved_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default="pending")

    user = db.relationship("User", back_populates="orders", foreign_keys=[user_id])
    approver = db.relationship("User", back_populates="approved_orders", foreign_keys=[approved_by])
    items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan", lazy="dynamic")

    def __repr__(self):
        return f"<Order {self.id}>"


class OrderItem(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    order_id = db.Column(db.String(50), db.ForeignKey("orders.id"))
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"))
    quantity = db.Column(db.Integer, default=1)

    order = db.relationship("Order", back_populates="items")
    book = db.relationship("Book", back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem {self.id}>"


# ===========================
# LENDING REQUESTS
# ===========================
class LendingRequest(db.Model):
    __tablename__ = "lending_requests"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"))
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"))
    approved_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default="pending")

    user = db.relationship("User", back_populates="lending_requests", foreign_keys=[user_id])
    approver = db.relationship("User", back_populates="approved_lendings", foreign_keys=[approved_by])
    book = db.relationship("Book", back_populates="lendings")

    def __repr__(self):
        return f"<LendingRequest {self.id}>"


# ===========================
# PAYMENTS
# ===========================
class Payment(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"))
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    method = db.Column(db.String(50))
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="payments")

    def __repr__(self):
        return f"<Payment {self.id} - {self.amount}>"


# ===========================
# RETURNS
# ===========================
class ReturnRequest(db.Model):
    __tablename__ = "return_requests"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"))
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"))
    processed_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default="pending")

    user = db.relationship("User", back_populates="return_requests", foreign_keys=[user_id])
    processor = db.relationship("User", back_populates="processed_returns", foreign_keys=[processed_by])
    book = db.relationship("Book")

    def __repr__(self):
        return f"<ReturnRequest {self.id}>"
