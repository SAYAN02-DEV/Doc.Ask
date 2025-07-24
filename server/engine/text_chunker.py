import re
from typing import List
import tiktoken

def get_token_count(text: str, encoding_name="cl100k_base") -> int:
    encoding = tiktoken.get_encoding(encoding_name)
    return len(encoding.encode(text))

def encode_text(text: str, encoding_name="cl100k_base") -> List[int]:
    encoding = tiktoken.get_encoding(encoding_name)
    return encoding.encode(text)

def decode_tokens(tokens: List[int], encoding_name="cl100k_base") -> str:
    encoding = tiktoken.get_encoding(encoding_name)
    return encoding.decode(tokens)

def sentence_split(text: str) -> List[str]:
    """Splits text into sentences using punctuation as boundaries."""
    return re.split(r'(?<=[.!?]) +', text)

def smart_token_chunk_text(
    text: str,
    max_tokens: int = 512,
    overlap: int = 50,
    encoding_name: str = "cl100k_base"
) -> List[str]:
    """
    Token-based smart chunking with sentence boundaries and overlap.
    
    Args:
        text (str): The full cleaned text.
        max_tokens (int): Max tokens per chunk.
        overlap (int): Number of tokens to overlap between chunks.
        encoding_name (str): The tokenizer encoding name.
    
    Returns:
        List[str]: List of chunks.
    """
    encoding = tiktoken.get_encoding(encoding_name)
    sentences = sentence_split(text)
    chunks = []
    current_tokens = []
    current_chunk = ""

    for sentence in sentences:
        sentence_tokens = encoding.encode(sentence)

        if len(current_tokens) + len(sentence_tokens) <= max_tokens:
            current_tokens += sentence_tokens
            current_chunk += " " + sentence
        else:
            # Finalize current chunk
            chunks.append(current_chunk.strip())

            # Start new chunk with overlap
            if overlap > 0:
                overlap_tokens = current_tokens[-overlap:]
                current_tokens = overlap_tokens + sentence_tokens
                current_chunk = decode_tokens(overlap_tokens, encoding_name) + " " + sentence
            else:
                current_tokens = sentence_tokens
                current_chunk = sentence

    # Add last chunk
    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks

# For testing
if __name__ == "__main__":
    from text_parser import extract_text_from_pdf

    filename = "doc-1753338594537.pdf"
    text = extract_text_from_pdf(filename)

    chunks = smart_token_chunk_text(
        text,
        max_tokens=512,  # You can set 1024 or 2048 depending on your model
        overlap=50
    )

    for i, chunk in enumerate(chunks):
        print(f"\n--- Chunk {i + 1} --- ({get_token_count(chunk)} tokens)\n{chunk[:300]}...\n")
