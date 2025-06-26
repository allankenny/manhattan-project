import json
import aiohttp
from typing import Annotated, List
from beanie import WriteRules
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status

from src.crews.products_analyzer_crew import ProductAnalyzerCrew
from src.schemas.execution import AuditBrandRequest, AuditProductRequest, ExecutionDetailResponse, ExecutionResponse, ProcessExecutionResponse
from src.db.models import Execution, ExecutionBrand, ExecutionEvidence, ExecutionProduct
from src.dependencies import get_execution_service, get_industry_service, get_promo_api
from src.services.execution import ExecutionService
from src.services.industry import IndustryService
from src.utils.image import url_image_to_base64
from src.utils.promo_api import PromoAPI
from src.utils.llm import get_product_description, process_images


router = APIRouter(prefix="/executions")


@router.get("/", response_model=List[ExecutionResponse])
async def get_all(
    skip: int = Query(0, ge=0, description="Number of records to jump"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of records to return"),
):
    return await Execution.find(fetch_links=True, nesting_depth=1).project(ExecutionResponse).skip(skip).limit(limit).to_list()


@router.get("/{execution_id}", response_model=ExecutionDetailResponse)
async def get_by_id(execution_id: str):
    if execution := await Execution.find(Execution.id == execution_id, fetch_links=True).project(ExecutionDetailResponse).first_or_none():
        return execution
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)


@router.post("/master-data/sync/by-name/{execution_name}")
async def sync_by_name(
    execution_name: str,
    industry_service: Annotated[IndustryService, Depends(get_industry_service)],
    promo_api: Annotated[PromoAPI, Depends(get_promo_api)],
):
    execution = await promo_api.get_execution_by_name(execution_name)
    await industry_service.save_brands(execution.get("brands", []))
    await industry_service.save_products(execution.get("products", []))
    return {"synchronized": True}


@router.post("/process/by-name/{execution_name}")
async def process_execution_by_name(
    execution_name: str,
    execution_service: Annotated[ExecutionService, Depends(get_execution_service)],
):
    if execution := await Execution.find(Execution.name == execution_name, fetch_links=True).first_or_none():
        await ExecutionBrand.find_many({"_id": {"$in": [eb.id for eb in execution.brands]}}).delete_many()
        await ExecutionProduct.find_many({"_id": {"$in": [ep.id for ep in execution.products]}}).delete_many()
        await ExecutionEvidence.find_many({"_id": {"$in": [ee.id for ee in execution.evidences]}}).delete_many()
        await execution.delete()

    execution = await execution_service.create_execution_from_name(execution_name)

    await execution.fetch_all_links()
    return ProductAnalyzerCrew().process_execution(execution)

    images_base64 = list()

    for evidence in execution.evidences:
        images_base64.append(await url_image_to_base64(evidence.url))

    brands = [dict(brand_id=execution_brand.brand.id, brand_name=execution_brand.brand.name) for execution_brand in execution.brands]
    products = [
        dict(
            product_id=execution_product.product.id,
            product_name=execution_product.product.name,
            product_description=execution_product.product.description,
            brand_id=execution_product.product.segment.brand.id,
            brand_name=execution_product.product.segment.brand.name,
        )
        for execution_product in execution.products
    ]

    if execution.brands and execution.brands[0].brand.category.id == "b77a471e-1f75-4770-b6ae-ede023cb08f9" and False:  # Santher Fraldas
        result = await process_images(images_base64, brands, products, "santher_fraldas", 1.5)
    else:
        result = await process_images(images_base64, brands, products)

    for brand in result["parsed"]["brands"]:
        for exec_brand in execution.brands:
            if exec_brand.brand.id == brand["brand_id"]:
                exec_brand.faces_manhattan = brand["fronts"]

    for product in result["parsed"]["products"]:
        for exec_product in execution.products:
            if exec_product.product.id == product["product_id"]:
                exec_product.faces_manhattan = product["fronts"]
                exec_product.price_manhattan = product["price"]

    await execution.save(link_rule=WriteRules.WRITE)
    return dict(execution_id=execution.id)


@router.post("/{execution_id}/audit/brands", response_model=ExecutionDetailResponse)
async def audit_brands(audited_brands: List[AuditBrandRequest], execution_id: str):
    execution = await Execution.find(Execution.id == execution_id, fetch_links=True).first_or_none()
    if not execution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    for exec_brand in execution.brands:
        for audited_brand in audited_brands:
            if exec_brand.brand.id == audited_brand.brand_id:
                exec_brand.faces_audited = audited_brand.faces
    await execution.save(link_rule=WriteRules.WRITE)
    return execution


@router.post("/{execution_id}/audit/products", response_model=ExecutionDetailResponse)
async def audit_brands(audited_products: List[AuditProductRequest], execution_id: str):
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
