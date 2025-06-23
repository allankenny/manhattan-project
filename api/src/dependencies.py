import threading
from typing import Annotated

from fastapi import Depends
from src.db import db
from src.services.execution import ExecutionService
from src.services.industry import IndustryService
from src.utils.promo_api import PromoAPI

_promo_api_cached_instance = None
_promo_api_lock = threading.Lock()


def get_promo_api() -> PromoAPI:
    global _promo_api_cached_instance
    with _promo_api_lock:
        if _promo_api_cached_instance is None:
            _promo_api_cached_instance = PromoAPI()
    return _promo_api_cached_instance


def get_mongo_db() -> db.AsyncIOMotorDatabase:
    return db.get_db()


def get_industry_service(promo_api: Annotated[IndustryService, Depends(get_promo_api)]) -> IndustryService:
    return IndustryService(promo_api=promo_api)


def get_execution_service(
    promo_api: Annotated[PromoAPI, Depends(get_promo_api)], industry_service: Annotated[IndustryService, Depends(get_industry_service)]
) -> ExecutionService:
    return ExecutionService(promo_api=promo_api, industry_service=industry_service)
