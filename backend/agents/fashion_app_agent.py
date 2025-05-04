from .fashion_search import FashionSearchAgent
from .outfit_describer import OutfitDescriber
import json

class FashionAppAgent:
    def __init__(self):
        self.fashion_search_agent = FashionSearchAgent()
        self.outfit_describer = OutfitDescriber()

    def check_input_image_or_event(self, user_input):
        if user_input.lower().endswith(('.jpg', '.jpeg', '.png')):
            return "image"
        else:
            return "event"

    def main(self, user_input):
        input_type = self.check_input_image_or_event(user_input)
        outfit_description = None  # Inisialisasi awal
        try:
            if input_type == "image":
                # First get description from image
                outfit_description = self.outfit_describer.describe_outfit(user_input)
                # Then search for products based on that description
                result = self.fashion_search_agent.search(outfit_description)
            else:
                outfit_description = user_input  # anggap input teks adalah deskripsi
                result = self.fashion_search_agent.search(user_input)

            return json.loads(result)

        except Exception as e:
            print(f"Error: {e}")
            return e

Agent = FashionAppAgent()
