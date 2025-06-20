from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from settings import settings

from src.db import models


async def init_db():
    global mongo_client_instance
    global mongo_db_instance
    mongo_client_instance = AsyncIOMotorClient(settings.mongo_db_url)
    mongo_db_instance = mongo_client_instance.manhattan

    await init_beanie(
        database=mongo_db_instance,
        document_models=[
            models.Promoter,
            models.Industry,
            models.Store,
            models.Execution,
            models.ExecutionEvidence,
            models.ExecutionProduct,
            models.ExecutionBrand,
            models.Product,
            models.Segment,
            models.Brand,
            models.Category,
        ],
    )


def get_client() -> AsyncIOMotorClient:
    global mongo_client_instance
    return mongo_client_instance


def get_db() -> AsyncIOMotorDatabase:
    global mongo_db_instance
    return mongo_db_instance
