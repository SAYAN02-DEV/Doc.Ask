# # main.py
# from text_parser import extract_text_from_pdf
# from text_chunker import smart_token_chunk_text
# from embedding_generator import generate_embeddings
# from vector_store import FAISSVectorStore
# from sentence_transformers import SentenceTransformer

# # Step 1: Load and chunk
# filename = "doc-1753338594537.pdf"
# text = extract_text_from_pdf(filename)
# chunks = smart_token_chunk_text(text, max_tokens=512, overlap=50)

# # Step 2: Generate embeddings using E5 model
# model = SentenceTransformer('intfloat/e5-large-v2')
# # E5 requires prefixing chunks with "passage: "
# prefixed_chunks = [f"passage: {chunk}" for chunk in chunks]
# embeddings = model.encode(prefixed_chunks, show_progress_bar=True)

# # Step 3: Store in FAISS with correct dimension for E5
# store = FAISSVectorStore(dim=768)
# store.add_embeddings(embeddings.tolist(), chunks)
# store.save("vector.index", "metadata.pkl")

# # Step 4: Semantic Search
# # Load again (simulate separate process)
# store.load("vector.index", "metadata.pkl")

# # Step 5: Embed the query using the same model and "query: " prefix
# query = "46M, knee surgery, Pune, 3-month policy"
# query_embedding = model.encode(f"query: {query}")

# # Step 6: Perform semantic search
# results = store.search(query_embedding, top_k=3)
# print("\nTop results:")
# for i, res in enumerate(results, 1):
#     print(f"{i}. {res}\n")

#----------------faster one----------------
from text_parser import extract_text_from_pdf
from text_chunker import smart_token_chunk_text
from embedding_generator import generate_embeddings
from vector_store import FAISSVectorStore
from sentence_transformers import SentenceTransformer
from google.generativeai import configure, GenerativeModel
import os
from dotenv import load_dotenv


load_dotenv()

def semantic_search_from_file(filename: str, query: str, top_k: int = 3) -> str:
    # Step 1: Load and chunk
    text = extract_text_from_pdf(filename)
    chunks = smart_token_chunk_text(text, max_tokens=512, overlap=50)

    # Step 2: Generate embeddings using E5-base model
    model = SentenceTransformer('intfloat/e5-base-v2')
    prefixed_chunks = [f"passage: {chunk}" for chunk in chunks]
    embeddings = model.encode(prefixed_chunks, show_progress_bar=True)

    # Step 3: Store in FAISS with correct dimension for e5-base (768)
    store = FAISSVectorStore(dim=768)
    store.add_embeddings(embeddings.tolist(), chunks)
    store.save("vector.index", "metadata.pkl")

    # Step 4: Reload index (simulate separate process)
    store.load("vector.index", "metadata.pkl")

    # Step 5: Embed the query
    query_embedding = model.encode(f"query: {query}")

    # Step 6: Perform semantic search
    results = store.search(query_embedding, top_k=top_k)
    output = "The following are the most relevant chunks found:\n\n"
    output += "\n".join(f"{i}. {res.strip()}" for i, res in enumerate(results, 1))

    return output

def check_coverage_with_gemini(policy_chunks: str, user_query: str) -> str:
    # Get the key from environment
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")

    # Configure Gemini
    configure(api_key=gemini_api_key)

    model = GenerativeModel("models/gemini-1.5-flash")

    prompt = f"""
You are a helpful insurance assistant.

The user has a query about their insurance policy:
"{user_query}"

Below are the most relevant extracted parts of the policy document:
{policy_chunks}

Based on this content, does the insurance policy seem to cover the user's query? 
Please analyze carefully, and answer clearly. If not enough information is present, say so.
answer like if you are just answering to the customer, who posted the query.
"""

    response = model.generate_content(prompt)
    return response.text.strip()


def get_result(filename: str, query: str, top_k: int = 3) -> str:
    try:
        chunks = semantic_search_from_file(filename, query, top_k)
        result = check_coverage_with_gemini(chunks, query)
        return result
    except Exception as e:
        return f"Error: {str(e)}"
# Example usage
if __name__ == "__main__":
    filename = "doc-1753338594537.pdf"
    query = "46M, knee surgery, Pune, 3-month policy"
    result = get_result(filename, query, top_k=3)
    print(result)

