from langchain_community.tools.tavily_search import TavilySearchResults


from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from langchain.tools import Tool
from dotenv import load_dotenv
import os
import json
import re


load_dotenv()

class FashionSearchAgent:
    def __init__(self):
        # Load environment variables

        self.prompt = """This tool only used for searching product where the input is event or chlotes request. Your task is to search for real, available product urls for fashion items based on the user's event or chlotes request input.

            IMPORTANT SEARCH INSTRUCTIONS:
            1. For each category, first formulate a specific search query like "baju pria formal lebaran" or "sepatu wanita casual"
            2. YOU MUST RETURN DIRECT PRODUCT urls ONLY. Valid urls should point to specific products
            3. Click through to actual product pages to get the direct product URLs
            4. If you cannot find a suitable item after searching, remove that category from the JSON object. Do not include empty categories.
            5. You need to make sure the link is available, because i always found that the link is not available anymore
            6. Only use urls that point directly to specific product pages, never to search results pages.
            7. Use the following categories: "Top", "Bottom", "Outer", "Footwear", "Accessories", "Bag", "Dress", "Jumpsuit", "Swimwear", "Lingerie", "Sleepwear", "Activewear".

            IMPORTANT OUTPUT FORMATTING:
            - Return ONLY the JSON object, without any additional text, explanation, or markdown formatting
            - Do not include code blocks, backticks, or any other non-JSON content

            Generate a JSON object following this exact structure:
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

            DO NOT MAKE UP urls. Only use urls that point directly to specific product pages, never to search results pages.
            Give me a few of items that match with the event or occasion or the user input.
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
