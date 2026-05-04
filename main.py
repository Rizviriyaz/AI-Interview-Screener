from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
import os
from app.api.endpoints import router as api_router
from app.config import config

app = FastAPI(
    title="AI Interview Screener API",
    description="Professional AI-powered interview evaluation system",
    version="2.0.0"
)

# Include the modular routes
app.include_router(api_router)

# Mount static files for frontend
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
else:
    @app.get("/", include_in_schema=False)
    def home():
        return RedirectResponse(url="/docs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=config.DEBUG)
