import aiohttp

from typing import Union
from beanie import WriteRules
from settings import settings

from src.db import models


class Promo:

    _base_url = settings.promo_api_url
    _access_token: str | None = None

    async def _request(self, method, path: str, **kwargs) -> tuple[int, any]:
        url = self._base_url + path
        headers = kwargs.pop("headers", {})
        if self._access_token:
            headers["Authorization"] = f"Bearer {self._access_token}"
        kwargs["headers"] = headers
        async with aiohttp.ClientSession() as session:
            if method == "get":
                async with session.get(url, **kwargs) as response:
                    status = response.status
                    data = await response.json()
            elif method == "post":
                async with session.post(url, **kwargs) as response:
                    status = response.status
                    data = await response.json()
            else:
                raise NotImplementedError()
            if status == 401 and await self.authenticate():
                return await self._request(method, path, **kwargs)
            return status, data

    async def authenticate(self) -> bool:
        status, data = await self._request("post", "/login/", data=dict(username=settings.promo_adm_user, password=settings.promo_adm_pass))
        if status == 200:
            self._access_token = data["access"]
            return True
        return False

    async def get_execution_by_name_and_save_to_db(self, name: str) -> Union[models.Execution, None]:
        status, data = await self._request("get", f"/execution/by_name/{name}")
        if status != 200:
            return None

        _brands = list()
        _products = list()

        for promo_brand in data["brands"]:
            category = models.Category(
                id=promo_brand["category"]["id"],
                name=promo_brand["category"]["name"],
            )
            brand = models.Brand(
                id=promo_brand["id"],
                name=promo_brand["name"],
                category=category,
            )
            _brands.append(
                models.ExecutionBrand(
                    brand=brand,
                    faces_promoter=promo_brand["faces"],
                    faces_ir=promo_brand["faces_ir"],
                    faces_manhattan=None,
                    faces_audited=None,
                ),
            )

        for promo_product in data["products"]:
            category = models.Category(
                id=promo_product["segment"]["brand"]["category"]["id"],
                name=promo_product["segment"]["brand"]["category"]["name"],
            )
            brand = models.Brand(
                id=promo_product["segment"]["brand"]["id"],
                name=promo_product["segment"]["brand"]["name"],
                category=category,
            )
            segment = models.Segment(
                id=promo_product["segment"]["id"],
                name=promo_product["segment"]["name"],
                brand=brand,
            )
            product = models.Product(
                id=promo_product["id"],
                name=promo_product["name"],
                ean=promo_product["ean"],
                image_url=promo_product["image_url"],
                segment=segment,
            )
            _products.append(
                models.ExecutionProduct(
                    product=product,
                    faces_promoter=promo_product["fronts"],
                    faces_ir=promo_product["fronts_ir"],
                    faces_manhattan=None,
                    faces_audited=None,
                    price_promoter=promo_product["price"],
                    price_ir=promo_product["price_ir"],
                    price_manhattan=None,
                    price_audited=None,
                )
            )

        _execution = models.Execution(id=data["id"], name=data["name"], brands=_brands, products=_products, evidences=data["evidences"])
        await _execution.save(link_rule=WriteRules.WRITE)
        return _execution
