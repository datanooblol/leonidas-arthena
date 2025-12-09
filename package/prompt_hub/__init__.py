from pathlib import Path

class PromptHub:
    base_dir = Path(__file__).parent

    @staticmethod
    def bro_andy():
        return (PromptHub.base_dir / "bro_andy.md").read_text(encoding='utf-8')