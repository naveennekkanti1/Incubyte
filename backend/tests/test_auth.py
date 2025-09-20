import json

def test_register_and_login(client):
    # Register
    response = client.post("/auth/register", json={
        "username": "naveen",
        "email": "naveen@test.com",
        "password": "pass123"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert "access_token" in data

    # Login
    response = client.post("/auth/login", json={
        "username": "naveen",
        "password": "pass123"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert data["role"] == "user"
