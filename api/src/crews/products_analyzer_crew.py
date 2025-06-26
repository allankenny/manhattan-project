import json
from typing import List
from crewai import LLM, Agent, Crew, Task, Process
from crewai.tools.agent_tools.add_image_tool import AddImageTool
from crewai.project import CrewBase, agent, task, crew
from pydantic import BaseModel

from settings import settings
from src.db.models import Execution, ExecutionBrand, ExecutionProduct


@CrewBase
class ProductAnalyzerCrew:

    agents_config = "../../config/agents.yaml"
    tasks_config = "../../config/tasks.yaml"

    @agent
    def merchandising_promoter(self) -> Agent:
        llm = LLM(model="gemini/gemini-2.5-pro", temperature=0.3, api_key=settings.gemini_api_key)
        # llm = LLM(
        #     model="openai/gpt-4.1-mini",
        #     temperature=0.2,
        #     # max_tokens=150,
        #     # top_p=0.9,
        #     # frequency_penalty=0.1,
        #     # presence_penalty=0.1,
        #     # stop=["END"],
        #     # seed=42,
        # )
        return Agent(
            config=self.agents_config["merchandising_promoter"],
            verbose=True,
            tools=[AddImageTool()],
            multimodal=True,
            llm=llm,
        )

    @task
    def shelf_analysis_task(self) -> Task:
        return Task(config=self.tasks_config["shelf_analysis_task"], output_json=ShelfAnalysisTaskOutput)

    @crew
    def crew(self) -> Crew:
        return Crew(agents=self.agents, tasks=self.tasks, process=Process.sequential)

    @staticmethod
    def map_execution_brand(execution_brand: ExecutionBrand) -> dict:
        return dict(brand_id=execution_brand.brand.id, brand_name=execution_brand.brand.name)

    @staticmethod
    def map_execution_product(execution_product: ExecutionProduct) -> dict:
        return dict(
            product_id=execution_product.product.id,
            product_name=execution_product.product.name,
            product_description=execution_product.product.description,
            brand_id=execution_product.product.segment.brand.id,
            brand_name=execution_product.product.segment.brand.name,
        )

    def process_execution(self, execution: Execution):
        crew = self.crew()
        brands = list(map(lambda eb: self.map_execution_brand(eb), execution.brands))
        products = list(map(lambda ep: self.map_execution_product(ep), execution.products))

        output = crew.kickoff(
            inputs={
                "category": "Diapers",
                "brands": json.dumps(brands),
                "products": json.dumps(products),
                "images_urls": "\n".join([f"- {evidence.url}" for evidence in execution.evidences]),
            }
        )

        result = dict()
        for task_output in output.tasks_output:
            if task_output.name == self.shelf_analysis_task.__name__:
                result["brands"] = json.loads(task_output.json).get("brands", [])
        return result


class BrandOutput(BaseModel):
    brand_id: str
    brand_name: str
    faces: int


class ShelfAnalysisTaskOutput(BaseModel):
    brands: List[BrandOutput]
