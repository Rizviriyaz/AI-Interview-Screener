# AI Interview Screener

A premium, full-stack application built with **FastAPI** that evaluates candidate answers using an LLM (LLaMA/Claude/ChatGPT) and ranks multiple candidates based on their scores. It features a beautiful, dynamic, glassmorphism UI with smooth scroll animations.

GitHub repository: [https://github.com/Rizviriyaz/ai-interview-screener](https://github.com/Rizviriyaz/ai-interview-screener.git)

---

## Features

1. **Premium Web Interface**
   - Light theme with pastel floating shapes and a frosted glass effect.
   - Smooth `IntersectionObserver` scroll animations and dynamic slider tabs.
   - Elegant typography using *Playfair Display* and *Plus Jakarta Sans*.

2. **/evaluate-answer**  
   - Accepts an **Interview Question** and a single candidate answer.
   - Returns a JSON response (rendered beautifully in the UI) with:
     - `score` (1–5)  
     - `summary` (one-line summary)  
     - `improvement` (one suggestion)

3. **/rank-candidates**  
   - Accepts an **Interview Question** and a list of candidate answers.
   - Returns a JSON array of candidates sorted by score (DESC) and renders them with staggered animations.
   - Each candidate object contains the `score`, `summary`, and `improvement`.

---

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rizviriyaz/ai-interview-screener.git
   cd ai-interview-screener
   ```

2. **Environment Configuration**
   Copy the example environment file and customize it for your local LLM setup:
   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**
   ```bash
   python main.py
   ```
   *The stunning UI will now be available at `http://localhost:8000/`*
