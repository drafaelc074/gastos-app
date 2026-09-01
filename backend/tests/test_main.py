from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy"
    }


def test_home():
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "online"


def test_criar_despesa():
    nova_despesa = {
        "descricao": "Internet",
        "valor": 120.90,
        "categoria": "Casa",
        "data": "2026-09-01"
    }

    response = client.post(
        "/despesas",
        json=nova_despesa
    )

    assert response.status_code == 200

    data = response.json()

    assert data["descricao"] == "Internet"
    assert data["valor"] == 120.90
    assert data["categoria"] == "Casa"
    assert "id" in data