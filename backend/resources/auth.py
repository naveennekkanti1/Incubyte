from flask import Blueprint, request, jsonify
from extensions import mongo, mail
from utils import hash_password, check_password
from flask_jwt_extended import create_access_token
from datetime import timedelta
from flask_mail import Message

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username, email, password = data.get("username"), data.get("email"), data.get("password")

    if not username or not email or not password:
        return jsonify({"msg": "Missing fields"}), 400

    if mongo.db.users.find_one({"username": username}):
        return jsonify({"msg": "User already exists"}), 400

    hashed_pw = hash_password(password)
    user = {"username": username, "email": email, "password": hashed_pw, "is_admin": False}
    inserted = mongo.db.users.insert_one(user)

    # Send welcome email
    try:
        msg = Message(
            subject="🎉 Welcome to Sweet Shop!",
            recipients=[email],
            html=f"""
            <h2>Hi {username},</h2>
            <p>Welcome to <b>Sweet Shop</b> 🍭! We're excited to have you.</p>
            <p>You can now explore our wide range of sweets and place your first order.</p>
            <br/>
            <p style="color:purple;">Happy Shopping!<br/>Sweet Shop Team</p>
            """
        )
        mail.send(msg)
    except Exception as e:
        print("Email error:", str(e))

    token = create_access_token(identity=str(inserted.inserted_id), expires_delta=timedelta(hours=1))
    return jsonify({"access_token": token}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username, password = data.get("username"), data.get("password")

    user = mongo.db.users.find_one({"username": username})
    if not user or not check_password(password, user["password"]):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(
        identity=str(user["_id"]), expires_delta=timedelta(hours=1)
    )

    # Map `is_admin` (boolean in DB) to string role
    role = "admin" if user.get("is_admin") else "user"

    return jsonify({
        "access_token": token,
        "role": role
    }), 200
