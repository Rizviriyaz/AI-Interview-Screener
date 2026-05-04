import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434/api/generate")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./interview.db")
    DEBUG = os.getenv("DEBUG", "False") == "True"

config = Config()
