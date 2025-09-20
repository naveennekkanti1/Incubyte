import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwtsecret")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/sweetshop")

    # Email settings (example using Gmail SMTP)
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")  # your email
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")  # your email app password
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", MAIL_USERNAME)
