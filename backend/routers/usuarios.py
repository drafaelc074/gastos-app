from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import criar_token_acesso, get_usuario_atual, pwd_context
from database import get_db
from models import UsuarioDB
from schemas import LoginUsuario, UsuarioCriar


router = APIRouter(
    tags=["usuarios"],
)


@router.get("/me")
def usuario_logado(
    usuario: UsuarioDB = Depends(get_usuario_atual)
):
    return {
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email
    }


@router.post("/login")
def login(
    dados: LoginUsuario,
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(UsuarioDB)
        .filter(UsuarioDB.email == dados.email)
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="E-mail ou senha inválidos"
        )

    if not pwd_context.verify(
        dados.senha,
        usuario.senha_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="E-mail ou senha inválidos"
        )

    token = criar_token_acesso({
        "sub": str(usuario.id),
        "email": usuario.email
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/usuarios")
def criar_usuario(
    usuario: UsuarioCriar,
    db: Session = Depends(get_db)
):
    usuario_existente = (
        db.query(UsuarioDB)
        .filter(UsuarioDB.email == usuario.email)
        .first()
    )

    if usuario_existente:
        raise HTTPException(
            status_code=400,
            detail="E-mail já cadastrado"
        )

    senha_hash = pwd_context.hash(usuario.senha)

    novo_usuario = UsuarioDB(
        nome=usuario.nome,
        email=usuario.email,
        senha_hash=senha_hash
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return {
        "id": novo_usuario.id,
        "nome": novo_usuario.nome,
        "email": novo_usuario.email
    }