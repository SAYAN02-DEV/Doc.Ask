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
# main.py
from text_parser import extract_text_from_pdf
from text_chunker import smart_token_chunk_text
from embedding_generator import generate_embeddings
from vector_store import FAISSVectorStore
from sentence_transformers import SentenceTransformer

# Step 1: Load and chunk
filename = "doc-1753338594537.pdf"
text = extract_text_from_pdf(filename)
chunks = smart_token_chunk_text(text, max_tokens=512, overlap=50)

# Step 2: Generate embeddings using E5-base model
model = SentenceTransformer('intfloat/e5-base-v2')
# E5 requires prefixing chunks with "passage: "
prefixed_chunks = [f"passage: {chunk}" for chunk in chunks]
embeddings = model.encode(prefixed_chunks, show_progress_bar=True)

# Step 3: Store in FAISS with correct dimension for e5-base (768)
store = FAISSVectorStore(dim=768)
store.add_embeddings(embeddings.tolist(), chunks)
store.save("vector.index", "metadata.pkl")

# Step 4: Semantic Search
# Load again (simulate separate process)
store.load("vector.index", "metadata.pkl")

# Step 5: Embed the query using same model and "query: " prefix
query = "46M, knee surgery, Pune, 3-month policy"
query_embedding = model.encode(f"query: {query}")

# Step 6: Perform semantic search
results = store.search(query_embedding, top_k=3)
print("\nTop results:")
for i, res in enumerate(results, 1):
    print(f"{i}. {res}\n")
