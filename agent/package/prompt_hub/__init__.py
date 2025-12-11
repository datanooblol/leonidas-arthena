from pathlib import Path

class PromptHub:
    base_dir = Path(__file__).parent

    @staticmethod
    def bro_andy():
        return (PromptHub.base_dir / "bro-andy.md").read_text(encoding='utf-8')

    @staticmethod
    def intent_classifier():
        return (PromptHub.base_dir / "intent_classifier.md").read_text(encoding='utf-8')
    
    @staticmethod
    def generate_sql():
        return (PromptHub.base_dir / "generate_sql.md").read_text(encoding='utf-8')
    
    @staticmethod
    def generate_plotly():
        return (PromptHub.base_dir / "generate_plotly.md").read_text(encoding='utf-8')

    @staticmethod
    def chat_with_data():
        return (PromptHub.base_dir / "chat_with_data.md").read_text(encoding='utf-8')

    @staticmethod
    def chat():
        return (PromptHub.base_dir / "chat.md").read_text(encoding='utf-8')