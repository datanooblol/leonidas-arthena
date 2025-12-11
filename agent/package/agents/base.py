from toon import decode
import json
import logging
from package.llms.utils import parse_blockcode

class Agent:
    def __init__(self, agent_name, system_prompt, DataModel=None, format=None, max_retries=2):
        self.agent_name = agent_name
        self.system_prompt = system_prompt
        self.DataModel = DataModel
        self.format = format
        self.model = None
        self.max_retries = max_retries
        self.logger = logging.getLogger(self.agent_name)

    def parse_response(self, response):        
        self.logger.debug(f"Response: {response}")
        res_str = parse_blockcode(response, language=self.format)
        self.logger.debug(f"Parsed: {res_str}")
        
        parsers = {
            "json": lambda x: json.loads(x),
            "toon": lambda x: decode(x)
        }
        
        if self.format in parsers:
            return self.DataModel(**parsers[self.format](res_str))
        return res_str

    def run(self, content):
        response= None
        try:
            original_messages = [dict(role="user", content=content)]
            response = self.model.run(self.system_prompt, original_messages)
            if self.format in ["python", "sql"]:
                response.content = parse_blockcode(response.content, language=self.format)
                self.logger.debug(f"{self.format.upper()} code:\n{response.content}")
                return response
            if self.DataModel:
                response.content = self.parse_response(response.content)
            return response
        except Exception as e:
            self.logger.error(f"Error running agent: {e}")
            return response
