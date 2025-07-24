# from sentence_transformers import SentenceTransformer
# from typing import List

# Load the advanced E5 model
# model = SentenceTransformer('intfloat/e5-large-v2')

# def generate_embeddings(chunks: List[str]) -> List[List[float]]:
#     # E5 models expect "passage: " prefix for document chunks
#     prefixed_chunks = [f"passage: {chunk}" for chunk in chunks]
#     embeddings = model.encode(prefixed_chunks, show_progress_bar=True)
#     return embeddings.tolist()
#------------------------------faster---------------
from sentence_transformers import SentenceTransformer
from typing import List

# Load the lighter and faster E5 model
model = SentenceTransformer('intfloat/e5-base-v2')

def generate_embeddings(chunks: List[str]) -> List[List[float]]:
    # E5 models expect "passage: " prefix for document chunks
    prefixed_chunks = [f"passage: {chunk}" for chunk in chunks]
    embeddings = model.encode(prefixed_chunks, show_progress_bar=True)
    return embeddings.tolist()



# # For testing
# if __name__ == "__main__":
#     from text_parser import extract_text_from_pdf
#     from text_chunker import smart_token_chunk_text

#     filename = "doc-1753338594537.pdf"
#     text = extract_text_from_pdf(filename)
#     chunks = smart_token_chunk_text(text, max_tokens=512, overlap=50)

#     print(f"Total chunks: {len(chunks)}")
#     embeddings = generate_embeddings(chunks)

#     print(f"Embedding of first chunk (dim={len(embeddings[0])}):\n{embeddings[0]}")
