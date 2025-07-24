from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np

# Load the model once (you can move this to a singleton or app-level init)
model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embeddings(chunks: List[str]) -> List[List[float]]:
    """
    Generates embeddings for each chunk of text using all-MiniLM-L6-v2.
    
    Args:
        chunks (List[str]): List of text chunks.

    Returns:
        List[List[float]]: List of 384-dimension embeddings.
    """
    embeddings = model.encode(chunks, show_progress_bar=True)
    return embeddings.tolist()  # Optional: convert from numpy to pure Python

# For testing
if __name__ == "__main__":
    from text_parser import extract_text_from_pdf
    from text_chunker import smart_token_chunk_text

    filename = "doc-1753338594537.pdf"
    text = extract_text_from_pdf(filename)
    chunks = smart_token_chunk_text(text, max_tokens=512, overlap=50)

    print(f"Total chunks: {len(chunks)}")
    embeddings = generate_embeddings(chunks)

    print(f"Embedding of first chunk (dim={len(embeddings[0])}):\n{embeddings[0]}")
