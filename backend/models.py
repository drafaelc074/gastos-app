from sqlalchemy import Column, Integer, String, Float, Date
from database import Base


class DespesaDB(Base):
    __tablename__ = "despesas"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String, nullable=False)
    valor = Column(Float, nullable=False)
    categoria = Column(String, nullable=False)
    data = Column(Date, nullable=False)


class ReceitaDB(Base):
    __tablename__ = "receitas"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String, nullable=False)
    valor = Column(Float, nullable=False)
    categoria = Column(String, nullable=False)
    data = Column(Date, nullable=False)