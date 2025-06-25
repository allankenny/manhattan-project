from crewai.flow.flow import Flow, and_, listen, start
from pydantic import BaseModel


class ShelfAnalyserFlowState(BaseModel):
    products: list = []


class ShelfAnalyserFlow(Flow[ShelfAnalyserFlowState]):

    @start()
    def analyse_products(self):
        self.state.products
