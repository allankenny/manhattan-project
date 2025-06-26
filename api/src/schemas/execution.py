from typing import List
from pydantic import BaseModel, Field

from src.schemas.common import BrandBase, EvidenceBase, IndustryBase, ProductBase, PromoterBase, StoreBase


class ExecutionResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    date: str
    industry: IndustryBase
    store: StoreBase
    promoter: PromoterBase

    class Config:
        populate_by_name = True
        from_attributes = True


class ExecutionProductDetail(BaseModel):
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
    product: ProductBase

    class Config:
        populate_by_name = True
        from_attributes = True


class ExecutionBrandDetail(BaseModel):
    faces_promoter: int | None
    faces_ir: int | None
    faces_gemini_2_5_flash: int | None
    faces_gemini_2_5_pro: int | None
    faces_audited: int | None
    brand: BrandBase

    class Config:
        populate_by_name = True
        from_attributes = True


class ExecutionDetailResponse(ExecutionResponse):
    brands: List[ExecutionBrandDetail]
    products: List[ExecutionProductDetail]
    evidences: List[EvidenceBase]

    class Config:
        populate_by_name = True
        from_attributes = True


class ProcessExecutionResponse(BaseModel):
    execution_id: str

    class Config:
        populate_by_name = True
        from_attributes = True


class AuditBrandRequest(BaseModel):
    brand_id: str
    faces: int


class AuditProductRequest(BaseModel):
    product_id: str
    faces: int
    price: float
