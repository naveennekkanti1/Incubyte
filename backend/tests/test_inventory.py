def test_purchase_and_restock(client):
    # Register & Login
    client.post("/auth/register", json={
        "username": "stockuser",
        "email": "stock@test.com",
        "password": "pass123"
    })
    login = client.post("/auth/login", json={
        "username": "stockuser",
        "password": "pass123"
    })
    token = login.get_json()["access_token"]

    # Add sweet
    add_sweet = client.post("/sweets/", json={
        "name": "Barfi",
        "category": "Indian",
        "price": 20.0,
        "quantity": 5
    }, headers={"Authorization": f"Bearer {token}"})
    sweet_id = add_sweet.get_json()["id"]

    # Purchase 2
    response = client.post(f"/inventory/{sweet_id}/purchase", json={"quantity": 2},
                           headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201

    # Restock 3
    response = client.post(f"/inventory/{sweet_id}/restock", json={"quantity": 3},
                           headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert "Restocked" in response.get_json()["msg"]
