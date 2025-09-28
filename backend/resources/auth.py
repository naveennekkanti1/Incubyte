from flask import Blueprint, request, jsonify, render_template_string
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

    existing_user = mongo.db.users.find_one({
    "$or": [
        {"username": username},
        {"email": email}
    ]
})

    if existing_user:
        return jsonify({"msg": "User with this username or email already exists"}), 400


    hashed_pw = hash_password(password)
    user = {"username": username, "email": email, "password": hashed_pw, "is_admin": False}
    inserted = mongo.db.users.insert_one(user)

    # Send welcome email with enhanced styling
    try:
        welcome_html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Sweet Shop</title>
            <style>
                body {{
                    font-family: 'Arial', sans-serif;
                    background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #e17055 100%);
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                }}
                .email-container {{
                    max-width: 650px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 25px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                    position: relative;
                }}
                .header {{
                    background: linear-gradient(135deg, #fd79a8, #fdcb6e);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }}
                .header::before {{
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="3" fill="white" opacity="0.1"/><circle cx="75" cy="35" r="2" fill="white" opacity="0.1"/><circle cx="60" cy="75" r="2.5" fill="white" opacity="0.1"/><circle cx="40" cy="60" r="1.5" fill="white" opacity="0.1"/><circle cx="80" cy="80" r="1" fill="white" opacity="0.1"/></svg>');
                    animation: float 20s infinite linear;
                }}
                @keyframes float {{
                    0% {{ transform: translate(-50%, -50%) rotate(0deg); }}
                    100% {{ transform: translate(-50%, -50%) rotate(360deg); }}
                }}
                .welcome-badge {{
                    background: rgba(255,255,255,0.2);
                    border-radius: 50px;
                    padding: 15px 25px;
                    display: inline-block;
                    margin-bottom: 20px;
                    font-size: 16px;
                    font-weight: 600;
                    border: 2px solid rgba(255,255,255,0.3);
                    position: relative;
                    z-index: 1;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 32px;
                    font-weight: 800;
                    position: relative;
                    z-index: 1;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }}
                .emoji-celebration {{
                    font-size: 50px;
                    margin: 20px 0;
                    display: block;
                    position: relative;
                    z-index: 1;
                }}
                .content {{
                    padding: 50px 40px;
                }}
                .greeting {{
                    font-size: 28px;
                    color: #2d3436;
                    margin-bottom: 25px;
                    font-weight: 700;
                    text-align: center;
                }}
                .welcome-message {{
                    font-size: 18px;
                    color: #636e72;
                    line-height: 1.6;
                    text-align: center;
                    margin-bottom: 40px;
                }}
                .features-section {{
                    background: linear-gradient(135deg, #74b9ff, #0984e3);
                    border-radius: 20px;
                    padding: 35px;
                    margin: 30px 0;
                    color: white;
                    box-shadow: 0 15px 35px rgba(116, 185, 255, 0.3);
                }}
                .features-title {{
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 25px;
                    text-align: center;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }}
                .features-grid {{
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 25px;
                }}
                .feature-item {{
                    background: rgba(255,255,255,0.1);
                    border-radius: 15px;
                    padding: 20px;
                    text-align: center;
                    border: 1px solid rgba(255,255,255,0.2);
                    backdrop-filter: blur(10px);
                }}
                .feature-icon {{
                    font-size: 30px;
                    margin-bottom: 10px;
                    display: block;
                }}
                .feature-text {{
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 5px;
                }}
                .feature-desc {{
                    font-size: 14px;
                    opacity: 0.9;
                }}
                .cta-section {{
                    background: linear-gradient(135deg, #00b894, #00cec9);
                    border-radius: 20px;
                    padding: 30px;
                    margin: 30px 0;
                    text-align: center;
                    color: white;
                    box-shadow: 0 15px 35px rgba(0, 184, 148, 0.3);
                }}
                .cta-button {{
                    display: inline-block;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    padding: 15px 30px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    transition: all 0.3s ease;
                    margin-top: 15px;
                }}
                .cta-button:hover {{
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                }}
                .footer {{
                    background: linear-gradient(135deg, #2d3436, #636e72);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }}
                .footer-message {{
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 15px;
                }}
                .footer-signature {{
                    font-size: 16px;
                    opacity: 0.9;
                    font-weight: 500;
                }}
                .social-icons {{
                    margin: 25px 0 15px;
                    font-size: 24px;
                }}
                .decoration {{
                    text-align: center;
                    margin: 30px 0;
                    font-size: 35px;
                    opacity: 0.7;
                }}
                @media (max-width: 600px) {{
                    .email-container {{
                        margin: 10px;
                        border-radius: 15px;
                    }}
                    .content {{
                        padding: 30px 20px;
                    }}
                    .header {{
                        padding: 30px 20px;
                    }}
                    .greeting {{
                        font-size: 24px;
                    }}
                    .features-grid {{
                        grid-template-columns: 1fr;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <div class="welcome-badge">🎉 NEW MEMBER 🎉</div>
                    <span class="emoji-celebration">🍬 🎊 🍭</span>
                    <h1>Welcome to Sweet Shop!</h1>
                </div>
                
                <div class="content">
                    <div class="greeting">Hello {username}! 👋</div>
                    <div class="welcome-message">
                        We're absolutely <strong>thrilled</strong> to have you join our sweet community! 
                        Your journey into the world of delicious treats starts now.
                    </div>
                    
                    <div class="features-section">
                        <div class="features-title">What's waiting for you:</div>
                        <div class="features-grid">
                            <div class="feature-item">
                                <span class="feature-icon">🍰</span>
                                <div class="feature-text">Premium Sweets</div>
                                <div class="feature-desc">Handcrafted delicacies from around the world</div>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🚚</span>
                                <div class="feature-text">Fast Delivery</div>
                                <div class="feature-desc">Fresh sweets delivered right to your doorstep</div>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">💝</span>
                                <div class="feature-text">Special Offers</div>
                                <div class="feature-desc">Exclusive deals and member-only discounts</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cta-section">
                        <h3 style="margin: 0 0 10px 0; font-size: 22px;">Ready to explore?</h3>
                        <p style="margin: 0 0 20px 0; opacity: 0.9;">Browse our collection and place your first order!</p>
                        <a href="#" class="cta-button">Start Shopping Now 🛒</a>
                    </div>
                    
                    <div class="decoration">✨ 🧁 🍪 🍩 🍫 ✨</div>
                </div>
                
                <div class="footer">
                    <div class="footer-message">Sweet dreams begin here! 💜</div>
                    <div class="social-icons">🌟 ⭐ 🌟</div>
                    <div class="footer-signature">— The Sweet Shop Family</div>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg = Message(
            subject="🎉 Welcome to Sweet Shop!",
            recipients=[email],
            html=welcome_html
        )
        mail.send(msg)
    except Exception as e:
        print("Email error:", str(e))

    token = create_access_token(identity=str(inserted.inserted_id), expires_delta=timedelta(hours=1))
    return jsonify({"access_token": token}), 201

import user_agents

def get_device_info():
    ua_string = request.headers.get("User-Agent")
    user_agent = user_agents.parse(ua_string)

    return {
        "browser": user_agent.browser.family,
        "os": user_agent.os.family,
        "device": user_agent.device.family,
        "ip": request.remote_addr
    }


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username, password = data.get("username"), data.get("password")
    latitude, longitude = data.get("latitude"), data.get("longitude")

    user = mongo.db.users.find_one({"username": username})
    if not user or not check_password(password, user["password"]):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(
        identity=str(user["_id"]), expires_delta=timedelta(hours=1)
    )
    role = "admin" if user.get("is_admin") else "user"

    # Device & IP info
    device_info = get_device_info()

    # Google Maps link
    map_link = f"https://www.google.com/maps?q={latitude},{longitude}"

    # HTML email template with inline CSS
    html_body = f"""
    <html>
    <head>
      <style>
        body {{
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          color: #333;
          padding: 20px;
        }}
        .container {{
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
        }}
        .header {{
          background: linear-gradient(135deg, #a855f7, #ec4899, #ef4444);
          padding: 15px;
          border-radius: 10px 10px 0 0;
          color: #fff;
          text-align: center;
          font-size: 20px;
        }}
        .content {{
          padding: 20px;
          line-height: 1.6;
        }}
        .map-link {{
          display: inline-block;
          margin-top: 10px;
          padding: 10px 15px;
          background: #2563eb;
          color: #fff !important;
          text-decoration: none;
          border-radius: 6px;
        }}
        .footer {{
          margin-top: 20px;
          font-size: 12px;
          color: #888;
          text-align: center;
        }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">🔔 New Login Detected</div>
        <div class="content">
          <p>Hello <b>{username}</b>,</p>
          <p>A login to your account was detected with the following details:</p>

          <ul>
            <li><b>Location:</b> {latitude}, {longitude}</li>
            <li><b>IP:</b> {device_info['ip']}</li>
            <li><b>Browser:</b> {device_info['browser']}</li>
            <li><b>OS:</b> {device_info['os']}</li>
            <li><b>Device:</b> {device_info['device']}</li>
          </ul>

          <p>
            📍 <a class="map-link" href="{map_link}" target="_blank">
              View Location on Map
            </a>
          </p>

          <p>If this wasn’t you, please reset your password immediately.</p>
        </div>
        <div class="footer">
          © 2025 YourApp. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    """

    # Send email
    msg = Message(
        subject="New Login Detected",
        sender="noreply@yourapp.com",
        recipients=[user["email"]],
        html=html_body
    )
    mail.send(msg)

    return jsonify({
        "access_token": token,
        "role": role
    }), 200
