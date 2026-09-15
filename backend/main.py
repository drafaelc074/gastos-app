from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import Base
from routers.despesas import router as despesas_router
from routers.receitas import router as receitas_router
from routers.resumo import router as resumo_router
from routers.usuarios import router as usuarios_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Gastos App API",
    version="1.0.0"
)


app.include_router(despesas_router)
app.include_router(receitas_router)
app.include_router(resumo_router)
app.include_router(usuarios_router)


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