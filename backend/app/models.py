# Models map to your diagram. Comments explain fields & relationships.
from datetime import datetime
from uuid import uuid4
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, decode_token
from flask import current_app
from .extensions import db

def gen_id():
    return str(uuid4())

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String, primary_key=True, default=gen_id)  # uuid string
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="customer")  # e.g., admin, customer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    orders = db.relationship("Order", back_populates="user", lazy="dynamic")
    lendings = db.relationship("Lending", back_populates="user", lazy="dynamic")

    def set_password(self, raw_password: str):
        """Hash and set the user's password."""
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        """Return True if the password matches."""
        return check_password_hash(self.password_hash, raw_password)

    def generate_reset_token(self):
        """Generate a JWT reset token using user id"""
        return create_access_token(
            identity=str(self.id),
            additional_claims={"reset": True},
            expires_delta=current_app.config["RESET_TOKEN_EXPIRES"]
        )

    @staticmethod
    def verify_reset_token(token):
        """Verify the JWT reset token and return the user if valid."""
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
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "cerated_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<User {self.email}>"

class Book(db.Model):
    __tablename__ = "books"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255))
    genre = db.Column(db.String(100))
    price = db.Column(db.Numeric(10, 2), nullable=True)  # price for sale
    is_available_for_sale = db.Column(db.Boolean, default=True)
    is_available_for_lending = db.Column(db.Boolean, default=True)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "genre": self.genre,
            "price": str(self.price) if self.price is not None else None,
            "is_available_for_sale": self.is_available_for_sale,
            "is_available_for_lending": self.is_available_for_lending,
            "uploaded_at": self.uploaded_at.isoformat(),
        }

    # relations
    order_items = db.relationship("OrderItem", back_populates="book", lazy="dynamic")
    lendings = db.relationship("Lending", back_populates="book", lazy="dynamic")

    def __repr__(self):
        return f"<Book {self.title}>"

class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(50), default="pending")  # pending, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="orders")
    items = db.relationship("OrderItem", back_populates="order", lazy="dynamic")
    payments = db.relationship("Payment", back_populates="order", lazy="dynamic")

    def __repr__(self):
        return f"<Order {self.id} - {self.status}>"

class OrderItem(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    book_id = db.Column(db.String, db.ForeignKey("books.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    order_id = db.Column(db.String, db.ForeignKey("orders.id"), nullable=False)

    book = db.relationship("Book", back_populates="order_items")
    order = db.relationship("Order", back_populates="items")

    def __repr__(self):
        return f"<OrderItem {self.id} - book {self.book_id}>"

class Payment(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    order_id = db.Column(db.String, db.ForeignKey("orders.id"), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), default="pending")  # pending, succeeded, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    order = db.relationship("Order", back_populates="payments")

    def __repr__(self):
        return f"<Payment {self.id} - {self.status}>"

class Lending(db.Model):
    __tablename__ = "lendings"
    id = db.Column(db.String, primary_key=True, default=gen_id)
    status = db.Column(db.String(50), default="borrowed")  # borrowed, returned, overdue
    borrowed_at = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)
    returned_at = db.Column(db.DateTime, nullable=True)
    book_id = db.Column(db.String, db.ForeignKey("books.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)

    book = db.relationship("Book", back_populates="lendings")
    user = db.relationship("User", back_populates="lendings")

    def __repr__(self):
        return f"<Lending {self.id} - {self.status}>"
