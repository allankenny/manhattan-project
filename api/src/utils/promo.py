import aiohttp
from typing import TypedDict, Union
from settings import settings


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

    async def get_execution_by_name(self, name: str) -> Union["PromoExecutionType", None]:
        status, data = await self._request("get", f"/execution/by_name/{name}")
        if status == 200:
            return data


class PromoEvidenceType(TypedDict):
    id: str
    url: str


class PromoCategoryType(TypedDict):
    id: str
    name: str


class PromoBrandType(TypedDict):
    id: str
    name: str
    category: PromoCategoryType


class PromoSegmentType(TypedDict):
    id: str
    name: str
    brand: PromoBrandType


class PromoProductType(TypedDict):
    id: str
    name: str
    ean: str
    image_url: str | None
    segment: PromoSegmentType
    fronts: int
    fronts_ir: int
    price: float
    price_ir: float

class PromoExecutionBrandType:
    id: str
    name: str
    faces: int
    faces_ir: int
    category: PromoCategoryType


class PromoExecutionType(TypedDict):
    id: str
    name: str
    evidences: list[PromoEvidenceType]
    products: list[PromoProductType]
    brands: list[PromoExecutionBrandType]
