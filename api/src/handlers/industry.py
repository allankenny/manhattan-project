from typing import Annotated
import aiohttp
from fastapi import APIRouter, Depends

from src.db.models import Product
from src.dependencies import get_industry_service
from src.services.industry import IndustryService
from src.utils.image import url_image_to_base64
from src.utils.llm import get_product_description


router = APIRouter(prefix="/industries")


@router.post("/master-data/sync/{industry_id}")
async def sync_master_data(industry_id: str, industry_service: Annotated[IndustryService, Depends(get_industry_service)]):
    await industry_service.save_products(industry_id)
    return {"synchronized": True}


@router.post("/{industry_id}/master-data/products/generate-description")
async def sync_master_data(industry_id: str, industry_service: Annotated[IndustryService, Depends(get_industry_service)]):
    products = await Product.find(Product.description == None).to_list()
    for product in products:
        if product.image_url:
            try:
                image_base64 = await url_image_to_base64(product.image_url)
            except aiohttp.client_exceptions.ClientResponseError:
                image_base64 = None
            if image_base64:
                description_output = await get_product_description(image_base64)
                product.description = description_output["parsed"]["description"]
                await product.save()

    return list(dict(_id=product.id, ean=product.ean, name=product.name, description=product.description) for product in products)
