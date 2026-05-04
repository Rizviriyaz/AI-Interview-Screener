import asyncio
from fastapi import APIRouter, HTTPException
from app.models.schemas import EvalReq, RankReq, RankResponse, CandidateResult
from app.services.llm import llm_service

router = APIRouter()

async def evaluate_single_answer(question: str, answer: str) -> dict:
    prompt = f"""
Evaluate this interview answer to the following question briefly.

Question: {question}
Answer: {answer}

Return ONLY JSON:
{{
  "score": 1-5,
  "summary": "one-line summary",
  "improvement": "one improvement"
}}
"""
    raw_output = await llm_service.ask_llama(prompt)
    return llm_service.parse_json_output(raw_output)

@router.post("/evaluate-answer")
async def evaluate(req: EvalReq):
    return await evaluate_single_answer(req.question, req.answer)

@router.post("/rank-candidates", response_model=RankResponse)
async def rank(req: RankReq):
    # Process all candidates concurrently!
    tasks = [evaluate_single_answer(req.question, ans) for ans in req.candidates]
    
    try:
        results_data = await asyncio.gather(*tasks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during parallel evaluation: {str(e)}")
    
    # Combine original answers with LLM results
    final_results = []
    for ans, res in zip(req.candidates, results_data):
        final_results.append(CandidateResult(answer=ans, **res))
    
    # Sort by score descending
    final_results.sort(key=lambda x: x.score, reverse=True)
    
    return RankResponse(ranking=final_results)
