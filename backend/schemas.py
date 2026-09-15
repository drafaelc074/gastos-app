from datetime import date

from pydantic import BaseModel


class Despesa(BaseModel):
    descricao: str
    valor: float
    categoria: str
    data: date

class LoginUsuario(BaseModel):
    email: str
    senha: str

class Receita(BaseModel):
    descricao: str
    valor: float
    categoria: str
    data: date


class UsuarioCriar(BaseModel):
    nome: str
    email: str
    senha: str