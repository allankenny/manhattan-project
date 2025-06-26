import asyncio
import base64, json
from typing import List, TypedDict
from fastapi.logger import logger
from google import genai
from google.genai import types
from settings import settings


async def get_product_description(image_base64: str) -> str:
    client = genai.Client(api_key=settings.gemini_api_key)
    model = "gemini-2.5-flash"

    with open("prompts/describe_product.txt", "r") as prompt_file:
        prompt = prompt_file.read()

    contents = [
        types.Content(role="user", parts=[types.Part.from_bytes(mime_type="image/webp", data=base64.b64decode(image_base64))]),
        types.Part.from_text(text=prompt),
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature=1.0,
        response_mime_type="application/json",
        thinking_config=types.ThinkingConfig(
            thinking_budget=0,
        ),
        response_schema=genai.types.Schema(
            type=genai.types.Type.OBJECT,
            required=["description"],
            properties={
                "description": genai.types.Schema(
                    type=genai.types.Type.STRING,
                ),
            },
        ),
    )

    generated_content = client.models.generate_content(model=model, contents=contents, config=generate_content_config)
    return generated_content.to_json_dict()


class ProcessParams(TypedDict):
    model: str
    temperature: float


def get_prompt_by_name(name: str) -> str:
    with open(f"prompts/{name}.txt", "r") as prompt_file:
        prompt = prompt_file.read()
    return prompt


async def process_products_faces(model: str, temperature: float, products: list, images_base64: List[str]):
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=json.dumps(products)),
                *[types.Part.from_bytes(mime_type="image/webp", data=base64.b64decode(image_base64)) for image_base64 in images_base64],
            ],
        ),
        types.Part.from_text(text=get_prompt_by_name("products_faces")),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=temperature,
        response_mime_type="application/json",
        thinking_config=types.ThinkingConfig(
            thinking_budget=0,
        ),
        response_schema=genai.types.Schema(
            type=genai.types.Type.OBJECT,
            required=["products"],
            properties={
                "products": genai.types.Schema(
                    type=genai.types.Type.ARRAY,
                    items=genai.types.Schema(
                        type=genai.types.Type.OBJECT,
                        required=["product_id", "product_name", "fronts"],
                        properties={
                            "product_id": genai.types.Schema(type=genai.types.Type.STRING),
                            "product_name": genai.types.Schema(type=genai.types.Type.STRING),
                            "fronts": genai.types.Schema(type=genai.types.Type.INTEGER),
                        },
                    ),
                ),
            },
        ),
    )
    client = genai.Client(api_key=settings.gemini_api_key)
    generated_content = client.models.generate_content(model=model, contents=contents, config=generate_content_config)
    return generated_content.to_json_dict()


async def process_products_price(model: str, temperature: float, products: list, images_base64: List[str]):
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=json.dumps(products)),
                *[types.Part.from_bytes(mime_type="image/webp", data=base64.b64decode(image_base64)) for image_base64 in images_base64],
            ],
        ),
        types.Part.from_text(text=get_prompt_by_name("products_price")),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=temperature,
        response_mime_type="application/json",
        thinking_config=types.ThinkingConfig(
            thinking_budget=0,
        ),
        response_schema=genai.types.Schema(
            type=genai.types.Type.OBJECT,
            required=["products"],
            properties={
                "products": genai.types.Schema(
                    type=genai.types.Type.ARRAY,
                    items=genai.types.Schema(
                        type=genai.types.Type.OBJECT,
                        required=["product_id", "product_name", "price"],
                        properties={
                            "product_id": genai.types.Schema(type=genai.types.Type.STRING),
                            "product_name": genai.types.Schema(type=genai.types.Type.STRING),
                            "price": genai.types.Schema(type=genai.types.Type.INTEGER),
                        },
                    ),
                ),
            },
        ),
    )
    client = genai.Client(api_key=settings.gemini_api_key)
    generated_content = client.models.generate_content(model=model, contents=contents, config=generate_content_config)
    return generated_content.to_json_dict()


async def process_brands_faces(model: str, temperature: float, brands: list, images_base64: List[str]):
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=json.dumps(brands)),
                *[types.Part.from_bytes(mime_type="image/webp", data=base64.b64decode(image_base64)) for image_base64 in images_base64],
            ],
        ),
        types.Part.from_text(text=get_prompt_by_name("brands_faces")),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=temperature,
        response_mime_type="application/json",
        thinking_config=types.ThinkingConfig(
            thinking_budget=0,
        ),
        response_schema=genai.types.Schema(
            type=genai.types.Type.OBJECT,
            required=["brands"],
            properties={
                "brands": genai.types.Schema(
                    type=genai.types.Type.ARRAY,
                    items=genai.types.Schema(
                        type=genai.types.Type.OBJECT,
                        required=["brand_id", "brand_name", "fronts"],
                        properties={
                            "brand_id": genai.types.Schema(type=genai.types.Type.STRING),
                            "brand_name": genai.types.Schema(type=genai.types.Type.STRING),
                            "fronts": genai.types.Schema(type=genai.types.Type.INTEGER),
                        },
                    ),
                ),
            },
        ),
    )
    client = genai.Client(api_key=settings.gemini_api_key)
    generated_content = client.models.generate_content(model=model, contents=contents, config=generate_content_config)
    return generated_content.to_json_dict()


async def process_execution(**kwargs):
    logger.info(f"Processing {len(kwargs['images_base64'])} evidences with {kwargs['model']} using temperature {kwargs['temperature']}")
    brands_args = kwargs.pop("brands")
    products_args = kwargs.pop("products")
    results = await asyncio.gather(
        process_products_faces(**kwargs, products=products_args),
        process_products_price(**kwargs, products=products_args),
        process_brands_faces(**kwargs, brands=brands_args),
    )
    brands = list()
    products = list()
    for brand in brands_args:
        b = {"id": brand["brand_id"]}
        for r2 in results[2]["parsed"]["brands"]:
            if b["id"] == r2["brand_id"]:
                b["fronts"] = r2["fronts"]
        brands.append(b)
    for product in products_args:
        p = {"id": product["product_id"]}
        for r0 in results[0]["parsed"]["products"]:
            if p["id"] == r0["product_id"]:
                p["fronts"] = r0["fronts"]
        for r1 in results[1]["parsed"]["products"]:
            if p["id"] == r1["product_id"]:
                p["price"] = r1["price"]
        products.append(p)
    return brands, products
