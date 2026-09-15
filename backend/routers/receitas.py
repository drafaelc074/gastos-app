from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_usuario_atual
from database import get_db
from models import ReceitaDB, UsuarioDB
from schemas import Receita


router = APIRouter(
    prefix="/receitas",
    tags=["receitas"],
)


@router.post("")
def criar_receita(
    receita: Receita,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_usuario_atual)
):
    nova_receita = ReceitaDB(
        descricao=receita.descricao,
        valor=receita.valor,
        categoria=receita.categoria,
        data=receita.data,
        usuario_id=usuario.id
    )

    db.add(nova_receita)
    db.commit()
    db.refresh(nova_receita)

    return nova_receita


@router.get("")
def listar_receitas(
    mes: str | None = None,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_usuario_atual)
):
    query = (
        db.query(ReceitaDB)
        .filter(ReceitaDB.usuario_id == usuario.id)
    )

    if mes:
        try:
            ano, numero_mes = map(int, mes.split("-"))

            if numero_mes < 1 or numero_mes > 12:
                raise ValueError

        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Formato de mês inválido. Use YYYY-MM"
            )

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


@router.put("/{receita_id}")
def editar_receita(
    receita_id: int,
    receita: Receita,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_usuario_atual)
):
    receita_db = (
        db.query(ReceitaDB)
        .filter(
            ReceitaDB.id == receita_id,
            ReceitaDB.usuario_id == usuario.id
        )
        .first()
    )

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


@router.delete("/{receita_id}")
def excluir_receita(
    receita_id: int,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_usuario_atual)
):
    receita_db = (
        db.query(ReceitaDB)
        .filter(
            ReceitaDB.id == receita_id,
            ReceitaDB.usuario_id == usuario.id
        )
        .first()
    )

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