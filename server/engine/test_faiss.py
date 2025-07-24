# test_faiss.py

from faiss_store import upsert_chunks, search_query

chunks = [
    "The mitochondria is the powerhouse of the cell.",
    "Einstein developed the theory of relativity.",
    "Water boils at 100 degrees Celsius.",
    "Python is a programming language commonly used in data science.",
    "The capital of France is Paris."
]

# Store chunks
upsert_chunks(chunks)

# Run a search query
results = search_query("What is the capital of France?")
print("\n🔍 Top Results:")
print("-",results[0])
