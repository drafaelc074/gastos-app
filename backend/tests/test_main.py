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


def test_criar_receita():
    response = client.post(
        "/receitas",
        json={
            "descricao": "Salário Teste",
            "valor": 5000,
            "categoria": "Salário",
            "data": "2026-09-02"
        }
    )

    assert response.status_code == 200

    dados = response.json()

    assert dados["descricao"] == "Salário Teste"
    assert dados["valor"] == 5000
    assert dados["categoria"] == "Salário"


def test_listar_receitas():
    response = client.get("/receitas")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_editar_receita():
    criada = client.post(
        "/receitas",
        json={
            "descricao": "Freelance",
            "valor": 500,
            "categoria": "Freelance",
            "data": "2026-09-02"
        }
    )

    receita_id = criada.json()["id"]

    response = client.put(
        f"/receitas/{receita_id}",
        json={
            "descricao": "Freelance Atualizado",
            "valor": 750,
            "categoria": "Freelance",
            "data": "2026-09-02"
        }
    )

    assert response.status_code == 200
    assert response.json()["valor"] == 750
    assert response.json()["descricao"] == "Freelance Atualizado"


def test_excluir_receita():
    criada = client.post(
        "/receitas",
        json={
            "descricao": "Receita para excluir",
            "valor": 100,
            "categoria": "Outros",
            "data": "2026-09-02"
        }
    )

    receita_id = criada.json()["id"]

    response = client.delete(
        f"/receitas/{receita_id}"
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Receita excluída com sucesso"   

def test_filtrar_despesas_por_mes():
    response = client.get("/despesas?mes=2026-09")

    assert response.status_code == 200

    despesas = response.json()

    for despesa in despesas:
        assert despesa["data"].startswith("2026-09")


def test_filtrar_receitas_por_mes():
    response = client.get("/receitas?mes=2026-09")

    assert response.status_code == 200

    receitas = response.json()

    for receita in receitas:
        assert receita["data"].startswith("2026-09")

def test_resumo_mensal():
    response = client.get("/resumo-mensal")

    assert response.status_code == 200

    resumo = response.json()

    assert isinstance(resumo, list)

    for item in resumo:
        assert "mes" in item
        assert "receitas" in item
        assert "despesas" in item