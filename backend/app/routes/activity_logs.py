from flask import Blueprint, jsonify
from app.models import ActivityLog
from app.extensions import db

activity_logs_bp = Blueprint("activity_logs", __name__)

# GET all logs
@activity_logs_bp.route("/logs", methods=["GET"])
def get_logs():
    logs = ActivityLog.query.all()
    return jsonify([
        {
            "id": log.id,
            "action": log.action,
            "description": log.item,
            "date": log.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "user_id": log.user_id 
        }
        for log in logs
    ]), 200

# GET all possible log actions
@activity_logs_bp.route("/logActions", methods=["GET"])
def get_log_actions():
    actions = ["Approved", "Declined", "Pending"]
    return jsonify(actions), 200
