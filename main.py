from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import RedirectResponse
import requests
import json

app = FastAPI()

OLLAMA = "http://127.0.0.1:11434/api/generate"
MODEL = "llama3.2"

class EvalReq(BaseModel):
    answer: str

class RankReq(BaseModel):
    candidates: list[str]

def ask_llama(prompt: str):
    payload = {"model": MODEL, "prompt": prompt, "stream": False}
    r = requests.post(OLLAMA, json=payload)
    if r.status_code != 200:
        raise HTTPException(500, "LLM error")
    return r.json()["response"]

@app.get("/")
def home():
    return RedirectResponse(url="/docs")

@app.post("/evaluate-answer")
def evaluate(req: EvalReq):
    prompt = f"""
Evaluate this answer briefly.

Answer: {req.answer}

Return ONLY JSON:
{{
  "score": 1-5,
  "summary": "one-line summary",
  "improvement": "one improvement"
}}
"""
    out = ask_llama(prompt)
    try:
        result_json = json.loads(out)  # parse the LLM output into JSON
    except:
        raise HTTPException(500, f"Invalid JSON from LLM: {out}")
    return result_json

@app.post("/rank-candidates")
def rank(req: RankReq):
    results = []
    for ans in req.candidates:
        prompt = f"""
Evaluate this answer briefly.

Answer: {ans}

Return ONLY JSON:
{{
  "score": 1-5,
  "summary": "one-line summary",
  "improvement": "one improvement"
}}
"""
        out = ask_llama(prompt)
        try:
            res = json.loads(out)
        except:
            raise HTTPException(500, f"Invalid JSON from LLM: {out}")
        results.append({"answer": ans, **res})
    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)
    return {"ranking": results}
