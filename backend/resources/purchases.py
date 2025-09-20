from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mongo
from datetime import datetime
from bson import ObjectId

purchases_bp = Blueprint("purchases", __name__, url_prefix="/api/purchases")

@purchases_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    try:
        current_user_id = get_jwt_identity()

        try:
            user_object_id = ObjectId(current_user_id)
            user = mongo.db.users.find_one({"_id": user_object_id})
        except:
            user = mongo.db.users.find_one({"_id": current_user_id})

        if not user:
            return jsonify({"msg": "User not found"}), 404

        # ✅ Fix: check is_admin instead of role
        if user.get("is_admin", False) is True:
            purchases = list(mongo.db.purchase_history.find().sort("timestamp", -1))
        else:
            try:
                user_object_id = ObjectId(current_user_id)
                purchases = list(mongo.db.purchase_history.find({
                    "$or": [
                        {"user_id": user_object_id},
                        {"user_id": current_user_id}
                    ]
                }).sort("timestamp", -1))
            except:
                purchases = list(mongo.db.purchase_history.find({
                    "user_id": current_user_id
                }).sort("timestamp", -1))


        result = []
        for p in purchases:
            user_name = "Unknown User"
            user_email = ""

            if user.get("is_admin", False) is True:
                try:
                    purchase_user = mongo.db.users.find_one({"_id": p["user_id"]})
                    if purchase_user:
                        user_name = purchase_user.get("username") or purchase_user.get("name") or "Unknown User"
                        user_email = purchase_user.get("email", "")
                    else:
                        user_name = "Deleted User"
                        user_email = f"User ID: {str(p['user_id'])}"
                except Exception as e:
                    print(f"Error fetching user info for purchase {p['_id']}: {e}")
                    user_name, user_email = "Unknown User", str(p["user_id"])

            purchase_data = {
                "_id": str(p["_id"]),
                "sweet_id": str(p["sweet_id"]),
                "sweet_name": p["sweet_name"],
                "quantity": p["quantity"],
                "price": float(p["price"]),
                "total": float(p["total"]),
                "timestamp": p["timestamp"].isoformat() if p.get("timestamp") else None,
                "user_id": str(p["user_id"])
            }

            if user.get("is_admin", False) is True:
                purchase_data["user_name"] = user_name
                purchase_data["user_email"] = user_email

            result.append(purchase_data)

        return jsonify(result), 200

    except Exception as e:
        print(f"Error in get_history: {str(e)}")
        return jsonify({"msg": f"Error fetching purchase history: {str(e)}"}), 500



@purchases_bp.route("/buy", methods=["POST"])
@jwt_required()
def buy_sweet():
    try:
        current_user_id = get_jwt_identity()
        data = request.json
        sweet_id = data.get("sweet_id")
        quantity = int(data.get("quantity", 1))

        if not sweet_id:
            return jsonify({"msg": "Sweet ID is required"}), 400

        if quantity <= 0:
            return jsonify({"msg": "Quantity must be greater than 0"}), 400

        # Find the sweet
        sweet = mongo.db.sweets.find_one({"_id": ObjectId(sweet_id)})
        if not sweet:
            return jsonify({"msg": "Sweet not found"}), 404

        if sweet.get("quantity", 0) < quantity:
            return jsonify({"msg": "Not enough stock available"}), 400

        # Decrease stock
        mongo.db.sweets.update_one(
            {"_id": ObjectId(sweet_id)},
            {"$inc": {"quantity": -quantity}}
        )

        # Create purchase record - store user_id in consistent format
        try:
            user_object_id = ObjectId(current_user_id)
        except:
            user_object_id = current_user_id

        purchase = {
            "user_id": user_object_id,
            "sweet_id": ObjectId(sweet_id),
            "sweet_name": sweet["name"],
            "quantity": quantity,
            "price": float(sweet["price"]),
            "total": float(sweet["price"]) * quantity,
            "timestamp": datetime.utcnow(),
        }
        
        result = mongo.db.purchase_history.insert_one(purchase)
        print(f"Purchase recorded: {result.inserted_id}")  # Debug log

        return jsonify({
            "msg": "Purchase successful",
            "purchase_id": str(result.inserted_id),
            "total": purchase["total"]
        }), 201

    except Exception as e:
        print(f"Error in buy_sweet: {str(e)}")  # Debug log
        return jsonify({"msg": f"Purchase failed: {str(e)}"}), 500


@purchases_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_purchase_stats():
    """Get purchase statistics for admin dashboard"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user info
        try:
            user_object_id = ObjectId(current_user_id)
            user = mongo.db.users.find_one({"_id": user_object_id})
        except:
            user = mongo.db.users.find_one({"_id": current_user_id})
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
            
        if user.get("role") != "admin":
            return jsonify({"msg": "Admin access required"}), 403
        
        # Get current date info
        now = datetime.utcnow()
        current_month = now.month
        current_year = now.year
        
        # Calculate previous month/year
        if current_month == 1:
            previous_month = 12
            previous_year = current_year - 1
        else:
            previous_month = current_month - 1
            previous_year = current_year
        
        # Get all user IDs (no exclusion for admin view)
        # Admin should see ALL purchase statistics including their own
        
        # Aggregate pipeline for current month sales (ALL purchases)
        current_month_pipeline = [
            {
                "$match": {
                    "timestamp": {
                        "$gte": datetime(current_year, current_month, 1),
                        "$lt": datetime(current_year, current_month + 1, 1) if current_month < 12 else datetime(current_year + 1, 1, 1)
                    }
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total_sales": {"$sum": "$total"},
                    "total_orders": {"$sum": 1},
                    "total_items": {"$sum": "$quantity"}
                }
            }
        ]
        
        # Aggregate pipeline for previous month sales (ALL purchases)
        previous_month_pipeline = [
            {
                "$match": {
                    "timestamp": {
                        "$gte": datetime(previous_year, previous_month, 1),
                        "$lt": datetime(previous_year, previous_month + 1, 1) if previous_month < 12 else datetime(previous_year + 1, 1, 1)
                    }
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total_sales": {"$sum": "$total"},
                    "total_orders": {"$sum": 1},
                    "total_items": {"$sum": "$quantity"}
                }
            }
        ]
        
        # Execute aggregation queries
        current_month_stats = list(mongo.db.purchase_history.aggregate(current_month_pipeline))
        previous_month_stats = list(mongo.db.purchase_history.aggregate(previous_month_pipeline))
        
        # Get total unique customers (ALL users who made purchases)
        total_customers = mongo.db.purchase_history.distinct("user_id")
        
        # Get all-time stats (ALL purchases)
        all_time_stats = list(mongo.db.purchase_history.aggregate([
            {
                "$group": {
                    "_id": None,
                    "total_sales": {"$sum": "$total"},
                    "total_orders": {"$sum": 1},
                    "total_items": {"$sum": "$quantity"}
                }
            }
        ]))
        
        # Format results
        current_month_data = current_month_stats[0] if current_month_stats else {"total_sales": 0, "total_orders": 0, "total_items": 0}
        previous_month_data = previous_month_stats[0] if previous_month_stats else {"total_sales": 0, "total_orders": 0, "total_items": 0}
        all_time_data = all_time_stats[0] if all_time_stats else {"total_sales": 0, "total_orders": 0, "total_items": 0}
        
        # Calculate growth rate
        growth_rate = 0
        if previous_month_data["total_sales"] > 0:
            growth_rate = ((current_month_data["total_sales"] - previous_month_data["total_sales"]) / previous_month_data["total_sales"]) * 100
        
        return jsonify({
            "current_month": {
                "sales": float(current_month_data["total_sales"]),
                "orders": current_month_data["total_orders"],
                "items": current_month_data["total_items"]
            },
            "previous_month": {
                "sales": float(previous_month_data["total_sales"]),
                "orders": previous_month_data["total_orders"],
                "items": previous_month_data["total_items"]
            },
            "all_time": {
                "sales": float(all_time_data["total_sales"]),
                "orders": all_time_data["total_orders"],
                "items": all_time_data["total_items"]
            },
            "growth_rate": round(growth_rate, 2),
            "total_customers": len(total_customers)
        }), 200
        
    except Exception as e:
        print(f"Error in get_purchase_stats: {str(e)}")
        return jsonify({"msg": f"Error fetching stats: {str(e)}"}), 500


# Additional endpoint to get user info for debugging
@purchases_bp.route("/debug/user", methods=["GET"])
@jwt_required()
def debug_user():
    """Debug endpoint to check current user info"""
    current_user_id = get_jwt_identity()
    try:
        user_object_id = ObjectId(current_user_id)
        user = mongo.db.users.find_one({"_id": user_object_id})
    except:
        user = mongo.db.users.find_one({"_id": current_user_id})
    
    if user:
        return jsonify({
            "user_id": current_user_id,
            "user": {
                "_id": str(user["_id"]),
                "email": user.get("email"),
                "name": user.get("name"),
                "username": user.get("username"),
                "role": user.get("role")
            }
        }), 200
    else:
        return jsonify({
            "msg": "User not found", 
            "user_id": current_user_id,
            "user_id_type": type(current_user_id).__name__
        }), 404


@purchases_bp.route("/debug/purchases", methods=["GET"])
@jwt_required()
def debug_purchases():
    """Debug endpoint to check purchase data structure"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user info
        try:
            user_object_id = ObjectId(current_user_id)
            user = mongo.db.users.find_one({"_id": user_object_id})
        except:
            user = mongo.db.users.find_one({"_id": current_user_id})
        
        if not user or user.get("role") != "admin":
            return jsonify({"msg": "Admin access required"}), 403
        
        # Get sample purchases
        sample_purchases = list(mongo.db.purchase_history.find().limit(5))
        
        # Get admin users
        admin_users = list(mongo.db.users.find({"role": "admin"}))
        
        return jsonify({
            "total_purchases": mongo.db.purchase_history.count_documents({}),
            "total_users": mongo.db.users.count_documents({}),
            "admin_users_count": len(admin_users),
            "admin_users": [str(admin["_id"]) for admin in admin_users],
            "sample_purchases": [
                {
                    "_id": str(p["_id"]),
                    "user_id": str(p["user_id"]),
                    "sweet_name": p["sweet_name"],
                    "total": p["total"],
                    "timestamp": p["timestamp"].isoformat() if p.get("timestamp") else None
                } for p in sample_purchases
            ]
        }), 200
        
    except Exception as e:
        return jsonify({"msg": f"Debug error: {str(e)}"}), 500