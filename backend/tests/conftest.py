import pytest
import mongomock
import sys
import os

# Add backend root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from extensions import mongo
from app import create_app


@pytest.fixture
def client():
    # Create the app with testing config
    app = create_app(testing=True)

    # Replace Mongo with mongomock for testing
    mongo.cx = mongomock.MongoClient()
    mongo.db = mongo.cx["sweetshop_test"]

    with app.test_client() as client:
        yield client
