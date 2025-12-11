from sentence_transformers import SentenceTransformer

CATALOG = {
    'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2': SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
}

class TransformerEmbedding:
    def __init__(self, model_id):
        self.model_id = model_id

    def get_model(self):
        return CATALOG.get(self.model_id)

    def run(self, texts:list[str]):
        model = self.get_model()
        response = model.encode(texts)
        return response