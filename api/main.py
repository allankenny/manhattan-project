from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from src.db import db
from src.handlers.execution import router as execution_router
from src.handlers.industry import router as industry_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.init_db()
    yield
    client = db.get_client()
    client.close()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(execution_router)
app.include_router(industry_router)
