from .agent import AgentFactory
from .llm import LLMFactory
from .intent import IntentFactory
from package.llms.bedrock import BedrockNova
from package.prompt_hub import PromptHub
from package.intent_hub import IntentHub
from package.data_models.intent_classification import Intent
from package.embedding.transformer_embedding import TransformerEmbedding

def setup_agents():
    AgentFactory.register("bro-andy", "funny and supportive Andy bro", PromptHub.bro_andy, None, None)
    AgentFactory.register("intent-classifier", "classify user's sentiment", PromptHub.intent_classifier, Intent, "toon")
    AgentFactory.register("sql-generator", "generate sql based on metadata", PromptHub.generate_sql, None, "sql")
    AgentFactory.register("plotly-generator", "generate plotly graph based on data", PromptHub.generate_plotly, None, "python")
    AgentFactory.register("chat-with-data", "answer based on data", PromptHub.chat_with_data, None, None)
    AgentFactory.register("chat", "normal chat", PromptHub.chat, None, None)

def setup_llms():
    LLMFactory.register("nova-micro", BedrockNova, "us.amazon.nova-micro-v1:0")
    LLMFactory.register("paraphase-embedding", TransformerEmbedding, "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    ##

def setup_intent_classifiers():
    IntentFactory.register("query", "classify query intent: True|False", IntentHub.query)