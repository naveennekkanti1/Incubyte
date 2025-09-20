from flask import Flask
from dotenv import load_dotenv
from config import Config
from flask_cors import CORS
from extensions import mongo, jwt, mail
from resources.auth import auth_bp
from resources.sweets import sweets_bp
from resources.inventory import inventory_bp
from resources.purchases import purchases_bp


load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app,origins="http://localhost:3000", supports_credentials=True)

    mongo.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(sweets_bp, url_prefix="/api/sweets")
    app.register_blueprint(inventory_bp, url_prefix="/api/sweets")
    app.register_blueprint(purchases_bp, url_prefix="/api/purchases")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
