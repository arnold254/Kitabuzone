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
        """
        Generate a JWT reset token for the user and store it with expiration.
        """
        token = create_access_token(
            identity=self.id,
            additional_claims={"reset": True},
            expires_delta=current_app.config["RESET_TOKEN_EXPIRES"]
        )
        self.reset_token = token
        self.reset_token_expiration = int(datetime.utcnow().timestamp()) + \
            current_app.config["RESET_TOKEN_EXPIRES"].total_seconds()
        db.session.commit()
        print("Generated reset token:", token)  # <-- debug
        return token

    @staticmethod
    def verify_reset_token(token):
        """
        Verify JWT reset token and return the corresponding User.
        Returns None if token is invalid or expired.
        """
        try:
            data = decode_token(token)
            print("Decoded token:", data)  # <-- debug
            user_id = data.get("sub")
            if not data.get("reset") or not user_id:
                print("Token missing reset claim or user id")  # <-- debug
                return None
            user = User.query.get(user_id)
            if not user:
                print("User not found for token")  # <-- debug
                return None
            if user.reset_token != token:
                print("Token does not match user's stored reset token")  # <-- debug
                return None
            if user.reset_token_expiration < int(datetime.utcnow().timestamp()):
                print("Token expired")  # <-- debug
                return None
            print("Token verification successful for user:", user.email)  # <-- debug
            return user
        except Exception as e:
            print("Token verification error:", e)
            return None

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
    
    # ✅ Cascade delete for pending requests
    pending_requests = db.relationship(
        "PendingRequest",
        back_populates="book",
        cascade="all, delete-orphan",
        lazy="dynamic"
    )

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
            "cover": self.cover or f"https://via.placeholder.com/150?text={self.title.replace(' ', '+')}"
        }


# -------------------- PENDING REQUESTS --------------------
class PendingRequest(db.Model):
    __tablename__ = "pending_requests"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.String(50),
        db.ForeignKey(
            "users.id",
            name="fk_pending_requests_user_id",   # ✅ explicit name
            ondelete="CASCADE"
        ),
        nullable=False
    )

    book_id = db.Column(
        db.String(50),
        db.ForeignKey(
            "books.id",
            name="fk_pending_requests_book_id",   # ✅ explicit name
            ondelete="CASCADE"
        ),
        nullable=False
    )

    action = db.Column(db.String(50), default="purchase")
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="pending_requests")
    book = db.relationship("Book", back_populates="pending_requests")

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
    checked_out = db.Column(db.Boolean, default=False)
    source = db.Column(db.String(20), default="store")
    
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


