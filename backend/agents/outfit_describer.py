import base64
import os
import requests
from io import BytesIO
from dotenv import load_dotenv
from groq import Groq

class OutfitDescriber:
    def __init__(self, model="meta-llama/llama-4-scout-17b-16e-instruct", temperature=0, top_p=0.002, seed=42):
        load_dotenv()
        self.client = Groq()
        self.model = model
        self.temperature = temperature
        self.top_p = top_p
        self.seed = seed

    def encode_image(self, image_path):
        # Check if image_path is a URL or a local file path
        if image_path.startswith(('http://', 'https://')):
            # Handle URL
            response = requests.get(image_path)
            if response.status_code == 200:
                return base64.b64encode(response.content).decode('utf-8')
            else:
                raise Exception(f"Failed to fetch image from URL: {response.status_code}")
        else:
            # Handle local file path
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')

    def describe_outfit(self, image_path: str) -> str:
        b64_image = self.encode_image(image_path)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": ("""
                                - Describe the outfit components in the image, and the gender of the person.
                                - Provide the description in a single paragraph, without using lists or headings.
                                - Include details about: Top, Bottom, Footwear, Head Accessories, Accessories, Bags
                                - If the item is not present, do not include it in the description.
                                - Provide the basic color each item without pattern, and the brand if possible."""
                            ),
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{b64_image}",
                            }
                        }
                    ]
                }
            ],
            temperature=self.temperature,
            top_p=self.top_p,
            stream=False,
            seed=self.seed,
        )

        print('image desc',response.choices[0].message.content)
        return response.choices[0].message.content