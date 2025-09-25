from app import create_app
from app.extensions import db
from app.models import User, Book
from werkzeug.security import generate_password_hash

app = create_app()

def seed_database():
    with app.app_context():
        # Clear tables first (optional)
        db.session.query(User).delete()
        db.session.query(Book).delete()
        db.session.commit()

        # Create Users
        users = [
            User(
                username="fatuma",
                email="fatuma@example.com",
                password_hash=generate_password_hash("password123"),
                role="customer"
            ),
            User(
                username="admin",
                email="admin@example.com",
                password_hash=generate_password_hash("admin123"),
                role="admin"
            )
        ]
        db.session.add_all(users)
        db.session.commit()

        # Create Books
        books = [
            Book(
                title="Flask for Beginners",
                author="John Doe",
                genre="Programming",
                description="A complete guide to Flask",
                price=29.99,
                is_available="available",
                uploaded_by=users[1].id  # uploaded by admin
            ),
            Book(
                title="Mastering PostgreSQL",
                author="Jane Smith",
                genre="Database",
                description="Advanced PostgreSQL techniques",
                price=39.99,
                is_available="available",
                uploaded_by=users[1].id
            )
        ]
        db.session.add_all(books)
        db.session.commit()

        print("✅ Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
