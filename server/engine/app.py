from fastapi import FastAPI
from pydantic import BaseModel
from main import get_result
import uvicorn

app = FastAPI()

# Define the expected request body using Pydantic
class SearchRequest(BaseModel):
    filename: str
    query: str
    top_k: int = 3  # Optional, default = 3

@app.post("/semantic-search/")
def search(data: SearchRequest):
    try:
        result = get_result(data.filename, data.query, data.top_k)
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}


# Run with:
# uvicorn app:app --reload
