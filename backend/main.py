from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.sort import router as sort_router

app = FastAPI(title="SortViz API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sort_router, prefix="/api")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
