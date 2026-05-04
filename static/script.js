// Tab Switching
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    let activeBtn;
    if (tab === 'single') {
        activeBtn = document.getElementById('btn-tab-single');
        document.getElementById('single-section').classList.add('active');
    } else {
        activeBtn = document.getElementById('btn-tab-batch');
        document.getElementById('batch-section').classList.add('active');
    }
    
    activeBtn.classList.add('active');
    
    const indicator = document.getElementById('tab-indicator');
    if (indicator) {
        indicator.style.width = `${activeBtn.offsetWidth}px`;
        indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    }
}

// Load Examples
function loadSingleExample() {
    const question = "Tell me about a time you had to handle a conflict at work.";
    const example = "I handled a conflict by first listening to my colleague's perspective to understand their core concern. Then, I explained my point of view calmly and we brainstormed a compromise that met both our project's deadline and quality standards. We documented the agreed approach to avoid future misunderstandings.";
    document.getElementById('single-question').value = question;
    document.getElementById('single-answer').value = example;
}

function loadBatchExample() {
    const question = "How do you handle difficult customers?";
    const example = `I would just tell the customer they are wrong and hang up.
---
I would apologize for the inconvenience, listen to their entire complaint without interrupting, and then offer a refund or replacement based on our policy.
---
I try to ignore angry customers and hope they calm down eventually.`;
    document.getElementById('batch-question').value = question;
    document.getElementById('batch-answers').value = example;
}

// API Calls
async function evaluateSingle() {
    const question = document.getElementById('single-question').value.trim();
    const answer = document.getElementById('single-answer').value.trim();
    if (!question || !answer) {
        alert("Please enter both a question and an answer.");
        return;
    }

    const loader = document.getElementById('single-loader');
    const resultDiv = document.getElementById('single-result');
    const btn = document.getElementById('btn-eval');
    
    // UI State
    btn.disabled = true;
    loader.classList.remove('hidden');
    loader.classList.add('active');
    resultDiv.classList.add('hidden');
    resultDiv.innerHTML = '';

    try {
        const response = await fetch('/evaluate-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question, answer: answer })
        });

        const data = await response.json();
        
        if (response.ok) {
            resultDiv.classList.remove('error');
            resultDiv.innerHTML = `
                <div class="score-badge">Score: ${data.score} / 5</div>
                <div class="result-item">
                    <strong>Summary</strong>
                    <p>${data.summary}</p>
                </div>
                <div class="result-item">
                    <strong>Suggested Improvement</strong>
                    <p>${data.improvement}</p>
                </div>
            `;
        } else {
            throw new Error(data.detail || "Failed to evaluate answer.");
        }
    } catch (error) {
        resultDiv.classList.add('error');
        resultDiv.innerHTML = `<p style="color: #ef4444;">Error: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        loader.classList.add('hidden');
        loader.classList.remove('active');
        resultDiv.classList.remove('hidden');
    }
}

async function rankBatch() {
    const question = document.getElementById('batch-question').value.trim();
    const rawInput = document.getElementById('batch-answers').value.trim();
    if (!question || !rawInput) {
        alert("Please enter a question and candidate answers.");
        return;
    }

    // Split by '---' and clean up empty ones
    const candidates = rawInput.split('---').map(ans => ans.trim()).filter(ans => ans.length > 0);
    
    if (candidates.length === 0) {
        alert("No valid candidates found. Please format correctly.");
        return;
    }

    const loader = document.getElementById('batch-loader');
    const resultDiv = document.getElementById('batch-result');
    const btn = document.getElementById('btn-rank');
    
    btn.disabled = true;
    loader.classList.remove('hidden');
    loader.classList.add('active');
    resultDiv.classList.add('hidden');
    resultDiv.innerHTML = '';

    try {
        const response = await fetch('/rank-candidates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question, candidates: candidates })
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.classList.remove('error');
            let html = `<h3>Ranking Results</h3><p style="margin-bottom: 15px; color: #94a3b8; font-size: 0.9rem;">From best to worst</p>`;
            
            data.ranking.forEach((candidate, index) => {
                const delay = index * 0.1;
                html += `
                    <div class="candidate-card" style="animation-delay: ${delay}s">
                        <div class="score-badge">Rank #${index + 1} • Score: ${candidate.score}/5</div>
                        <div class="result-item">
                            <strong>Answer Snippet</strong>
                            <p style="font-style: italic; color: #cbd5e1;">"${candidate.answer.substring(0, 100)}${candidate.answer.length > 100 ? '...' : ''}"</p>
                        </div>
                        <div class="result-item">
                            <strong>Summary</strong>
                            <p>${candidate.summary}</p>
                        </div>
                        <div class="result-item">
                            <strong>Improvement</strong>
                            <p>${candidate.improvement}</p>
                        </div>
                    </div>
                `;
            });
            resultDiv.innerHTML = html;
        } else {
            throw new Error(data.detail || "Failed to rank candidates.");
        }
    } catch (error) {
        resultDiv.classList.add('error');
        resultDiv.innerHTML = `<p style="color: #ef4444;">Error: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        loader.classList.add('hidden');
        loader.classList.remove('active');
        resultDiv.classList.remove('hidden');
    }
}

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Init Tab Indicator
    setTimeout(() => {
        const activeBtn = document.querySelector('.tab-btn.active');
        const indicator = document.getElementById('tab-indicator');
        if (activeBtn && indicator) {
            indicator.style.width = `${activeBtn.offsetWidth}px`;
            indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
        }
    }, 50);

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });
});
