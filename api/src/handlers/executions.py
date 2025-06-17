from typing import Annotated, List
from beanie import WriteRules
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from src.db.models import Brand, Category, Execution, ExecutionBrand, ExecutionProduct, Product, Segment
from src.dependencies import get_promo
from src.utils.image import url_image_to_base64
from src.utils.promo import Promo
from src.utils.ai import process_images


router = APIRouter(prefix="/executions")


class ExecutionSchema(BaseModel):
    id: str = Field(..., alias="_id")
    name: str

    class Config:
        populate_by_name = True


class CategorySchema(BaseModel):
    id: str = Field(..., alias="_id")
    name: str

    class Config:
        populate_by_name = True


class BrandSchema(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    category: CategorySchema

    class Config:
        populate_by_name = True


class SegmentSchema(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    # brand: BrandSchema

    class Config:
        populate_by_name = True


class ProductSchema(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    ean: str
    image_url: str | None
    segment: SegmentSchema

    class Config:
        populate_by_name = True


class ExecutionProductSchema(BaseModel):
    faces: int
    price: float
    product: ProductSchema

    class Config:
        populate_by_name = True


class ExecutionBrandSchema(BaseModel):
    faces: int
    brand: BrandSchema

    class Config:
        populate_by_name = True

class EvidenceSchema(BaseModel):
    id: str = Field(..., alias="_id")
    url: str

    class Config:
        populate_by_name = True


class DetailedExecutionSchema(ExecutionSchema):
    products_promoter: List[ExecutionProductSchema]
    products_ir: List[ExecutionProductSchema]
    products_manhattan: List[ExecutionProductSchema]
    brands_promoter: List[ExecutionBrandSchema]
    brands_ir: List[ExecutionBrandSchema]
    brands_manhattan: List[ExecutionBrandSchema]
    evidences: List[EvidenceSchema]

    class Config:
        populate_by_name = True


class ProcessByNameResponseModel(BaseModel):
    execution_id: str


@router.get("/", response_model=List[ExecutionSchema])
async def get_all(
    skip: int = Query(0, ge=0, description="Number of records to jump"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of records to return"),
):
    return await Execution.find_all().project(ExecutionSchema).skip(skip).limit(limit).to_list()


@router.get("/{execution_id}", response_model=DetailedExecutionSchema)
async def get_by_id(execution_id: str):
    if execution := await Execution.find(Execution.id == execution_id, fetch_links=True).project(DetailedExecutionSchema).first_or_none():
        return execution
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)


@router.post("/process/by-name/{name}", response_model=ProcessByNameResponseModel)
async def process_execution_by_name(name: str, promo: Annotated[Promo, Depends(get_promo)]):
    execution = await promo.get_execution_by_name(name)
    images_base64 = list()

    brands_promoter = list()
    brands_ir = list()
    products_promoter = list()
    products_ir = list()

    for promo_brand in execution["brands"]:
        category = Category(id=promo_brand["category"]["id"], name=promo_brand["category"]["name"])
        brand = Brand(id=promo_brand["id"], name=promo_brand["name"], category=category)
        brands_promoter.append(ExecutionBrand(brand=brand, faces=promo_brand["faces"]))
        brands_ir.append(ExecutionBrand(brand=brand, faces=promo_brand["faces_ir"]))

    for promo_product in execution["products"]:
        category = Category(id=promo_product["segment"]["brand"]["category"]["id"], name=promo_product["segment"]["brand"]["category"]["name"])
        brand = Brand(id=promo_product["segment"]["brand"]["id"], name=promo_product["segment"]["brand"]["name"], category=category)
        segment = Segment(id=promo_product["segment"]["id"], name=promo_product["segment"]["name"], brand=brand)
        product = Product(id=promo_product["id"], name=promo_product["name"], ean=promo_product["ean"], image_url=promo_product['image_url'], segment=segment)
        products_promoter.append(ExecutionProduct(faces=promo_product["fronts"], price=promo_product["price"], product=product))
        products_ir.append(ExecutionProduct(faces=promo_product["fronts_ir"], price=promo_product["price_ir"], product=product))

    _execution = Execution(
        id=execution["id"],
        name=execution["name"],
        products_promoter=products_promoter,
        products_ir=products_ir,
        products_manhattan=[],
        products_audited=[],
        brands_promoter=brands_promoter,
        brands_ir=brands_ir,
        brands_audited=[],
        brands_manhattan=[],
        evidences=execution['evidences'],

    )
    await _execution.save(link_rule=WriteRules.WRITE)

    for evidence in execution["evidences"]:
        images_base64.append(await url_image_to_base64(evidence["url"]))

    brands = execution["brands"]
    products = [
        dict(
            product_id=product["id"],
            product_name=product["name"],
            brand_id=product["segment"]["brand"]["id"],
            brand_name=product["segment"]["brand"]["name"],
        )
        for product in execution["products"]
    ]

    result = await process_images(images_base64, brands, products)

    for brand in result["parsed"]["brands"]:
        _execution.brands_manhattan.append(ExecutionBrand(faces=brand["fronts"], brand=brand["brand_id"]))

    for product in result["parsed"]["products"]:
        _execution.products_manhattan.append(ExecutionProduct(faces=product["fronts"], price=product["price"], product=product["product_id"]))

    await _execution.save(link_rule=WriteRules.WRITE)
    return dict(execution_id=execution["id"])
