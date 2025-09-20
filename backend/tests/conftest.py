import pytest
from app import create_app
from extensions import mongo
import mongomock

@pytest.fixture
def client():
    app = create_app(testing=True)

    # Replace Mongo with mongomock
    mongo.cx = mongomock.MongoClient()
    mongo.db = mongo.cx["test_db"]

    with app.test_client() as client:
        yield client
