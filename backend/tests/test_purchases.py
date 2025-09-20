def test_purchase_flow(client):
    # Register & Login
    client.post("/auth/register", json={
        "username": "buyer",
        "email": "buyer@test.com",
        "password": "pass123"
    })
    login = client.post("/auth/login", json={
        "username": "buyer",
        "password": "pass123"
    })
    token = login.get_json()["access_token"]

    # Add sweet
    add_sweet = client.post("/sweets/", json={
        "name": "Jalebi",
        "category": "Indian",
        "price": 15.0,
        "quantity": 10
    }, headers={"Authorization": f"Bearer {token}"})
    sweet_id = add_sweet.get_json()["id"]

    # Buy sweet
    response = client.post("/api/purchases/buy", json={
        "sweet_id": sweet_id,
        "quantity": 2
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    assert response.get_json()["msg"] == "Purchase successful"

    # Get purchase history
    response = client.get("/api/purchases/history",
                          headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    history = response.get_json()
    assert len(history) == 1
    assert history[0]["sweet_name"] == "Jalebi"
