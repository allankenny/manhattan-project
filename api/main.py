from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager

from src.db import db
from src.handlers.executions import router as executions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.init_db()
    yield
    client = db.get_client()
    client.close()


app = FastAPI(lifespan=lifespan)
app.include_router(executions_router)
