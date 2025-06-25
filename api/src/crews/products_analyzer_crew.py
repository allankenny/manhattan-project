import json
from typing import List
from crewai import LLM, Agent, Crew, Task, Process
from crewai.tools.agent_tools.add_image_tool import AddImageTool
from crewai.project import CrewBase, agent, task, crew, llm
from crewai.tools import tool
from settings import settings

from src.db.models import Brand, Product


@CrewBase
class ProductAnalyzerCrew:

    agents_config = "../../config/agents.yaml"
    tasks_config = "../../config/tasks.yaml"

    def __init__(self, evidences_urls: List[str], brands: List[Brand], products: List[Product]) -> None:
        self.evidences_urls = evidences_urls
        self.brands = brands
        self.products = products

    # @tool("Brands JSON tool")
    # def brands_json_tool(self) -> str:
    #     """A JSON of brands with your identifiers"""
    #     return json.dumps(list(dict(brand_id=brand.id, brand_name=brand.name) for brand in self.brands))

    # @tool("Products JSON tool")
    # def products_json_tool(self) -> str:
    #     """A JSON of products with your identifiers and brands relation"""
    #     return json.dumps(
    #         list(
    #             dict(
    #                 product_id=product.id,
    #                 product_name=product.name,
    #                 brand_id=product.segment.brand.id,
    #                 brand_name=product.segment.brand.name,
    #             )
    #             for product in self.products
    #         )
    #     )

    @agent
    def shelf_analyst(self) -> Agent:
        llm = LLM(model="gemini/gemini-2.0-flash", api_key=settings.google_ai_studio_api_key, temperature=1.0)
        return Agent(
            config=self.agents_config["shelf_analyst"],
            verbose=True,
            tools=[AddImageTool()],
            multimodal=True,
            llm=llm,
        )

    @task
    def shelf_analysis_task(self) -> Task:
        return Task(config=self.tasks_config["shelf_analysis_task"])

    @crew
    def crew(self) -> Crew:
        return Crew(agents=self.agents, tasks=self.tasks, process=Process.sequential)
