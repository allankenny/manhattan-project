from typing import Annotated, List
from beanie import WriteRules
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from src.db.models import Execution
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
    faces_promoter: int | None
    faces_ir: int | None
    faces_manhattan: int | None
    faces_audited: int | None
    price_promoter: float | None
    price_ir: float | None
    price_manhattan: float | None
    price_audited: float | None
    product: ProductSchema

    class Config:
        populate_by_name = True


class ExecutionBrandSchema(BaseModel):
    faces_promoter: int | None
    faces_ir: int | None
    faces_manhattan: int | None
    faces_audited: int | None
    brand: BrandSchema

    class Config:
        populate_by_name = True


class EvidenceSchema(BaseModel):
    id: str = Field(..., alias="_id")
    url: str

    class Config:
        populate_by_name = True


class DetailedExecutionSchema(ExecutionSchema):
    brands: List[ExecutionBrandSchema]
    products: List[ExecutionProductSchema]
    evidences: List[EvidenceSchema]

    class Config:
        populate_by_name = True


class ProcessByNameResponseModel(BaseModel):
    execution_id: str


class AuditBrandSchema(BaseModel):
    brand_id: str
    faces: int


class AuditProductSchema(BaseModel):
    product_id: str
    faces: int
    price: float


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
async def process_execution_by_name(name: str, promo: Annotated[Promo, Depends(get_promo)], background_tasks: BackgroundTasks):
    # background_tasks.add_task()
    _execution = await promo.get_execution_by_name_and_save_to_db(name)
    images_base64 = list()

    for evidence in _execution.evidences:
        images_base64.append(await url_image_to_base64(evidence.url))

    brands = [dict(brand_id=execution_brand.brand.id, brand_name=execution_brand.brand.name) for execution_brand in _execution.brands]
    products = [
        dict(
            product_id=execution_product.product.id,
            product_name=execution_product.product.name,
            brand_id=execution_product.product.segment.brand.id,
            brand_name=execution_product.product.segment.brand.name,
        )
        for execution_product in _execution.products
    ]

    result = await process_images(images_base64, brands, products)

    for brand in result["parsed"]["brands"]:
        for exec_brand in _execution.brands:
            if exec_brand.brand.id == brand["brand_id"]:
                exec_brand.faces_manhattan = brand["fronts"]

    for product in result["parsed"]["products"]:
        for exec_product in _execution.products:
            if exec_product.product.id == product["product_id"]:
                exec_product.faces_manhattan = product["fronts"]
                exec_product.price_manhattan = product["price"]

    await _execution.save(link_rule=WriteRules.WRITE)
    return dict(execution_id=_execution.id)


@router.post("/{execution_id}/audit/brands", response_model=DetailedExecutionSchema)
async def audit_brands(audited_brands: List[AuditBrandSchema], execution_id: str):
    execution = await Execution.find(Execution.id == execution_id, fetch_links=True).first_or_none()
    if not execution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    for exec_brand in execution.brands:
        for audited_brand in audited_brands:
            if exec_brand.brand.id == audited_brand.brand_id:
                exec_brand.faces_audited = audited_brand.faces
    await execution.save(link_rule=WriteRules.WRITE)
    return execution


@router.post("/{execution_id}/audit/products", response_model=DetailedExecutionSchema)
async def audit_brands(audited_products: List[AuditProductSchema], execution_id: str):
    execution = await Execution.find(Execution.id == execution_id, fetch_links=True).first_or_none()
    if not execution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    for exec_product in execution.products:
        for audited_product in audited_products:
            if exec_product.product.id == audited_product.product_id:
                exec_product.faces_audited = audited_product.faces
                exec_product.price_audited = audited_product.price
    await execution.save(link_rule=WriteRules.WRITE)
    return execution
