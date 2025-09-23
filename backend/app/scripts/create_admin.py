from app import create_app
from app.extensions import db
from app.models import User

app = create_app()

with app.app_context():
    if User.query.filter_by(email="admin@example.com").first():
        print("Admin already exists")
    else:
        admin = User(name="Admin", email="admin@example.com", role="admin")
        admin.set_password("adminpass")
        db.session.add(admin)
        db.session.commit()
        print("created admin: admin@example.com / adminpass")