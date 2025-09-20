from flask import Blueprint, request, jsonify
from extensions import mongo, mail
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from flask_mail import Message
from datetime import datetime

inventory_bp = Blueprint("inventory", __name__)

@inventory_bp.route("/<id>/purchase", methods=["POST"])
@jwt_required()
def purchase_sweet(id):
    data = request.get_json()
    qty = int(data.get("quantity", 1))
    user_id = get_jwt_identity()

    sweet = mongo.db.sweets.find_one({"_id": ObjectId(id)})
    if not sweet:
        return jsonify({"msg": "Sweet not found"}), 404
    if sweet["quantity"] < qty:
        return jsonify({"msg": "Insufficient stock"}), 400

    # Decrease stock
    mongo.db.sweets.update_one({"_id": ObjectId(id)}, {"$inc": {"quantity": -qty}})

    # Save purchase history
    purchase = {
        "user_id": ObjectId(user_id),
        "sweet_id": sweet["_id"],
        "sweet_name": sweet["name"],
        "quantity": qty,
        "price": sweet["price"],
        "total": sweet["price"] * qty,
        "timestamp": datetime.utcnow(),
    }
    mongo.db.purchase_history.insert_one(purchase)

    # Send email
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user and "email" in user:
        try:
            msg = Message(
                subject="🍬 Sweet Shop Purchase Confirmation",
                recipients=[user["email"]],
                html=f"""
                <h2>Hi {user['username']},</h2>
                <p>Thank you for your purchase!</p>
                <p><b>Sweet:</b> {sweet['name']}</p>
                <p><b>Quantity:</b> {qty}</p>
                <p><b>Price:</b> ₹{sweet['price']}</p>
                <p><b>Total:</b> ₹{sweet['price'] * qty}</p>
                <br/>
                <img src="{sweet.get('image_url', '')}" alt="Sweet Image" width="200"/>
                <br/><br/>
                <p style="color:purple;">We hope you enjoy your sweets!<br/>Sweet Shop Team</p>
                """
            )
            mail.send(msg)
        except Exception as e:
            return jsonify({"msg": f"Purchase successful, but email failed: {str(e)}"}), 200

    return jsonify({"msg": f"Purchased {qty} {sweet['name']}(s) and recorded in history!"}), 201

@inventory_bp.route("/<id>/restock", methods=["POST"])
@jwt_required()
def restock_sweet(id):
    data = request.get_json()
    qty = int(data.get("quantity", 1))

    sweet = mongo.db.sweets.find_one({"_id": ObjectId(id)})
    if not sweet:
        return jsonify({"msg": "Sweet not found"}), 404

    mongo.db.sweets.update_one({"_id": ObjectId(id)}, {"$inc": {"quantity": qty}})
    return jsonify({"msg": f"Restocked {qty} {sweet['name']}(s)"})
