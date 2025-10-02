# app/routes/dashboard.py
from flask import Blueprint, jsonify
from app.models import db, User, Book, Lending

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboardStats", methods=["GET"])
def dashboard_stats():
    total_users = db.session.query(User).count()
    total_books = db.session.query(Book).count()
    borrowed_books = db.session.query(Lending).filter_by(status="borrowed").count()
    pending_requests = db.session.query(Lending).filter_by(status="pending").count()

    return jsonify({
        "totalUsers": total_users,
        "totalBooks": total_books,
        "borrowedBooks": borrowed_books,
        "pendingRequests": pending_requests,
    })
