from pydantic import BaseModel
from typing import List

class EvalReq(BaseModel):
    question: str
    answer: str

class RankReq(BaseModel):
    question: str
    candidates: List[str]

class EvaluationResult(BaseModel):
    score: int
    summary: str
    improvement: str

class CandidateResult(EvaluationResult):
    answer: str

class RankResponse(BaseModel):
    ranking: List[CandidateResult]
