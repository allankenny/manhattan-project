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
    segment: Link[Segment]

    class Settings:
        name = "products"
        indexes = [[("name", pymongo.ASCENDING)], pymongo.IndexModel([("name", pymongo.TEXT)]), pymongo.IndexModel([("ean", pymongo.ASCENDING)], unique=True)]


class ExecutionProduct(Document):
    faces: int
    price: float | None
    product: Link[Product]

    class Settings:
        name = "execution_products"
        indexes = [[("price", pymongo.ASCENDING)]]


class ExecutionBrand(Document):
    faces: int
    brand: Link[Brand]

    class Settings:
        name = "execution_brands"


class Execution(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    brands_promoter: List[Link[ExecutionBrand]]
    brands_ir: List[Link[ExecutionBrand]]
    brands_manhattan: List[Link[ExecutionBrand]]
    brands_audited: List[Link[ExecutionBrand]]
    products_promoter: List[Link[ExecutionProduct]]
    products_ir: List[Link[ExecutionProduct]]
    products_manhattan: List[Link[ExecutionProduct]]
    products_audited: List[Link[ExecutionProduct]]

    class Settings:
        name = "executions"
        indexes = [pymongo.IndexModel([("name", pymongo.TEXT)])]
