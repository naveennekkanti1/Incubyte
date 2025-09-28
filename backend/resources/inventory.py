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
            # Enhanced email template with card-like styling
            email_html = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Purchase Confirmation</title>
                <style>
                    body {{
                        font-family: 'Arial', sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        margin: 0;
                        padding: 20px;
                        min-height: 100vh;
                    }}
                    .email-container {{
                        max-width: 600px;
                        margin: 0 auto;
                        background: #ffffff;
                        border-radius: 20px;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                        position: relative;
                    }}
                    .header {{
                        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        position: relative;
                    }}
                    .header::before {{
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1" fill="white" opacity="0.1"/></svg>');
                    }}
                    .header h1 {{
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                        position: relative;
                        z-index: 1;
                    }}
                    .candy-emoji {{
                        font-size: 40px;
                        margin-bottom: 10px;
                        display: block;
                    }}
                    .content {{
                        padding: 40px 30px;
                    }}
                    .greeting {{
                        font-size: 24px;
                        color: #333;
                        margin-bottom: 20px;
                        font-weight: 600;
                    }}
                    .thank-you {{
                        color: #666;
                        font-size: 16px;
                        margin-bottom: 30px;
                        line-height: 1.5;
                    }}
                    .purchase-card {{
                        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                        border-radius: 15px;
                        padding: 25px;
                        margin: 25px 0;
                        color: white;
                        box-shadow: 0 10px 25px rgba(240, 147, 251, 0.3);
                    }}
                    .purchase-details {{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 20px;
                    }}
                    .product-info {{
                        flex: 1;
                        min-width: 250px;
                    }}
                    .product-name {{
                        font-size: 22px;
                        font-weight: 700;
                        margin-bottom: 15px;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}
                    .detail-row {{
                        display: flex;
                        justify-content: space-between;
                        margin: 8px 0;
                        font-size: 16px;
                    }}
                    .label {{
                        font-weight: 600;
                        opacity: 0.9;
                    }}
                    .value {{
                        font-weight: 700;
                    }}
                    .product-image {{
                        flex-shrink: 0;
                        text-align: center;
                    }}
                    .product-image img {{
                        width: 120px;
                        height: 120px;
                        border-radius: 15px;
                        object-fit: cover;
                        border: 3px solid rgba(255,255,255,0.3);
                        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    }}
                    .total-section {{
                        background: rgba(255,255,255,0.2);
                        border-radius: 10px;
                        padding: 15px;
                        margin-top: 20px;
                        border: 1px solid rgba(255,255,255,0.3);
                    }}
                    .total-amount {{
                        font-size: 24px;
                        font-weight: 800;
                        text-align: center;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}
                    .footer {{
                        background: #f8f9fc;
                        padding: 30px;
                        text-align: center;
                        border-top: 1px solid #e9ecef;
                    }}
                    .footer-message {{
                        color: #6c5ce7;
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 10px;
                    }}
                    .footer-signature {{
                        color: #74b9ff;
                        font-size: 16px;
                        font-weight: 500;
                    }}
                    .decoration {{
                        text-align: center;
                        margin: 20px 0;
                        font-size: 30px;
                        opacity: 0.6;
                    }}
                    @media (max-width: 600px) {{
                        .purchase-details {{
                            flex-direction: column;
                            text-align: center;
                        }}
                        .product-info {{
                            min-width: auto;
                        }}
                        .detail-row {{
                            justify-content: center;
                            gap: 20px;
                        }}
                    }}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <span class="candy-emoji">🍬</span>
                        <h1>Purchase Confirmation</h1>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">Hi {user['username']}! 👋</div>
                        <div class="thank-you">
                            Thank you for your sweet purchase! Your order has been confirmed and processed successfully.
                        </div>
                        
                        <div class="purchase-card">
                            <div class="purchase-details">
                                <div class="product-info">
                                    <div class="product-name">{sweet['name']}</div>
                                    <div class="detail-row">
                                        <span class="label">Quantity:</span>
                                        <span class="value">{qty} piece(s)</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Unit Price:</span>
                                        <span class="value">₹{sweet['price']}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Order Date:</span>
                                        <span class="value">{datetime.now().strftime('%B %d, %Y')}</span>
                                    </div>
                                </div>
                                {f'''
                                <div class="product-image">
                                    <img src="{sweet.get('image_url', '')}" alt="{sweet['name']}" onerror="this.style.display='none'"/>
                                </div>
                                ''' if sweet.get('image_url') else ''}
                            </div>
                            
                            <div class="total-section">
                                <div class="total-amount">
                                    Total: ₹{sweet['price'] * qty}
                                </div>
                            </div>
                        </div>
                        
                        <div class="decoration">✨ 🍭 🧁 🍪 ✨</div>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-message">We hope you enjoy your delicious treats! 💜</div>
                        <div class="footer-signature">— Sweet Shop Team</div>
                    </div>
                </div>
            </body>
            </html>
            """
            
            msg = Message(
                subject="🍬 Sweet Shop Purchase Confirmation",
                recipients=[user["email"]],
                html=email_html
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
