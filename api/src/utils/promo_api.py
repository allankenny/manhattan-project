import aiohttp

from typing import Union
from beanie import WriteRules
from settings import settings

from src.db import models


class PromoAPI:

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

    async def get_industry_products(self, industry_id: str) -> dict | None:
        status, products_api = await self._request(
            "get",
            "/product/",
            params={"expand": "segment.brand.category", "industry_id": industry_id, "filter_active": "True", "no_pagination": "True"},
        )
        if status != 200:
            return None
        return products_api

    async def get_execution_by_name(self, name: str) -> dict | None:
        status, data = await self._request("get", f"/execution/by_name/{name}")
        if status != 200:
            return None
        return data
