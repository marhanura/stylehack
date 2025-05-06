from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq

from langchain.tools import Tool
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

class FashionSearchAgentforimage:
    def __init__(self):
        # Load environment variables
        self.prompt = """Tool ini digunakan untuk mencari produk fashion berdasarkan input barang yang diberikan, input akan berupa nama item dan gender. Anda harus mencari produk fashion yang sesuai dengan input yang diberikan.
            Aturan untuk mencari produk:
            1. Lakukan pencarian produk satu per satu berdasarkan input yang diberikan
            2. Gunakan kata kunci yang sesuai dengan kategori produk yang dicari
            3. Pastikan untuk mencari produk yang sesuai dengan kategori yang diberikan

            OUTPUT FORMAT (JSON ONLY, no extra text or markdown):
                        {
                            "products": [
                                {
                                    "category": "XXX",
                                    "name": "<product name>",
                                    "links": [
                                        "<direct product url>",
                                    ]
                                },
                                {
                                    "category": "XXX",
                                    "name": "<product name>",
                                    "links": [
                                        "<direct product url>",
                                    ]
                                }
                            ]
                        }

            """
        # Initialize the LLM
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile", # ini ganti ke gemini
            temperature=0,
            seed=42,
            top_p=0.002,
            max_retries=10,
        )


        # Create a wrapper function to ensure search results are properly formatted as strings
        def search_and_format(query):
            tavily = TavilySearchResults(
                api_key=os.getenv("TAVILY_API_KEY"),
                max_results=10,
                search_depth='basic',
                include_domains=["shop-id.tokopedia.com"],
                exclude_domains=[
                    "https://www.tokopedia.com/find/",
                    "https://shopee.co.id/search?keyword="
                ]
            )
            results = tavily.invoke(query)
            return results

        # Initialize the search tool with the wrapper function
        self.search_tool = Tool(
            name="product_search_based_on_information",  # Modified name with underscores
            func=search_and_format,
            description=self.prompt,
            max_retries=10,
            verbose=True,  # Set verbose to True for detailed output
            early_stopping_method="generate",  # Added early stopping method
        )
        # Create the agent
        self.agent_executor = create_react_agent(self.llm, [self.search_tool])

    def search(self, user_input):
        response = self.agent_executor.invoke(
            {"messages": user_input},
            {"tool_choice":"required"},
            # Added tool_choice parameter
        )

        content = response['messages'][-1].content

        return content