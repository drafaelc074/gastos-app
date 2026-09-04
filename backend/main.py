from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from datetime import date
from sqlalchemy.orm import Session
from datetime import date
from database import SessionLocal, engine
from models import Base, DespesaDB, ReceitaDB
from fastapi import HTTPException

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Gastos App API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Despesa(BaseModel):
    descricao: str
    valor: float
    categoria: str
    data: date


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():

    return {
        "status": "online",
        "message": "API do Gastos App funcionando!"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/despesas")
def criar_despesa(
    despesa: Despesa,
    db: Session = Depends(get_db)
):

    nova_despesa = DespesaDB(
        descricao=despesa.descricao,
        valor=despesa.valor,
        categoria=despesa.categoria,
        data=despesa.data
    )

    db.add(nova_despesa)
    db.commit()
    db.refresh(nova_despesa)

    return nova_despesa


@app.get("/despesas")
def listar_despesas(
    mes: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(DespesaDB)

    if mes:
        ano, numero_mes = map(int, mes.split("-"))

        inicio = date(ano, numero_mes, 1)

        if numero_mes == 12:
            fim = date(ano + 1, 1, 1)
        else:
            fim = date(ano, numero_mes + 1, 1)

        query = query.filter(
            DespesaDB.data >= inicio,
            DespesaDB.data < fim
        )

    return query.all()

@app.put("/despesas/{despesa_id}")
def atualizar_despesa(
    despesa_id: int,
    despesa: Despesa,
    db: Session = Depends(get_db)
):
    despesa_db = (
        db.query(DespesaDB)
        .filter(DespesaDB.id == despesa_id)
        .first()
    )

    if not despesa_db:
        raise HTTPException(
            status_code=404,
            detail="Despesa não encontrada"
        )

    despesa_db.descricao = despesa.descricao
    despesa_db.valor = despesa.valor
    despesa_db.categoria = despesa.categoria
    despesa_db.data = despesa.data

    db.commit()
    db.refresh(despesa_db)

    return despesa_db


@app.delete("/despesas/{despesa_id}")
def excluir_despesa(
    despesa_id: int,
    db: Session = Depends(get_db)
):
    despesa_db = (
        db.query(DespesaDB)
        .filter(DespesaDB.id == despesa_id)
        .first()
    )

    if not despesa_db:
        raise HTTPException(
            status_code=404,
            detail="Despesa não encontrada"
        )

    db.delete(despesa_db)
    db.commit()

    return {
        "message": "Despesa excluída com sucesso"
    }

class Receita(BaseModel):
    descricao: str
    valor: float
    categoria: str
    data: date


@app.post("/receitas")
def criar_receita(
    receita: Receita,
    db: Session = Depends(get_db)
):
    nova_receita = ReceitaDB(
        descricao=receita.descricao,
        valor=receita.valor,
        categoria=receita.categoria,
        data=receita.data
    )

    db.add(nova_receita)
    db.commit()
    db.refresh(nova_receita)

    return nova_receita


@app.get("/receitas")
def listar_receitas(
    mes: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(ReceitaDB)

    if mes:
        ano, numero_mes = map(int, mes.split("-"))

        inicio = date(ano, numero_mes, 1)

        if numero_mes == 12:
            fim = date(ano + 1, 1, 1)
        else:
            fim = date(ano, numero_mes + 1, 1)

        query = query.filter(
            ReceitaDB.data >= inicio,
            ReceitaDB.data < fim
        )

    return query.all()

@app.put("/receitas/{receita_id}")
def editar_receita(
    receita_id: int,
    receita: Receita,
    db: Session = Depends(get_db)
):
    receita_db = db.query(ReceitaDB).filter(
        ReceitaDB.id == receita_id
    ).first()

    if not receita_db:
        raise HTTPException(
            status_code=404,
            detail="Receita não encontrada"
        )

    receita_db.descricao = receita.descricao
    receita_db.valor = receita.valor
    receita_db.categoria = receita.categoria
    receita_db.data = receita.data

    db.commit()
    db.refresh(receita_db)

    return receita_db


@app.delete("/receitas/{receita_id}")
def excluir_receita(
    receita_id: int,
    db: Session = Depends(get_db)
):
    receita_db = db.query(ReceitaDB).filter(
        ReceitaDB.id == receita_id
    ).first()

    if not receita_db:
        raise HTTPException(
            status_code=404,
            detail="Receita não encontrada"
        )

    db.delete(receita_db)
    db.commit()

    return {
        "message": "Receita excluída com sucesso"
    }

@app.get("/resumo-mensal")
def resumo_mensal(
    db: Session = Depends(get_db)
):
    receitas = db.query(ReceitaDB).all()
    despesas = db.query(DespesaDB).all()

    meses = {}

    for receita in receitas:
        mes = receita.data.strftime("%Y-%m")

        meses.setdefault(
            mes,
            {"mes": mes, "receitas": 0, "despesas": 0}
        )

        meses[mes]["receitas"] += receita.valor

    for despesa in despesas:
        mes = despesa.data.strftime("%Y-%m")

        meses.setdefault(
            mes,
            {"mes": mes, "receitas": 0, "despesas": 0}
        )

        meses[mes]["despesas"] += despesa.valor

    return sorted(
        meses.values(),
        key=lambda item: item["mes"]
    )