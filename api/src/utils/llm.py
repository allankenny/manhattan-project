import base64
from google import genai
from google.genai import types
from loguru import logger
from settings import settings


async def process_images(images_base64: list[str], brands: list, products: list, prompt_name: str = "quantifier", temperature: float = 1.0) -> any:
    logger.info(f"Processing {len(images_base64)} evidences using {prompt_name} prompt with temperature in {temperature}")
    client = genai.Client(api_key=settings.gemini_api_key)
    model = "gemini-2.5-flash"

    with open(f"prompts/{prompt_name}.txt", "r") as prompt_file:
        prompt = prompt_file.read()

    contents = [
        types.Part.from_text(text=prompt),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=brands.__str__()),
                types.Part.from_text(text=products.__str__()),
                *[types.Part.from_bytes(mime_type="image/webp", data=base64.b64decode(image_base64)) for image_base64 in images_base64],
            ],
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature=temperature,
        response_mime_type="application/json",
        thinking_config=types.ThinkingConfig(
            thinking_budget=0,
        ),
        response_schema=genai.types.Schema(
            type=genai.types.Type.OBJECT,
            required=["brands", "products"],
            properties={
                "brands": genai.types.Schema(
                    type=genai.types.Type.ARRAY,
                    items=genai.types.Schema(
                        type=genai.types.Type.OBJECT,
                        required=["brand_id", "brand_name", "fronts"],
                        properties={
                            "brand_id": genai.types.Schema(
                                type=genai.types.Type.STRING,
                            ),
                            "brand_name": genai.types.Schema(
                                type=genai.types.Type.STRING,
                            ),
                            "fronts": genai.types.Schema(
                                type=genai.types.Type.INTEGER,
                            ),
                        },
                    ),
                ),
                "products": genai.types.Schema(
                    type=genai.types.Type.ARRAY,
                    items=genai.types.Schema(
                        type=genai.types.Type.OBJECT,
                        required=["product_id", "product_name", "fronts", "price"],
                        properties={
                            "product_id": genai.types.Schema(
                                type=genai.types.Type.STRING,
                            ),
                            "product_name": genai.types.Schema(
                                type=genai.types.Type.STRING,
                            ),
                            "fronts": genai.types.Schema(
                                type=genai.types.Type.INTEGER,
                            ),
                            "price": genai.types.Schema(
                                type=genai.types.Type.NUMBER,
                            ),
                        },
                    ),
                ),
            },
        ),
    )

    generated_content = client.models.generate_content(model=model, contents=contents, config=generate_content_config)
    return generated_content.to_json_dict()


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

