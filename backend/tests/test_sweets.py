def test_add_and_list_sweets(client):
    # Register & Login
    client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@test.com",
        "password": "pass123"
    })
    login = client.post("/auth/login", json={
        "username": "testuser",
        "password": "pass123"
    })
    token = login.get_json()["access_token"]

    # Add sweet
    response = client.post("/sweets/", json={
        "name": "Ladoo",
        "category": "Indian",
        "price": 10.0,
        "quantity": 5,
        "image_url": "http://example.com/ladoo.jpg"
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    sweet_id = response.get_json()["id"]

    # List sweets
    response = client.get("/sweets/")
    data = response.get_json()
    assert any(s["name"] == "Ladoo" for s in data)

    # Update sweet
    response = client.put(f"/sweets/{sweet_id}", json={"price": 12.0},
                          headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    # Delete sweet
    response = client.delete(f"/sweets/{sweet_id}",
                             headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
