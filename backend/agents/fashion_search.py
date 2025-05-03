from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from langchain.tools import Tool
from dotenv import load_dotenv
import os
import json, re

class FashionSearchAgent:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        self.prompt_template = """This tool only used for searching product where the input is event or occasion. Your task is to search for real, available product links for fashion items based on the user's event or occasion input.

            IMPORTANT SEARCH INSTRUCTIONS:
            1. For each category, first formulate a specific search query like "baju pria formal lebaran tokopedia" or "sepatu wanita casual shopee"
            2. YOU MUST RETURN DIRECT PRODUCT LINKS ONLY. Valid links should point to specific products
            3. DO NOT use "find" or "search" keywords links like "https://www.tokopedia.com/find/..." or "https://shopee.co.id/search?keyword=..." - these are NOT acceptable
            4. Click through to actual product pages to get the direct product URLs
            5. If you cannot find a suitable item after searching, remove that category from the JSON object. Do not include empty categories.
            6. You need to make sure the link is available, because i always found that the link is not available anymore
            7. Only use links that point directly to specific product pages, never to search results pages.
            8. Use the following categories: "Top", "Bottom", "Outer", "Footwear", "Accessories", "Bag", "Dress", "Jumpsuit", "Swimwear", "Lingerie", "Sleepwear", "Activewear".
            9. Adjust to gender in request input

            Generate a JSON object following this exact structure:
            {
                "products": [
                    {
                        "category": "XXX",
                        "name": "<specific product name>",
                        "links": [
                            "<direct product link - NOT search results>",
                            "<direct product link - NOT search results>"
                        ]
                    },
                    {
                        "category": "XXX",
                        "name": "<specific product name>",
                        "links": [
                            "<direct product link - NOT search results>",
                            "<direct product link - NOT search results>"
                        ]
                    }
                ]
            }

            DO NOT MAKE UP LINKS. Only use links that point directly to specific product pages, never to search results pages.
            """
        # Initialize the LLM
        self.llm = ChatGroq(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0,
            seed=42,
            top_p=0.002
        )

        # Initialize the search tool
        self.search_tool = Tool(
            name="Product Search based on event",
            func=TavilySearchResults(
                api_key=os.getenv("TAVILY_API_KEY"),
                max_results=10,
                search_depth='basic',
                topic="fashion",
                include_domains=["https://shop-id.tokopedia.com/"],
                exclude_domains=[
                    "https://www.tokopedia.com/find/",
                    "https://shopee.co.id/search?keyword="
                ]
            ),
            description= self.prompt_template,
            max_retries=5,
            verbose=True,
        )

        # Create the agent
        self.agent_executor = create_react_agent(self.llm, [self.search_tool])


def search(self, user_input: str) -> dict:
    response = self.agent_executor.invoke({"messages": user_input})
    raw = response["messages"][-1].content

    # 1) hilangkan code‑fence ```
    # 2) ambil hanya substring yang diawali { dan diakhiri }
    match = re.search(r"\{.*\}", raw, re.S)
    if not match:
        print("Gagal extract JSON:", raw)
        return {"error": "No JSON object found"}
    clean = match.group(0)

    try:
        return json.loads(clean)
    except json.JSONDecodeError as e:
        print("Gagal decode JSON:", e, clean)
        return {"error": "Invalid JSON format from agent"}