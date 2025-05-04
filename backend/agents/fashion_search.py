from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from langchain.tools import Tool
from dotenv import load_dotenv
import os
import json
import re

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
            
            IMPORTANT OUTPUT FORMATTING:
            - Return ONLY the JSON object, without any additional text, explanation, or markdown formatting
            - Do not include code blocks, backticks, or any other non-JSON content

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
            Give me a few of items that match with the event or occasion or the user input.
            """
        # Initialize the LLM
        self.llm = ChatGroq(
            model="meta-llama/llama-4-maverick-17b-128e-instruct",
            temperature=0,
            seed=100,
            top_p=0.0000000002
        )

        # Create a wrapper function to ensure search results are properly formatted as strings
        def search_and_format(query):
            tavily = TavilySearchResults(
                api_key=os.getenv("TAVILY_API_KEY"),
                max_results=25,
                search_depth='basic',
                topic="fashion",
                include_domains=["shop-id.tokopedia.com"],
                exclude_domains=[
                    "https://www.tokopedia.com/find/",
                    "https://shopee.co.id/search?keyword="
                ]
            )
            results = tavily.invoke(query)
            # Ensure the results are returned as a properly formatted string
            if isinstance(results, list):
                return json.dumps(results)
            return str(results)

        # Initialize the search tool with the wrapper function
        self.search_tool = Tool(
            name="Product Search based on event",
            func=search_and_format,
            description=self.prompt_template,
            max_retries=10,
        )

        # Create the agent
        self.agent_executor = create_react_agent(self.llm, [self.search_tool])

    def search(self, user_input):
        try:
            response = self.agent_executor.invoke({"messages": user_input})
            content = response['messages'][-1].content
            print(content)
            try:
                # Try to extract JSON from code blocks first
                json_match = re.search(r'```(?:json)?\s*(.*?)\s*```', content, re.DOTALL)
                if json_match:
                    content = json_match.group(1)

                # Parse the JSON to validate it
                parsed_json = json.loads(content)
                # Return formatted JSON string
                return json.dumps(parsed_json, ensure_ascii=False)
            except json.JSONDecodeError:
                # Return a valid error JSON if parsing fails
                return json.dumps({"error": "Could not extract valid JSON from response"})

        except Exception as e:
            # Handle any other exceptions during agent execution
            return json.dumps({"error": f"Agent execution error: {str(e)}"})