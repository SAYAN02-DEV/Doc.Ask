from fastapi import FastAPI
from pydantic import BaseModel
from main import get_result
from main import pre_processing
import uvicorn

app = FastAPI()

# Define the expected request body using Pydantic
class SearchRequest(BaseModel):
    filename: str
    query: str
    top_k: int = 3  # Optional, default = 3

class PreProcessRequest(BaseModel):
    filename: str


@app.post("/semantic-search/")
def search(data: SearchRequest):
    try:
        result = get_result(data.filename, data.query, data.top_k)
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/pre-process/")
def process(data: PreProcessRequest):
    try:
        result = pre_processing(data.filename)
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

# Run with:
# uvicorn app:app --reload
