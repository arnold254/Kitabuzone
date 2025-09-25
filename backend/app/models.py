from datetime import datetime
from uuid import uuid4
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, decode_token
from flask import current_app
from .extensions import db

def gen_id():
    return str(uuid4())

# ----------------- Users -----------------
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    username = db.Column(db.String(255), unique=True, nullable=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="customer")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    purchase_carts = db.relationship("PurchaseCart", backref=db.backref("user_backref"), lazy="dynamic")
    lending_carts = db.relationship("LendingCart", backref=db.backref("user_backref"), lazy="dynamic")
    orders = db.relationship("Order", backref=db.backref("user_backref"), lazy="dynamic", foreign_keys="[Order.user_id]")
    lending_requests = db.relationship("LendingRequest", backref=db.backref("user_backref"), lazy="dynamic", foreign_keys="[LendingRequest.user_id]")
    approved_orders = db.relationship("Order", backref=db.backref("approved_user_backref"), foreign_keys="[Order.approved_by]", lazy="dynamic")
    approved_lending_requests = db.relationship("LendingRequest", backref=db.backref("approved_user_backref"), foreign_keys="[LendingRequest.approved_by]", lazy="dynamic")
    payments = db.relationship("Payment", backref=db.backref("user_backref"), lazy="dynamic", foreign_keys="[Payment.user_id]")
    returns = db.relationship("ReturnRequest", backref=db.backref("user_backref"), lazy="dynamic", foreign_keys="[ReturnRequest.user_id]")

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

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# ----------------- Books -----------------
class Book(db.Model):
    __tablename__ = "books"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=True)
    genre = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=True)
    is_available = db.Column(db.Enum("available","unavailable", name="book_availability"), default="available")
    is_library_copy = db.Column(db.Boolean, default=True)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    uploaded_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)

    # Relationships
    purchase_items = db.relationship("PurchaseCartItem", backref=db.backref("book_backref"), lazy="dynamic")
    lending_items = db.relationship("LendingCartItem", backref=db.backref("book_backref"), lazy="dynamic")
    order_items = db.relationship("OrderItem", backref=db.backref("book_backref"), lazy="dynamic")
    lendings = db.relationship("LendingRequest", backref=db.backref("book_backref"), lazy="dynamic")
    returns = db.relationship("ReturnRequest", backref=db.backref("book_backref"), lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "genre": self.genre,
            "description": self.description,
            "price": float(self.price) if self.price else None,
            "is_available": self.is_available,
            "is_library_copy": self.is_library_copy,
            "uploaded_at": self.uploaded_at.isoformat() if self.uploaded_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "uploaded_by": self.uploaded_by
        }

# ----------------- Purchase Cart & Items -----------------
class PurchaseCart(db.Model):
    __tablename__ = "purchase_carts"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    checked_out = db.Column(db.Boolean, default=False)

    items = db.relationship("PurchaseCartItem", backref=db.backref("cart_backref"), lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "checked_out": self.checked_out,
            "items": [item.to_dict() for item in self.items]
        }

class PurchaseCartItem(db.Model):
    __tablename__ = "purchase_cart_items"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    cart_id = db.Column(db.String(50), db.ForeignKey("purchase_carts.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "cart_id": self.cart_id,
            "book_id": self.book_id,
            "quantity": self.quantity
        }

# ----------------- Lending Cart & Items -----------------
class LendingCart(db.Model):
    __tablename__ = "lending_carts"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    checked_out = db.Column(db.Boolean, default=False)

    items = db.relationship("LendingCartItem", backref=db.backref("cart_backref"), lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "checked_out": self.checked_out,
            "items": [item.to_dict() for item in self.items]
        }

class LendingCartItem(db.Model):
    __tablename__ = "lending_cart_items"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    cart_id = db.Column(db.String(50), db.ForeignKey("lending_carts.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "cart_id": self.cart_id,
            "book_id": self.book_id,
            "quantity": self.quantity
        }

# ----------------- Orders & Order Items -----------------
class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    cart_id = db.Column(db.String(50), db.ForeignKey("purchase_carts.id"), nullable=False)
    status = db.Column(db.String(50), default="pending")
    total_amount = db.Column(db.Numeric(10,2), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)
    paid_at = db.Column(db.DateTime, nullable=True)

    items = db.relationship("OrderItem", backref=db.backref("order_backref"), lazy="dynamic", cascade="all, delete-orphan")
    payments = db.relationship("Payment", backref=db.backref("order_backref"), lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self):
        data = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        # Convert datetime fields
        for key in ["created_at", "approved_at", "paid_at"]:
            if data.get(key):
                data[key] = data[key].isoformat()
        data["items"] = [item.to_dict() for item in self.items]
        data["payments"] = [p.to_dict() for p in self.payments]
        return data

class OrderItem(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    order_id = db.Column(db.String(50), db.ForeignKey("orders.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "book_id": self.book_id,
            "quantity": self.quantity
        }

# ----------------- Lending Requests -----------------
class LendingRequest(db.Model):
    __tablename__ = "lending_requests"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    cart_id = db.Column(db.String(50), db.ForeignKey("lending_carts.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    returned_at = db.Column(db.DateTime, nullable=True)

    return_requests = db.relationship("ReturnRequest", backref=db.backref("lending_request_backref"), lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self):
        data = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        for key in ["created_at", "approved_at", "due_date", "returned_at"]:
            if data.get(key):
                data[key] = data[key].isoformat()
        data["return_requests"] = [r.to_dict() for r in self.return_requests]
        return data

# ----------------- Payments -----------------
class Payment(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    order_id = db.Column(db.String(50), db.ForeignKey("orders.id"), nullable=False)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    amount = db.Column(db.Numeric(10,2), nullable=False)
    payment_method = db.Column(db.String(50), nullable=True)
    paid_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        data = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        if data.get("paid_at"):
            data["paid_at"] = data["paid_at"].isoformat()
        return data

# ----------------- Returns -----------------
class ReturnRequest(db.Model):
    __tablename__ = "returns"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    lending_request_id = db.Column(db.String(50), db.ForeignKey("lending_requests.id"), nullable=False)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), default="pending")
    processed_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)

    def to_dict(self):
        data = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        for key in ["requested_at", "processed_at"]:
            if data.get(key):
                data[key] = data[key].isoformat()
        return data
