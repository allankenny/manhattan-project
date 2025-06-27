from dataclasses import dataclass

from src.db.models import Execution, ExecutionBrand, ExecutionEvidence, ExecutionProduct, Industry, Promoter, Store
from src.services.industry import IndustryService
from src.utils.promo_api import PromoAPI


@dataclass
class ExecutionService:
    promo_api: PromoAPI
    industry_service: IndustryService

    async def create_execution_from_name(self, execution_name: str) -> Execution:
        execution_api = await self.promo_api.get_execution_by_name(execution_name)
        brands = await self.industry_service.save_brands(execution_api.get("brands", []))
        products = await self.industry_service.save_products(execution_api.get("products", []))

        execution_brands = list()
        execution_products = list()
        execution_evidences = list()

        store = await Store.find(Store.id == execution_api.get("store", {}).get("id")).first_or_none()
        industry = await Industry.find(Industry.id == execution_api.get("industry", {}).get("id")).first_or_none()
        promoter = await Promoter.find(Promoter.id == execution_api.get("promoter", {}).get("id")).first_or_none()

        if not store:
            exec_store = execution_api.get("store", {})
            store = Store(id=exec_store.get("id"), name=exec_store.get("name"), cnpj=exec_store.get("cnpj"))
            await store.save()

        if not industry:
            exec_industry = execution_api.get("industry", {})
            industry = Industry(id=exec_industry.get("id"), name=exec_industry.get("name"))
            await industry.save()

        if not promoter:
            exec_promoter = execution_api.get("promoter", {})
            promoter = Promoter(id=exec_promoter.get("id"), username=exec_promoter.get("username"))
            await promoter.save()

        for exec_evidence in execution_api.get("evidences", []):
            execution_evidences.append(ExecutionEvidence(id=exec_evidence.get("id"), url=exec_evidence.get("url")))

        for exec_brand in execution_api.get("brands", []):
            brand = next(filter(lambda b: b.id == exec_brand.get("id"), brands), None)
            execution_brands.append(
                ExecutionBrand(
                    brand=brand,
                    faces_promoter=exec_brand["faces"],
                    faces_ir=exec_brand["faces_ir"],
                    faces_gemini_2_5_flash=None,
                    faces_gemini_2_5_pro=None,
                    faces_audited=None,
                )
            )

        for exec_product in execution_api.get("products", []):
            product = next(filter(lambda p: p.id == exec_product.get("id"), products), None)
            execution_products.append(
                ExecutionProduct(
                    product=product,
                    faces_promoter=exec_product["fronts"],
                    faces_ir=exec_product["fronts_ir"],
                    faces_gemini_2_5_flash=None,
                    faces_gemini_2_5_pro=None,
                    faces_audited=None,
                    price_promoter=exec_product["price"],
                    price_ir=exec_product["price_ir"],
                    price_gemini_2_5_flash=None,
                    price_gemini_2_5_pro=None,
                    price_audited=None,
                )
            )

        if execution_evidences:
            execution_evidences_insert_many_result = await ExecutionEvidence.insert_many(execution_evidences)
            execution_evidences = await ExecutionEvidence.find(
                {"_id": {"$in": execution_evidences_insert_many_result.inserted_ids}}, fetch_links=True
            ).to_list()
        else:
            execution_evidences = list()

        if execution_brands:
            executions_brand_insert_many_result = await ExecutionBrand.insert_many(execution_brands)
            execution_brands = await ExecutionBrand.find({"_id": {"$in": executions_brand_insert_many_result.inserted_ids}}, fetch_links=True).to_list()
        else:
            execution_brands = list()

        if execution_products:
            execution_products_insert_many_result = await ExecutionProduct.insert_many(execution_products)
            execution_products = await ExecutionProduct.find({"_id": {"$in": execution_products_insert_many_result.inserted_ids}}, fetch_links=True).to_list()
        else:
            execution_products = list()

        execution = await Execution(
            id=execution_api.get("id"),
            name=execution_api.get("name"),
            date=execution_api.get("date"),
            industry=industry,
            store=store,
            promoter=promoter,
            brands=execution_brands,
            products=execution_products,
            evidences=execution_evidences,
        ).save()
        return execution
