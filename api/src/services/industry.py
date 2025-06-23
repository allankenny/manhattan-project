from dataclasses import dataclass
from typing import List

from src.db import models
from src.utils.promo_api import PromoAPI


@dataclass
class IndustryService:

    promo_api: PromoAPI

    async def save_brands(self, brands_api: list) -> List[models.Brand]:
        brand_api_ids = {b.get("id") for b in brands_api}
        category_api_ids = {b.get("category", {}).get("id") for b in brands_api}

        brands_db_map = {b.id: b for b in await models.Brand.find({"_id": {"$in": list(brand_api_ids)}}).to_list()}
        categories_db_map = {c.id: c for c in await models.Category.find({"_id": {"$in": list(category_api_ids)}}).to_list()}

        categories_to_insert = []
        brands_to_insert = []

        brands_db_ids = set(brands_db_map.keys())
        categories_db_ids = set(categories_db_map.keys())

        for brand_api in brands_api:
            category_api = brand_api.get("category")
            if category_api and category_api.get("id") not in categories_db_ids:
                category_db = models.Category(id=category_api.get("id"), name=category_api.get("name"))
                categories_to_insert.append(category_db)
                categories_db_ids.add(category_api.get("id"))
                categories_db_map[category_api.get("id")] = category_db

        if categories_to_insert:
            await models.Category.insert_many(categories_to_insert)

        for brand_api in brands_api:
            if brand_api and brand_api.get("id") not in brands_db_ids:
                category_id = brand_api.get("category", {}).get("id")
                category_db = categories_db_map.get(category_id)
                if category_db:
                    brand_db = models.Brand(id=brand_api.get("id"), name=brand_api.get("name"), category=category_db)
                    brands_to_insert.append(brand_db)
                    brands_db_ids.add(brand_api.get("id"))
                    brands_db_map[brand_api.get("id")] = brand_db

        if brands_to_insert:
            await models.Brand.insert_many(brands_to_insert)

        return brands_db_map.values()

    async def save_products(self, products_api: list) -> List[models.Product]:
        product_api_ids = {p.get("id") for p in products_api}
        segment_api_ids = {p.get("segment", {}).get("id") for p in products_api}
        brand_api_ids = {p.get("segment", {}).get("brand", {}).get("id") for p in products_api}
        category_api_ids = {p.get("segment", {}).get("brand", {}).get("category", {}).get("id") for p in products_api}

        products_db_map = {p.id: p for p in await models.Product.find({"_id": {"$in": list(product_api_ids)}}).to_list()}
        segments_db_map = {s.id: s for s in await models.Segment.find({"_id": {"$in": list(segment_api_ids)}}).to_list()}
        brands_db_map = {b.id: b for b in await models.Brand.find({"_id": {"$in": list(brand_api_ids)}}).to_list()}
        categories_db_map = {c.id: c for c in await models.Category.find({"_id": {"$in": list(category_api_ids)}}).to_list()}

        categories_to_insert = []
        brands_to_insert = []
        segments_to_insert = []
        products_to_insert = []

        products_db_ids = set(products_db_map.keys())
        segments_db_ids = set(segments_db_map.keys())
        brands_db_ids = set(brands_db_map.keys())
        categories_db_ids = set(categories_db_map.keys())

        for product_api in products_api:
            category_api = product_api.get("segment", {}).get("brand", {}).get("category")
            if category_api and category_api.get("id") not in categories_db_ids:
                category_db = models.Category(id=category_api.get("id"), name=category_api.get("name"))
                categories_to_insert.append(category_db)
                categories_db_ids.add(category_api.get("id"))
                categories_db_map[category_api.get("id")] = category_db

        if categories_to_insert:
            await models.Category.insert_many(categories_to_insert)

        for product_api in products_api:
            brand_api = product_api.get("segment", {}).get("brand")
            if brand_api and brand_api.get("id") not in brands_db_ids:
                category_id = brand_api.get("category", {}).get("id")
                category_db = categories_db_map.get(category_id)
                if category_db:
                    brand_db = models.Brand(id=brand_api.get("id"), name=brand_api.get("name"), category=category_db)
                    brands_to_insert.append(brand_db)
                    brands_db_ids.add(brand_api.get("id"))
                    brands_db_map[brand_api.get("id")] = brand_db

        if brands_to_insert:
            await models.Brand.insert_many(brands_to_insert)

        for product_api in products_api:
            segment_api = product_api.get("segment")
            if segment_api and segment_api.get("id") not in segments_db_ids:
                brand_id = segment_api.get("brand", {}).get("id")
                brand_db = brands_db_map.get(brand_id)
                if brand_db:
                    segment_db = models.Segment(id=segment_api.get("id"), name=segment_api.get("name"), brand=brand_db)
                    segments_to_insert.append(segment_db)
                    segments_db_ids.add(segment_api.get("id"))
                    segments_db_map[segment_api.get("id")] = segment_db

        if segments_to_insert:
            await models.Segment.insert_many(segments_to_insert)

        for product_api in products_api:
            if product_api.get("id") not in products_db_ids:
                segment_id = product_api.get("segment", {}).get("id")
                segment_db = segments_db_map.get(segment_id)
                if segment_db:
                    product_db = models.Product(
                        id=product_api.get("id"),
                        name=product_api.get("name"),
                        ean=product_api.get("ean"),
                        image_url=product_api.get("image"),
                        description=None,
                        segment=segment_db,
                    )
                    products_to_insert.append(product_db)
                    products_db_ids.add(product_api.get("id"))
                    products_db_map[product_api.get("id")] = product_db

        if products_to_insert:
            await models.Product.insert_many(products_to_insert)

        return products_db_map.values()
