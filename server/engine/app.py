# app.py
from fastapi import FastAPI, Query
from main import get_result
import uvicorn

app = FastAPI()

@app.get("/semantic-search/")
def search(filename: str = Query(...), query: str = Query(...), top_k: int = Query(3)):
    try:
        result = get_result(filename, query, top_k)
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

# Run with:
# uvicorn app:app --reload
