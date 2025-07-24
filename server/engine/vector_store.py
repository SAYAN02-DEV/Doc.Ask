# vector_store.py
import faiss
import numpy as np
import pickle

class FAISSVectorStore:
    def __init__(self, dim: int = 384):
        self.index = faiss.IndexFlatL2(dim)
        self.text_chunks = []

    def add_embeddings(self, embeddings: list, chunks: list):
        vectors = np.array(embeddings).astype('float32')
        self.index.add(vectors)
        self.text_chunks.extend(chunks)

    def save(self, index_path: str, metadata_path: str):
        faiss.write_index(self.index, index_path)
        with open(metadata_path, 'wb') as f:
            pickle.dump(self.text_chunks, f)

    def load(self, index_path: str, metadata_path: str):
        self.index = faiss.read_index(index_path)
        with open(metadata_path, 'rb') as f:
            self.text_chunks = pickle.load(f)

    def search(self, query_embedding: list, top_k: int = 5):
        query_vector = np.array([query_embedding]).astype('float32')
        distances, indices = self.index.search(query_vector, top_k)
        results = [self.text_chunks[i] for i in indices[0]]
        return results
