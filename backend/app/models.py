# Models map to your diagram. Comments explain fields & relationships.
from datetime import datetime
from uuid import uuid4
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, decode_token
from flask import current_app
from .extensions import db

def gen_id():
    return str(uuid4())

# ---------- Users ----------
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    username = db.Column(db.String(255))
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="customer")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    purchase_carts = db.relationship("PurchaseCart", back_populates="user", lazy="dynamic")
    lending_carts = db.relationship("LendingCart", back_populates="user", lazy="dynamic")
    orders = db.relationship("Order", back_populates="user", lazy="dynamic",
                             foreign_keys="Order.user_id")
    approved_orders = db.relationship("Order", back_populates="approver", lazy="dynamic",
                                      foreign_keys="Order.approved_by")
    lending_requests = db.relationship("LendingRequest", back_populates="user", lazy="dynamic",
                                       foreign_keys="LendingRequest.user_id")
    approved_lendings = db.relationship("LendingRequest", back_populates="approver", lazy="dynamic",
                                        foreign_keys="LendingRequest.approved_by")
    payments = db.relationship("Payment", back_populates="user", lazy="dynamic")
    return_requests = db.relationship("ReturnRequest", back_populates="user", lazy="dynamic",
                                      foreign_keys="ReturnRequest.user_id")
    processed_returns = db.relationship("ReturnRequest", back_populates="processor", lazy="dynamic",
                                        foreign_keys="ReturnRequest.processed_by")

    # Password helpers
    def set_password(self, raw_password: str):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password_hash, raw_password)

    def generate_reset_token(self):
        return create_access_token(
            identity=str(self.id),
            additional_claims={"reset": True},
            expires_delta=current_app.config["RESET_TOKEN_EXPIRES"]
        )

    @staticmethod
    def verify_reset_token(token):
        try:
            data = decode_token(token)
            if data.get("claims", {}).get("reset"):
                user_id = data["sub"]
                return User.query.get(user_id)
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
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<User {self.email}>"


# ---------- Books ----------
class Book(db.Model):
    __tablename__ = "books"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255))
    genre = db.Column(db.String(100))
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=True)
    is_available_for_sale = db.Column(db.Boolean, default=True)
    is_available_for_lending = db.Column(db.Boolean, default=True)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    uploaded_by = db.Column(db.String, db.ForeignKey("users.id"), nullable=True)

    purchase_items = db.relationship("PurchaseCartItem", back_populates="book", lazy="dynamic")
    lending_items = db.relationship("LendingCartItem", back_populates="book", lazy="dynamic")
    order_items = db.relationship("OrderItem", back_populates="book", lazy="dynamic")
    lendings = db.relationship("LendingRequest", back_populates="book", lazy="dynamic")

    def __repr__(self):
        return f"<Book {self.title}>"

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

# ---------- Purchase Cart ----------
class PurchaseCart(db.Model):
    __tablename__ = "purchase_carts"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    checked_out = db.Column(db.Boolean, default=False)

    user = db.relationship("User", back_populates="purchase_carts", foreign_keys=[user_id])
    items = db.relationship("PurchaseCartItem", back_populates="cart", lazy="dynamic")


class PurchaseCartItem(db.Model):
    __tablename__ = "purchase_cart_items"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    cart_id = db.Column(db.String, db.ForeignKey("purchase_carts.id"), nullable=False)
    book_id = db.Column(db.String, db.ForeignKey("books.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)

    cart = db.relationship("PurchaseCart", back_populates="items", foreign_keys=[cart_id])
    book = db.relationship("Book", back_populates="purchase_items", foreign_keys=[book_id])


# ---------- Lending Cart ----------
class LendingCart(db.Model):
    __tablename__ = "lending_carts"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    checked_out = db.Column(db.Boolean, default=False)

    user = db.relationship("User", back_populates="lending_carts", foreign_keys=[user_id])
    items = db.relationship("LendingCartItem", back_populates="cart", lazy="dynamic")


class LendingCartItem(db.Model):
    __tablename__ = "lending_cart_items"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    cart_id = db.Column(db.String, db.ForeignKey("lending_carts.id"), nullable=False)
    book_id = db.Column(db.String, db.ForeignKey("books.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)

    cart = db.relationship("LendingCart", back_populates="items", foreign_keys=[cart_id])
    book = db.relationship("Book", back_populates="lending_items", foreign_keys=[book_id])


# ---------- Orders ----------
class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    cart_id = db.Column(db.String, db.ForeignKey("purchase_carts.id"), nullable=False)
    status = db.Column(db.String(50), default="pending")
    total_amount = db.Column(db.Numeric(10,2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_by = db.Column(db.String, db.ForeignKey("users.id"), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)
    paid_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship("User", back_populates="orders", foreign_keys=[user_id])
    approver = db.relationship("User", back_populates="approved_orders", foreign_keys=[approved_by])
    items = db.relationship("OrderItem", back_populates="order", lazy="dynamic")
    payments = db.relationship("Payment", back_populates="order", lazy="dynamic")


class OrderItem(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    order_id = db.Column(db.String, db.ForeignKey("orders.id"), nullable=False)
    book_id = db.Column(db.String, db.ForeignKey("books.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1)

    order = db.relationship("Order", back_populates="items", foreign_keys=[order_id])
    book = db.relationship("Book", back_populates="order_items", foreign_keys=[book_id])


# ---------- Lending Requests ----------
class LendingRequest(db.Model):
    __tablename__ = "lending_requests"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    cart_id = db.Column(db.String, db.ForeignKey("lending_carts.id"), nullable=False)
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_by = db.Column(db.String, db.ForeignKey("users.id"), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    returned_at = db.Column(db.DateTime, nullable=True)
    book_id = db.Column(db.String, db.ForeignKey("books.id"), nullable=False)
    book = db.relationship("Book", back_populates="lendings")

    user = db.relationship("User", back_populates="lending_requests", foreign_keys=[user_id])
    approver = db.relationship("User", back_populates="approved_lendings", foreign_keys=[approved_by])


# ---------- Payments ----------
class Payment(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    order_id = db.Column(db.String, db.ForeignKey("orders.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    amount = db.Column(db.Numeric(10,2), nullable=False)
    payment_method = db.Column(db.String(50))
    paid_at = db.Column(db.DateTime, nullable=True)

    order = db.relationship("Order", back_populates="payments", foreign_keys=[order_id])
    user = db.relationship("User", back_populates="payments", foreign_keys=[user_id])


# ---------- Returns ----------
class ReturnRequest(db.Model):
    __tablename__ = "returns"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    lending_request_id = db.Column(db.String, db.ForeignKey("lending_requests.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.String, db.ForeignKey("books.id"), nullable=False)
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), default="pending")
    processed_by = db.Column(db.String, db.ForeignKey("users.id"), nullable=True)

    user = db.relationship("User", back_populates="return_requests", foreign_keys=[user_id])
    processor = db.relationship("User", back_populates="processed_returns", foreign_keys=[processed_by])

    def __repr__(self):
        return f"<Return {self.id} - {self.status}>"
