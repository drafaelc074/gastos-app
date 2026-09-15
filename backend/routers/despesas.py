from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_usuario_atual
from database import get_db
from models import DespesaDB, UsuarioDB
from schemas import Despesa


router = APIRouter(
    prefix="/despesas",
    tags=["despesas"],
)


@router.post("")
def criar_despesa(
    despesa: Despesa,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_usuario_atual)
):
    nova_despesa = DespesaDB(
        descricao=despesa.descricao,
        valor=despesa.valor,
        categoria=despesa.categoria,
        data=despesa.data,
        usuario_id=usuario.id
    )

    db.add(nova_despesa)
    db.commit()
    db.refresh(nova_despesa)

    return nova_despesa


@router.get("")
def listar_despesas(
    mes: str | None = None,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_usuario_atual)
):
    query = (
        db.query(DespesaDB)
        .filter(DespesaDB.usuario_id == usuario.id)
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
            DespesaDB.data >= inicio,
            DespesaDB.data < fim
        )

    return query.all()


@router.put("/{despesa_id}")
def atualizar_despesa(
    despesa_id: int,
    despesa: Despesa,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_usuario_atual)
):
    despesa_db = (
        db.query(DespesaDB)
        .filter(
            DespesaDB.id == despesa_id,
            DespesaDB.usuario_id == usuario.id
        )
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


@router.delete("/{despesa_id}")
def excluir_despesa(
    despesa_id: int,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_usuario_atual)
):
    despesa_db = (
        db.query(DespesaDB)
        .filter(
            DespesaDB.id == despesa_id,
            DespesaDB.usuario_id == usuario.id
        )
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