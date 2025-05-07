import base64
import os
import requests
from io import BytesIO
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

class OutfitDescriber:
    def __init__(self, model="meta-llama/llama-4-scout-17b-16e-instruct", temperature=0, top_p=0.002, seed=42):

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
                                - Provide the description in a single short paragraph, without using lists or headings.
                                - Include details about: Top, Bottom, Footwear, Head Accessories, Accessories, Bags
                                - If the item is not present, do not include or mention it in the description.
                                - Provide the basic color each item without pattern, and the brand if possible.
                                - Do not talk about missing items or overall color palette.
                                - Do not include any other information or context about the image.
                                - DO NOT PROVIDE A JSON OBJECT OR ANY OTHER FORMATTING.
                                - DO NOT INCLUDE EXPLANATIONS LIKE "She is not wearing" or "He is not wearing.

                                Output format (key dan value hanya ditulis jika ada value, jika tidak ada value tulis none):
                                - gender: <gender>,
                                - Top: <top description>,
                                - Bottom: <bottom description>,
                                - Footwear: <footwear description>,
                                - Head Accessories: <head accessories description>,
                                - Accessories: <accessories description>,
                                - Bags: <bags description>
                                """
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

        text = response.choices[0].message.content
        # Membagi teks menjadi baris-baris
        lines = text.split('\n')

        # Menyaring baris yang tidak mengandung "none"
        filtered_lines = [line for line in lines if "none" not in line.lower()]

        # Menggabungkan kembali baris-baris yang tersisa
        result = '\n'.join(filtered_lines)
        return result