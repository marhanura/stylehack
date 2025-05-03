import base64
import os
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

    def describe_outfit(self, image_path: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Describe the outfit components in the image, and the gender of the person. "
                                "Provide the description in a single paragraph, without using lists or headings"
                                "Top, Bottom, Footwear, Head Accessories, Accessories, Bags. "
                                "If the item is not present, do not include it in the description. "),
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_path,
                            }
                        }
                    ]
                }
            ],
            temperature=self.temperature,
            top_p=self.top_p,
            max_completion_tokens=1024,
            stream=False,
            seed=self.seed,
        )

        return response.choices[0].message.content