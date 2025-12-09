from toon import decode
import json
import logging
from package.llms.utils import token_calculation, token_price_list, parse_blockcode

logging.basicConfig(level=logging.DEBUG)

class Agent:
    def __init__(self, agent_name, system_prompt, DataModel=None, format=None, max_retries=2):
        self.agent_name = agent_name
        self.system_prompt = system_prompt
        self.DataModel = DataModel
        self.format = format
        self.llm = None
        self.max_retries = max_retries
        self.logger = logging.getLogger(self.agent_name)

    def parse_response(self, response):
        if self.DataModel is None:
            return response
        self.logger.debug(f"Response: {response}")
        res_str = parse_blockcode(response, language=self.format)
        self.logger.debug(f"Parsed: {res_str}")
        if self.format == "json":
            return self.DataModel(**json.loads(res_str))
        elif self.format == "toon":
            return self.DataModel(**decode(res_str))

    def run(self, content):
        try:
            original_messages = [dict(role="user", content=content)]
            response = self.llm.run(self.system_prompt, original_messages)
            self.logger.debug(response)
            if self.DataModel is None:
                return response
            parsed_response = self.parse_response(response.content)
            response.content = parsed_response
            return response
        except Exception as e:
            self.logger.error(f"Error running agent: {e}")
            return response