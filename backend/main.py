from fastapi import FastAPI, Depends
from pydantic import BaseModel
from datetime import date
from sqlalchemy.orm import Session

from database import SessionLocal, engine
from models import Base, DespesaDB


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Gastos App API",
    version="1.0.0"
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