# AI Interview Screener

A lightweight backend service built with **FastAPI** that evaluates candidate answers using an LLM (LLaMA/Claude/ChatGPT) and ranks multiple candidates based on their scores.

GitHub repository: [https://github.com/Rizviriyaz/ai-interview-screener](https://github.com/Rizviriyaz/ai-interview-screener.git)

---

## Features

1. **/evaluate-answer**  
   - Accepts a single candidate answer  
   - Returns a JSON response with:
     - `score` (1–5)  
     - `summary` (one-line summary)  
     - `improvement` (one suggestion)

2. **/rank-candidates**  
   - Accepts a list of candidate answers  
   - Returns a JSON array of candidates sorted by score (DESC)  
   - Each candidate object contains:
     - `answer`  
     - `score`  
     - `summary`  
     - `improvement`

---

## Installation

```bash
git clone https://github.com/Rizviriyaz/ai-interview-screener.git
cd ai-interview-screener
pip install -r requirements.txt
