from src.db import db
from src.utils.promo import Promo


def get_promo() -> Promo:
    global promo_instance
    promo_instance = None
    if not promo_instance:
        promo_instance = Promo()
    return promo_instance


def get_mongo_db() -> db.AsyncIOMotorDatabase:
    return db.get_db()
