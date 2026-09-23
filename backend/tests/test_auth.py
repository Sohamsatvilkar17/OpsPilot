from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_login_with_invalid_username():
    response = client.post(
        "/auth/login",
        data={
            "username": "invalid_user_12345",
            "password": "wrong_password"
        }
    )

    assert response.status_code == 401


def test_login_with_invalid_password():
    response = client.post(
        "/auth/login",
        data={
            "username": "soham",
            "password": "wrong_password"
        }
    )

    assert response.status_code == 401
    