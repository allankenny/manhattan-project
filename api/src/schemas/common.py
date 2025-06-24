from pydantic import BaseModel, Field


class IndustryBase(BaseModel):
    id: str = Field(..., alias="_id")
    name: str

    class Config:
        populate_by_name = True
        from_attributes = True


class StoreBase(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    cnpj: str

    class Config:
        populate_by_name = True
        from_attributes = True


class PromoterBase(BaseModel):
    id: str = Field(..., alias="_id")
    username: str

    class Config:
        populate_by_name = True
        from_attributes = True


class CategoryBase(BaseModel):
    id: str = Field(..., alias="_id")
    name: str

    class Config:
        populate_by_name = True
        from_attributes = True


class BrandBase(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    category: CategoryBase

    class Config:
        populate_by_name = True
        from_attributes = True


class SegmentBase(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    # brand: BrandBase

    class Config:
        populate_by_name = True
        from_attributes = True


class ProductBase(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    description: str | None
    ean: str
    image_url: str | None
    segment: SegmentBase

    class Config:
        populate_by_name = True
        from_attributes = True


class EvidenceBase(BaseModel):
    id: str = Field(..., alias="_id")
    url: str

    class Config:
        populate_by_name = True
        from_attributes = True
