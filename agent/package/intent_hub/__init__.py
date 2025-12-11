from pathlib import Path
import json

class IntentHub:
    base_dir = Path(__file__).parent

    @staticmethod
    def query():
        with open(IntentHub.base_dir / "query.json", 'r', encoding='utf-8') as f:
            return json.load(f)
    
    @staticmethod
    def next_action():
        with open(IntentHub.base_dir / "next_action.json", 'r', encoding='utf-8') as f:
            return json.load(f)