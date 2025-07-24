import fitz  # PyMuPDF
import os
import re
import unicodedata
from collections import Counter

def extract_text_from_pdf(filename: str) -> str:
    uploads_path = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    pdf_path = os.path.join(uploads_path, filename)

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")

    doc = fitz.open(pdf_path)
    text_blocks = []

    for page in doc:
        blocks = page.get_text("dict")["blocks"]
        for block in blocks:
            if "lines" in block:
                for line in block["lines"]:
                    line_text = ""
                    ignore = False
                    for span in line["spans"]:
                        # Ignore watermark-like spans
                        if span.get("opacity", 1.0) < 0.5:  # Transparent text
                            ignore = True
                        if abs(span.get("origin", [0])[1] - page.rect.height / 2) < 50 and span.get("size", 0) < 10:
                            ignore = True
                        line_text += span["text"]
                    if not ignore and line_text.strip():
                        text_blocks.append(line_text)

    doc.close()

    # Remove repetitive watermarks by frequency (e.g., logos)
    cleaned_blocks = remove_repeated_lines(text_blocks)
    full_text = "\n".join(cleaned_blocks)

    return clean_text(full_text)

def remove_repeated_lines(lines, frequency_threshold=0.6):
    """
    Removes lines that are repeated on most pages (likely watermarks).
    """
    line_counts = Counter(lines)
    num_lines = len(lines)
    return [line for line in lines if line_counts[line] / num_lines < frequency_threshold]

def clean_text(text: str, lowercase=True, keep_punctuation=False) -> str:
    # Normalize unicode characters
    text = unicodedata.normalize("NFKD", text)

    # Remove hyphenated line breaks
    text = re.sub(r'-\n', '', text)

    # Remove page numbers like "Page 1", "Page 2 of 10"
    text = re.sub(r'Page\s+\d+(\s+of\s+\d+)?', '', text, flags=re.IGNORECASE)

    # Remove headers/footers (common terms or URLs)
    text = re.sub(r'\n.*(Confidential|https?:\/\/\S+).*?\n', '\n', text, flags=re.IGNORECASE)

    # Normalize whitespace
    text = re.sub(r'[\n\r\t]+', ' ', text)
    text = re.sub(r'\s+', ' ', text)

    # Remove extra punctuation
    if not keep_punctuation:
        text = re.sub(r'[^\w\s.,;:!?\'"-]', '', text)

    # Lowercase
    if lowercase:
        text = text.lower()

    return text.strip()

# For standalone testing
if __name__ == "__main__":
    filename = "doc-1753338594537.pdf"
    try:
        content = extract_text_from_pdf(filename)
        print(content)
    except Exception as e:
        print(f"Error: {e}")
