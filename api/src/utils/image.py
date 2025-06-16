import base64, aiohttp


async def url_image_to_base64(image_url: str) -> str:
    async with aiohttp.ClientSession() as session:
        async with session.get(image_url) as response:
            response.raise_for_status()
            return base64.b64encode(await response.read()).decode("utf-8")
