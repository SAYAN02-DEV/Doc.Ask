from text_parser import extract_text_from_pdf
from text_chunker import smart_token_chunk_text
from embedding_generator import generate_embeddings
from vector_store import FAISSVectorStore
from sentence_transformers import SentenceTransformer
from google.generativeai import configure, GenerativeModel
import os
from dotenv import load_dotenv


load_dotenv()
#this function is to be run once only when the user uploads a file
def pre_processing(filename: str):
    # Folder where user's data will be stored
    user_dir = os.path.join("uploads", filename)

    # Ensure the folder exists
    os.makedirs(user_dir, exist_ok=True)
    index_path = f"uploads/{filename}/vector.index"
    meta_path = f"uploads/{filename}/metadata.pkl"
    

    text = extract_text_from_pdf(filename)
    chunks = smart_token_chunk_text(text, max_tokens=512, overlap=50)
    model = SentenceTransformer('intfloat/e5-base-v2')
    prefixed_chunks = [f"passage: {chunk}" for chunk in chunks]
    embeddings = model.encode(prefixed_chunks, show_progress_bar=True)
    store = FAISSVectorStore(dim=768)
    store.add_embeddings(embeddings.tolist(), chunks)
    store.save(index_path, meta_path)

#this function is to be run per query
def semantic_search_from_file(filename:str, query: str, top_k: int = 3) -> str:
    index_path = f"uploads/{filename}/vector.index"
    meta_path = f"uploads/{filename}/metadata.pkl"
    model = SentenceTransformer('intfloat/e5-base-v2')
    store = FAISSVectorStore(dim=768)
    store.load(index_path, meta_path)
    query_embedding = model.encode(f"query: {query}")
    results = store.search(query_embedding, top_k=top_k)
    output = "The following are the most relevant chunks found:\n\n"
    output += "\n".join(f"{i}. {res.strip()}" for i, res in enumerate(results, 1))
    # Get the key from environment
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")

    # Configure Gemini
    configure(api_key=gemini_api_key)

    model = GenerativeModel("models/gemini-1.5-flash")

    prompt = f"""
You are a helpful insurance assistant.

The user has a query about the document:
"{query}"

Below are the most relevant extracted parts of the document:
{output}

Based on this content, answer the query.
Please analyze carefully, and answer clearly. If not enough information is present, say so.
answer like if you are just answering to the customer, who posted the query.
"""

    response = model.generate_content(prompt)
    return response.text.strip()


def get_result(filename: str, query: str, top_k: int = 3) -> str:
    try:
        result = semantic_search_from_file(filename, query, top_k)
        return result
    except Exception as e:
        return f"Error: {str(e)}"
# Example usage
if __name__ == "__main__":
    filename = "doc-1753338594537.pdf"
    query = "46M, knee surgery, Pune, 3-month policy"
    result = get_result(filename, query, top_k=3)
    print(result)

