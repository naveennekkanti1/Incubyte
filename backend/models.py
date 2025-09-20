from mongoengine import Document, StringField, FloatField, IntField, ReferenceField, DateTimeField
from flask_login import UserMixin
import datetime

# -------------------------------
# User Model
# -------------------------------
class User(Document, UserMixin):
    username = StringField(required=True, unique=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)  # Hashed password
    role = StringField(default="user")     # "user" or "admin"

    def is_admin(self):
        return self.role == "admin"


# -------------------------------
# Sweet Model
# -------------------------------
class Sweet(Document):
    name = StringField(required=True, unique=True)
    category = StringField(required=True)
    price = FloatField(required=True, min_value=0)
    quantity = IntField(required=True, min_value=0)


# -------------------------------
# Purchase History Model
# -------------------------------
class PurchaseHistory(Document):
    user_id = ReferenceField(User, required=True)
    sweet_id = ReferenceField(Sweet, required=True)
    sweet_name = StringField(required=True)
    quantity = IntField(required=True, min_value=1)
    price = FloatField(required=True)
    total = FloatField(required=True)
    timestamp = DateTimeField(default=datetime.datetime.utcnow)
