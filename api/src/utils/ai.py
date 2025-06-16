import base64
from google import genai
from google.genai import types
from settings import settings


async def process_images(images_base64: list[str], brands: list, products: list) -> any:
    client = genai.Client(api_key=settings.google_ai_studio_api_key)
    model = "gemini-2.5-flash-preview-05-20"

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=brands.__str__()),
                types.Part.from_text(text=products.__str__()),
                *[types.Part.from_bytes(mime_type="image/webp", data=base64.b64decode(image_base64)) for image_base64 in images_base64],
            ],
        )
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature=1.0,
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


# PROMPT = """Você deve analisar visualmente imagens de gôndolas de supermercado para obter informações precisas sobre os produtos expostos, suas marcas e preços. As gôndolas são organizadas de forma que os produtos de uma mesma marca são agrupados juntos, formando blocos visuais distintos. Sua tarefa é identificar esses blocos, contar as frentes de produtos e associá-las às marcas corretas, incluindo a categoria "Outras Marcas" para produtos de marcas desconhecidas.

# Dados que você receberá:

# products: Uma lista em JSON contendo os produtos conhecidos. Cada objeto do produto possui product_id, product_name, brand_id e brand_name. Essa é sua fonte primária para identificar os produtos conhecidos e suas marcas associadas.
# brands: Uma lista contendo as marcas conhecidas e uma marca específica chamada "Outras Marcas", que deve ser utilizada para contabilizar as frentes de produtos de marcas que não são conhecidas.
# imagens: Imagens de gôndolas com produtos que você deve analisar visualmente e extrair informações.
# O que você deve fazer:

# Identificar Blocos de Marcas na Gôndola:
# Observe que os produtos de uma mesma marca são agrupados juntos em blocos visuais, geralmente ocupando uma ou mais prateleiras consecutivas.
# Use características visuais como cores, logotipos e design de embalagem para identificar esses blocos.
# Marcas diferentes são separadas por espaços ou divisórias na gôndola, o que ajuda a delimitar os blocos.
# Contar Frentes de Produtos Conhecidos:
# Para cada produto que está na lista de products, conte o número de frentes visíveis na imagem.
# Uma frente é a primeira unidade visível de uma fileira de produtos.
# Não conte produtos que não estão na lista aqui.
# Identificar Preços dos Produtos Conhecidos:
# Para cada produto conhecido identificado, tente encontrar e registrar seu preço, caso esteja visível na imagem (geralmente em etiquetas próximas às frentes).
# Contar Frentes por Marca Conhecida:
# Para cada marca listada em brands, some as frentes de todos os produtos que pertencem a essa marca, mesmo que o produto específico não esteja na lista de products.
# Use a identificação visual dos blocos para associar produtos à marca correta.
# Categorizar e Contar Frentes de "Outras Marcas":
# Para todos os produtos que não pertencem a nenhuma marca conhecida (ou seja, marcas que não estão listadas em brands), categorize-os como "Outras Marcas" e conte suas frentes.
# Isso inclui produtos que não estão na lista de products e cujas marcas não estão em brands.
# Importante: Certifique-se de não ignorar esses produtos; eles devem ser explicitamente contados como "Outras Marcas".
# Instruções Críticas:

# Agrupamento por Marca: Produtos de uma mesma marca estão agrupados em blocos visuais. Use isso para identificar e contar frentes por marca.
# Marcas Desconhecidas: Qualquer bloco de produtos que não corresponda a uma marca conhecida deve ser contado como "Outras Marcas".
# Precisão Visual: Confie na sua capacidade de análise visual para identificar produtos, marcas e preços. Não invente informações; apenas registre o que puder identificar claramente.
# Exemplo para Esclarecimento:

# Suponha que a lista de products inclua "Coca-Cola 2L" da marca "Coca-Cola" e "Pepsi 2L" da marca "Pepsi", e a lista de brands inclua "Coca-Cola", "Pepsi" e "Outras Marcas".
# Se você identificar um bloco com 5 frentes de "Coca-Cola 2L" e 3 de "Coca-Cola 1L", isso totaliza 8 frentes para "Coca-Cola".
# Se houver um bloco com 4 frentes de "Pepsi 2L", são 4 frentes para "Pepsi".
# Se houver um bloco com 6 frentes de "Fanta 2L" (e "Fanta" não está em brands), essas 6 frentes devem ser contadas como "Outras Marcas".

# O retorno sempre deve incluir todos os produtos e marcas, mesmo que não tenha sido encontrado nada para eles!
# """

PROMPT = """Você deve análisar a imagem e obter informações precisas

Você receberá os seguintes dados:

products: Uma lista em JSON contendo os produtos que são conhecidos. Cada objeto do produto terá product_id, product_name, brand_id, brand_name. Essa é sua fonte primária para identificar os produtos conhecidos e suas marcas associdas.

brands: Uma lista contendo as marcas que são conhecidas e uma marca em específico chamada "Outras Marcas" que deve ser utilizada para contabilizar as frentes de produtos de marcas que não são conhecidas.

imagens: Imagens de gôndolas com produtos que você deve análisar visualmente e extrair informações.

O que você deve fazer:

 - Quantidade de frentes dos produtos conhecidos: Você deve contar todas as frentes dos produtos conhecidos que você encontrou na imagem com precisão.
 - Preço dos produtos conhecidos: Você deve encontrar o preço de cada produto conhecido.
 - Quantidade de frentes das marcas conhecidas: Você deve contar a quantidade de frentes que cada marca conhecida possui na gôndola. Utilize a descrição dos produtos conhecidos para encontrar as marcas referentes.
 - Outras marcas: Todos os produtos presentes na gondôla que não estão na listagem devem ser de "Outras Marcas".
"""


# PROMPT = """Você é um especialista em análise de varejo e sua tarefa é processar as informações fornecidas para quantificar produtos, suas frentes e o share de gôndola por marca.

# Informações de Entrada:
# Você receberá os seguintes dados:

# products.json: Um arquivo JSON contendo uma lista de produtos prioritários. Cada objeto de produto incluirá product_id, product_name, brand_id, e brand_name. Este arquivo é a sua fonte primária para identificar produtos e suas marcas associadas.
# brands.json: Um arquivo JSON contendo uma lista de marcas oficiais que devem ser quantificadas. Cada objeto de marca incluirá brand_id e brand_name.

# Múltiplos Arquivos de Imagem: Uma série de imagens de gôndolas de produtos que você deve analisar visualmente.

# Suas Responsabilidades:
# Identificação de Produtos e Frentes:

# Para cada imagem, identifique todos os produtos visíveis.
# Para cada produto identificado, quantifique o número de \"frentes\" (a largura ocupada pelo produto na gôndola, geralmente o número de unidades visíveis lado a lado).
# Priorize a identificação de produtos presentes no arquivo products.json. Utilize o product_name para fazer a correspondência entre o que você vê na imagem e o que está listado. Seja flexível com pequenas variações de nome, mas procure a correspondência mais próxima.
# Se um produto for identificado na imagem e não estiver presente no products.json, você ainda deve quantificá-lo e tentar inferir sua marca.
# Associação e Quantificação de Marcas:

# Para cada produto identificado, associe-o à sua respectiva marca usando o brand_id e brand_name do products.json.
# Calcule o total de frentes para cada marca.
# Se você identificar um produto e conseguir inferir sua marca, mas essa marca não estiver listada em brands.json, ou se você não conseguir identificar uma marca específica para um produto não prioritário, essas frentes devem ser categorizadas como \"Outras Marcas\".
# Importante: Se uma marca estiver presente no brands.json mas você não identificar nenhum produto associado a ela nas imagens, essa marca deve ser quantificada no cálculo final.

# Ajustes que você deve realizar:

# Identificar as separações do produtos e encontrar padrões de distribuição dos produtos na gondola, os produtos são agrupados por marca, então se houver qualquer tipo de produtos que estão entre um espaço de marcas que você reconheceu e outras marcas, eles provavelmente
# pertecem a marcas que você já encontrou, tanto horizontal quanto verticalmente.

# Podem existir produtos de diferentes tamanhos, então você deve encontrar uma relação de dos locais e das divisões das gondolas.

# Você também deve contabilizar produtos que não foram reconhecidos em nenhuma listagem como "Outras Marcas"
# """
