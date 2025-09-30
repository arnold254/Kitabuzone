from datetime import datetime
import uuid
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, decode_token
from .extensions import db

def gen_id():
    return str(uuid.uuid4())

# -------------------- USER --------------------
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    username = db.Column(db.String(255), unique=True, nullable=True)
    name = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="customer")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reset_token = db.Column(db.String(255), nullable=True)
    reset_token_expiration = db.Column(db.BigInteger, nullable=True)

    # Relationships
    purchase_carts = db.relationship("PurchaseCart", backref="user", lazy="dynamic")
    lending_carts = db.relationship("LendingCart", backref="user", lazy="dynamic")
    orders = db.relationship("Order", back_populates="user", foreign_keys="[Order.user_id]", lazy="dynamic")
    approved_orders = db.relationship("Order", back_populates="approved_user", foreign_keys="[Order.approved_by]", lazy="dynamic")
    lending_requests = db.relationship("LendingRequest", back_populates="user", foreign_keys="[LendingRequest.user_id]", lazy="dynamic")
    approved_lending_requests = db.relationship("LendingRequest", back_populates="approved_user", foreign_keys="[LendingRequest.approved_by]", lazy="dynamic")
    lendings = db.relationship("Lending", back_populates="user", lazy="dynamic")
    payments = db.relationship("Payment", backref="user", lazy="dynamic")
    activity_logs = db.relationship("ActivityLog", backref="user", lazy="dynamic")
    pending_requests = db.relationship("PendingRequest", back_populates="user", lazy="dynamic")
    return_requests = db.relationship("ReturnRequest", back_populates="user", foreign_keys="[ReturnRequest.user_id]", lazy="dynamic")
    processed_returns = db.relationship("ReturnRequest", back_populates="processed_by_user", foreign_keys="[ReturnRequest.processed_by]", lazy="dynamic")

    # -------------------- Password methods --------------------
    def set_password(self, raw_password: str):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password_hash, raw_password)

    # -------------------- Reset token methods --------------------
    def generate_reset_token(self):
        self.reset_token = create_access_token(
            identity=self.id,
            additional_claims={"reset": True},
            expires_delta=current_app.config["RESET_TOKEN_EXPIRES"]
        )
        self.reset_token_expiration = int(datetime.utcnow().timestamp()) + current_app.config["RESET_TOKEN_EXPIRES"].total_seconds()
        return self.reset_token

    @staticmethod
    def verify_reset_token(token):
        user = User.query.filter_by(reset_token=token).first()
        if user and user.reset_token_expiration > int(datetime.utcnow().timestamp()):
            return user
        try:
            data = decode_token(token)
            if data.get("claims", {}).get("reset"):
                return User.query.get(data["sub"])
        except Exception:
            return None
        return None

    def clear_reset_token(self):
        self.reset_token = None
        self.reset_token_expiration = None

    # -------------------- Serialization --------------------
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# -------------------- BOOK --------------------
class Book(db.Model):
    __tablename__ = "books"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    isbn = db.Column(db.String(20), unique=True, nullable=True)
    category = db.Column(db.String(100), nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=True)
    copies_available = db.Column(db.Integer, default=1)
    location = db.Column(db.String(50), default="Library")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text, nullable=True)
    is_available_for_sale = db.Column(db.Boolean, default=True)
    is_available_for_lending = db.Column(db.Boolean, default=True)
    uploaded_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow, nullable=True)
    cover = db.Column(db.String(255)) 

    # Relationships
    purchase_items = db.relationship("PurchaseCartItem", backref="book", lazy="dynamic")
    lending_items = db.relationship("LendingCartItem", backref="book", lazy="dynamic")
    order_items = db.relationship("OrderItem", backref="book", lazy="dynamic")
    lendings = db.relationship("Lending", back_populates="book", lazy="dynamic")
    lending_requests = db.relationship("LendingRequest", back_populates="book", lazy="dynamic")
    return_requests = db.relationship("ReturnRequest", back_populates="book", lazy="dynamic")
    pending_requests = db.relationship("PendingRequest", back_populates="book", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "isbn": self.isbn,
            "category": self.category,
            "price": float(self.price) if self.price else None,
            "copies_available": self.copies_available,
            "location": self.location,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "description": self.description,
            "is_available_for_sale": self.is_available_for_sale,
            "is_available_for_lending": self.is_available_for_lending,
            "uploaded_by": self.uploaded_by,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "cover": self.cover or f"https://via.placeholder.com/150?text={self.title.replace(' ', '+')}"  # ✅ fallback
            }

# -------------------- PENDING REQUESTS --------------------
class PendingRequest(db.Model):
    __tablename__ = "pending_requests"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("books.id"), nullable=False)
    action = db.Column(db.String(50), default="purchase")  # "purchase" or "lend"
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="pending_requests")
    book = db.relationship("Book", back_populates="pending_requests")

    def is_purchase(self):
        return self.action.lower() == "purchase"

    def is_lend(self):
        return self.action.lower() == "lend"

# -------------------- ORDERS --------------------
class PurchaseCart(db.Model):
    __tablename__ = "purchase_carts"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship("PurchaseCartItem", backref="cart", lazy="dynamic")

class PurchaseCartItem(db.Model):
    __tablename__ = "purchase_cart_items"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    cart_id = db.Column(db.String(50), db.ForeignKey("purchase_carts.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)

class LendingCart(db.Model):
    __tablename__ = "lending_carts"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship("LendingCartItem", backref="cart", lazy="dynamic")

class LendingCartItem(db.Model):
    __tablename__ = "lending_cart_items"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    cart_id = db.Column(db.String(50), db.ForeignKey("lending_carts.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)

class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    cart_id = db.Column(db.String(50), db.ForeignKey("purchase_carts.id"), nullable=True)
    status = db.Column(db.String(50), default="pending")
    total_amount = db.Column(db.Numeric(10, 2), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)
    paid_at = db.Column(db.DateTime, nullable=True)

    items = db.relationship("OrderItem", backref="order", lazy="dynamic")
    user = db.relationship("User", back_populates="orders", foreign_keys=[user_id])
    approved_user = db.relationship("User", back_populates="approved_orders", foreign_keys=[approved_by])

class OrderItem(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    order_id = db.Column(db.String(50), db.ForeignKey("orders.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1)

# -------------------- LENDING REQUESTS --------------------
class LendingRequest(db.Model):
    __tablename__ = "lending_requests"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    cart_id = db.Column(db.String(50), db.ForeignKey("lending_carts.id"), nullable=True)
    status = db.Column(db.String(50), default="pending")
    approved_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_at = db.Column(db.DateTime, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    returned_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship("User", back_populates="lending_requests", foreign_keys=[user_id])
    approved_user = db.relationship("User", back_populates="approved_lending_requests", foreign_keys=[approved_by])
    book = db.relationship("Book", back_populates="lending_requests")

# -------------------- LENDING --------------------
class Lending(db.Model):
    __tablename__ = "lendings"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    status = db.Column(db.String(50), default="borrowed")
    borrowed_at = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, nullable=True)
    returned_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship("User", back_populates="lendings")
    book = db.relationship("Book", back_populates="lendings")

# -------------------- PAYMENT --------------------
class Payment(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# -------------------- LOGS --------------------
class ActivityLog(db.Model):
    __tablename__ = "activity_logs"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    item = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text, nullable=True)

# -------------------- RETURN REQUESTS --------------------
class ReturnRequest(db.Model):
    __tablename__ = "return_requests"
    id = db.Column(db.String(50), primary_key=True, default=gen_id)
    user_id = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.String(50), db.ForeignKey("books.id"), nullable=False)
    lending_request_id = db.Column(db.String(50), db.ForeignKey("lending_requests.id"), nullable=True)
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_by = db.Column(db.String(50), db.ForeignKey("users.id"), nullable=True)

    user = db.relationship("User", back_populates="return_requests", foreign_keys=[user_id])
    processed_by_user = db.relationship("User", back_populates="processed_returns", foreign_keys=[processed_by])
    book = db.relationship("Book", back_populates="return_requests")


