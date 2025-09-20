from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from extensions import mongo
from bson import ObjectId

sweets_bp = Blueprint("sweets", __name__)

@sweets_bp.route("/", methods=["POST"])
@jwt_required()
def add_sweet():
    data = request.get_json()
    required = ["name", "category", "price", "quantity"]
    if not all(k in data for k in required):
        return jsonify({"msg": "Missing fields"}), 400

    sweet = {
        "name": data["name"],
        "category": data["category"],
        "price": float(data["price"]),
        "quantity": int(data["quantity"]),
        "image_url": data.get("image_url")  # optional
    }

    result = mongo.db.sweets.insert_one(sweet)
    return jsonify({"id": str(result.inserted_id)}), 201


@sweets_bp.route("/", methods=["GET"])
def list_sweets():
    sweets = list(mongo.db.sweets.find())
    for s in sweets:
        s["_id"] = str(s["_id"])
    return jsonify(sweets)


@sweets_bp.route("/<id>", methods=["PUT"])
@jwt_required()
def update_sweet(id):
    data = request.get_json()
    update_fields = {}

    if "name" in data:
        update_fields["name"] = data["name"]
    if "category" in data:
        update_fields["category"] = data["category"]
    if "price" in data:
        update_fields["price"] = float(data["price"])
    if "quantity" in data:
        update_fields["quantity"] = int(data["quantity"])
    if "image_url" in data:
        update_fields["image_url"] = data["image_url"]

    mongo.db.sweets.update_one({"_id": ObjectId(id)}, {"$set": update_fields})
    return jsonify({"msg": "Sweet updated"}), 200


@sweets_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def delete_sweet(id):
    mongo.db.sweets.delete_one({"_id": ObjectId(id)})
    return jsonify({"msg": "Sweet deleted"}), 200


@sweets_bp.route("/search", methods=["GET"])
@jwt_required()
def search_sweets():
    query = {}
    if name := request.args.get("name"):
        query["name"] = {"$regex": name, "$options": "i"}
    if category := request.args.get("category"):
        query["category"] = category
    if request.args.get("min_price") or request.args.get("max_price"):
        price_query = {}
        if min_price := request.args.get("min_price"):
            price_query["$gte"] = float(min_price)
        if max_price := request.args.get("max_price"):
            price_query["$lte"] = float(max_price)
        query["price"] = price_query

    sweets = list(mongo.db.sweets.find(query))
    for s in sweets:
        s["_id"] = str(s["_id"])
    return jsonify(sweets)