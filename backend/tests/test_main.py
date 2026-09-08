from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def obter_headers_auth():
    client.post(
        "/usuarios",
        json={
            "nome": "Usuario Teste",
            "email": "teste@teste.com",
            "senha": "teste123"
        }
    )

    response = client.post(
        "/login",
        json={
            "email": "teste@teste.com",
            "senha": "teste123"
        }
    )

    token = response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }


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
    headers = obter_headers_auth()

    nova_despesa = {
        "descricao": "Internet",
        "valor": 120.90,
        "categoria": "Casa",
        "data": "2026-09-01"
    }

    response = client.post(
        "/despesas",
        json=nova_despesa,
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["descricao"] == "Internet"
    assert data["valor"] == 120.90
    assert data["categoria"] == "Casa"
    assert "id" in data
    assert "usuario_id" in data


def test_criar_receita():
    headers = obter_headers_auth()

    nova_receita = {
        "descricao": "Salário Teste",
        "valor": 5000,
        "categoria": "Salário",
        "data": "2026-09-07"
    }

    response = client.post(
        "/receitas",
        json=nova_receita,
        headers=headers
    )

    assert response.status_code == 200

    dados = response.json()

    assert dados["descricao"] == "Salário Teste"
    assert dados["valor"] == 5000
    assert dados["categoria"] == "Salário"
    assert "id" in dados
    assert "usuario_id" in dados


def test_listar_receitas():
    headers = obter_headers_auth()

    response = client.get(
        "/receitas",
        headers=headers
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_editar_receita():
    headers = obter_headers_auth()

    criada = client.post(
        "/receitas",
        json={
            "descricao": "Freelance",
            "valor": 500,
            "categoria": "Freelance",
            "data": "2026-09-02"
        },
        headers=headers
    )

    assert criada.status_code == 200

    receita_id = criada.json()["id"]

    response = client.put(
        f"/receitas/{receita_id}",
        json={
            "descricao": "Freelance Atualizado",
            "valor": 750,
            "categoria": "Freelance",
            "data": "2026-09-02"
        },
        headers=headers
    )

    assert response.status_code == 200
    assert response.json()["valor"] == 750
    assert response.json()["descricao"] == "Freelance Atualizado"


def test_excluir_receita():
    headers = obter_headers_auth()

    criada = client.post(
        "/receitas",
        json={
            "descricao": "Receita para excluir",
            "valor": 100,
            "categoria": "Outros",
            "data": "2026-09-02"
        },
        headers=headers
    )

    assert criada.status_code == 200

    receita_id = criada.json()["id"]

    response = client.delete(
        f"/receitas/{receita_id}",
        headers=headers
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Receita excluída com sucesso"


def test_filtrar_despesas_por_mes():
    headers = obter_headers_auth()

    response = client.get(
        "/despesas?mes=2026-09",
        headers=headers
    )

    assert response.status_code == 200

    despesas = response.json()

    for despesa in despesas:
        assert despesa["data"].startswith("2026-09")


def test_filtrar_receitas_por_mes():
    headers = obter_headers_auth()

    response = client.get(
        "/receitas?mes=2026-09",
        headers=headers
    )

    assert response.status_code == 200

    receitas = response.json()

    for receita in receitas:
        assert receita["data"].startswith("2026-09")


def test_resumo_mensal():
    headers = obter_headers_auth()

    response = client.get(
        "/resumo-mensal",
        headers=headers
    )

    assert response.status_code == 200

    resumo = response.json()

    assert isinstance(resumo, list)

    for item in resumo:
        assert "mes" in item
        assert "receitas" in item
        assert "despesas" in item

def test_login_com_senha_incorreta():
    client.post(
        "/usuarios",
        json={
            "nome": "Usuario Login",
            "email": "login@teste.com",
            "senha": "teste123"
        }
    )

    response = client.post(
        "/login",
        json={
            "email": "login@teste.com",
            "senha": "senha-errada"
        }
    )

    assert response.status_code == 401


def test_endpoint_protegido_sem_token():
    response = client.get("/despesas")

    assert response.status_code in (401, 403)


def test_isolamento_entre_usuarios():
    # Usuário 1
    client.post(
        "/usuarios",
        json={
            "nome": "Usuario Um",
            "email": "usuario1@teste.com",
            "senha": "teste123"
        }
    )

    login_1 = client.post(
        "/login",
        json={
            "email": "usuario1@teste.com",
            "senha": "teste123"
        }
    )

    token_1 = login_1.json()["access_token"]

    headers_1 = {
        "Authorization": f"Bearer {token_1}"
    }

    # Usuário 2
    client.post(
        "/usuarios",
        json={
            "nome": "Usuario Dois",
            "email": "usuario2@teste.com",
            "senha": "teste123"
        }
    )

    login_2 = client.post(
        "/login",
        json={
            "email": "usuario2@teste.com",
            "senha": "teste123"
        }
    )

    token_2 = login_2.json()["access_token"]

    headers_2 = {
        "Authorization": f"Bearer {token_2}"
    }

    # Usuário 1 cria uma despesa
    criada = client.post(
        "/despesas",
        json={
            "descricao": "Despesa privada",
            "valor": 999,
            "categoria": "Teste",
            "data": "2026-09-07"
        },
        headers=headers_1
    )

    assert criada.status_code == 200

    despesa_id = criada.json()["id"]

    # Usuário 2 lista suas despesas
    despesas_usuario_2 = client.get(
        "/despesas",
        headers=headers_2
    )

    assert despesas_usuario_2.status_code == 200

    ids_usuario_2 = [
        despesa["id"]
        for despesa in despesas_usuario_2.json()
    ]

    assert despesa_id not in ids_usuario_2

    # Usuário 2 tenta excluir despesa do usuário 1
    excluir = client.delete(
        f"/despesas/{despesa_id}",
        headers=headers_2
    )

    assert excluir.status_code == 404