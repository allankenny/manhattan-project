import uuid
import pymongo
from typing import List
from pydantic import Field
from beanie import Document, Link


class Category(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str

    class Settings:
        name = "categories"
        indexes = [[("name", pymongo.ASCENDING)], pymongo.IndexModel([("name", pymongo.TEXT)])]


class Brand(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    category: Link[Category]

    class Settings:
        name = "brands"
        indexes = [[("name", pymongo.ASCENDING)], pymongo.IndexModel([("name", pymongo.TEXT)])]


class Segment(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    brand: Link[Brand]

    class Settings:
        name = "segments"
        indexes = [[("name", pymongo.ASCENDING)], pymongo.IndexModel([("name", pymongo.TEXT)])]


class Product(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    ean: str
    image_url: str | None
    description: str | None
    segment: Link[Segment]

    class Settings:
        name = "products"
        indexes = [[("name", pymongo.ASCENDING)], pymongo.IndexModel([("name", pymongo.TEXT)]), pymongo.IndexModel([("ean", pymongo.ASCENDING)], unique=True)]


class ExecutionProduct(Document):
    faces_promoter: int | None
    faces_ir: int | None
    faces_gemini_2_5_flash: int | None
    faces_gemini_2_5_pro: int | None
    faces_audited: int | None
    price_promoter: float | None
    price_ir: float | None
    price_gemini_2_5_flash: float | None
    price_gemini_2_5_pro: float | None
    price_audited: float | None
    product: Link[Product]

    class Settings:
        name = "execution_products"
        indexes = [[("price", pymongo.ASCENDING)]]


class ExecutionBrand(Document):
    faces_promoter: int | None
    faces_ir: int | None
    faces_gemini_2_5_flash: int | None
    faces_gemini_2_5_pro: int | None
    faces_audited: int | None
    brand: Link[Brand]

    class Settings:
        name = "execution_brands"


class ExecutionEvidence(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    url: str

    class Settings:
        name = "execution_evidences"
        indexes = [pymongo.IndexModel([("url", pymongo.TEXT)])]


class Industry(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str

    class Settings:
        name = "industries"
        indexes = [pymongo.IndexModel([("name", pymongo.TEXT)])]


class Promoter(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    username: str

    class Settings:
        name = "promoters"
        indexes = [pymongo.IndexModel([("username", pymongo.TEXT)])]


class Store(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    cnpj: str

    class Settings:
        name = "stores"
        indexes = [pymongo.IndexModel([("name", pymongo.TEXT)])]


class Execution(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    date: str
    industry: Link[Industry]
    promoter: Link[Promoter]
    store: Link[Store]
    brands: List[Link[ExecutionBrand]]
    products: List[Link[ExecutionProduct]]
    evidences: List[Link[ExecutionEvidence]]

    class Settings:
        name = "executions"
        indexes = [pymongo.IndexModel([("name", pymongo.TEXT)])]
