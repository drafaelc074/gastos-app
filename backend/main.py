from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from datetime import date
from sqlalchemy.orm import Session

from database import SessionLocal, engine
from models import Base, DespesaDB
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
    db: Session = Depends(get_db)
):

    return db.query(DespesaDB).all()

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