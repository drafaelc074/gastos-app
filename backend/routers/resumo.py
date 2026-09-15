from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_usuario_atual
from database import get_db
from models import DespesaDB, ReceitaDB, UsuarioDB


router = APIRouter(
    tags=["resumo"],
)


@router.get("/resumo-mensal")
def resumo_mensal(
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_usuario_atual)
):
    receitas = (
        db.query(ReceitaDB)
        .filter(ReceitaDB.usuario_id == usuario.id)
        .all()
    )

    despesas = (
        db.query(DespesaDB)
        .filter(DespesaDB.usuario_id == usuario.id)
        .all()
    )

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