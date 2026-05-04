import httpx
import json
import re
from fastapi import HTTPException
from app.config import config

class LLMService:
    @staticmethod
    async def ask_llama(prompt: str):
        payload = {
            "model": config.OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(config.OLLAMA_URL, json=payload)
                response.raise_for_status()
                return response.json()["response"]
            except httpx.HTTPError as e:
                raise HTTPException(status_code=500, detail=f"LLM connection error: {str(e)}")

    @staticmethod
    def parse_json_output(output: str):
        """
        Robustly parse JSON from LLM output, handling markdown backticks and extra text.
        """
        # Try to find JSON block in markdown
        json_match = re.search(r'```json\s*(.*?)\s*```', output, re.DOTALL)
        if json_match:
            output = json_match.group(1)
        else:
            # Fallback: find anything between curly braces
            json_match = re.search(r'(\{.*\})', output, re.DOTALL)
            if json_match:
                output = json_match.group(1)
        
        try:
            return json.loads(output)
        except json.JSONDecodeError:
            # Last ditch effort: remove common LLM prefixes
            clean_output = output.strip().replace("```", "")
            try:
                return json.loads(clean_output)
            except:
                raise HTTPException(status_code=500, detail=f"Failed to parse LLM response as JSON: {output}")

llm_service = LLMService()
