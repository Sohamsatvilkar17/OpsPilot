from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_datasets_requires_authentication():
    response = client.get("/datasets/")

    assert response.status_code == 401


def test_analytics_requires_authentication():
    response = client.get("/analytics/1")

    assert response.status_code == 401


def test_forecast_requires_authentication():
    response = client.get("/forecast/1")

    assert response.status_code == 401


def test_recommendations_requires_authentication():
    response = client.get("/recommendations/1")

    assert response.status_code == 401


def test_alerts_requires_authentication():
    response = client.get("/alerts/1")

    assert response.status_code == 401


def test_chat_requires_authentication():
    response = client.post(
        "/chat/1",
        json={
            "question": "What is my total revenue?"
        }
    )

    assert response.status_code == 401