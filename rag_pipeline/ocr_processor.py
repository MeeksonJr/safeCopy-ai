# rag_pipeline/ocr_processor.py

import pytesseract
from PIL import Image
import io
import base64
import sys
import cv2
import numpy as np
import fitz # PyMuPDF

def preprocess_image(image: Image.Image) -> Image.Image:
    # Convert PIL Image to NumPy array
    img_np = np.array(image)

    # Convert to grayscale
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY) if len(img_np.shape) == 3 else img_np

    # Apply median blur for denoising
    denoised = cv2.medianBlur(gray, 3)

    # Apply Otsu's binarization
    _, binarized = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Convert NumPy array back to PIL Image
    return Image.fromarray(binarized)

def process_ocr(file_buffer_base64: str, file_type: str) -> str:
    try:
        # Decode the base64 string
        file_bytes = base64.b64decode(file_buffer_base64)
        extracted_text = []

        if file_type.startswith("image/"):
            image = Image.open(io.BytesIO(file_bytes))
            processed_image = preprocess_image(image)
            text = pytesseract.image_to_string(processed_image)
            extracted_text.append(text)
        elif file_type == "application/pdf":
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page_num in range(doc.page_count):
                page = doc.load_page(page_num)
                # Render page to an image (PIL Image)
                pix = page.get_pixmap()
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                processed_image = preprocess_image(img)
                text = pytesseract.image_to_string(processed_image)
                extracted_text.append(text)
            doc.close()
        else:
            return "Unsupported file type for OCR."

        return "\n".join(extracted_text).strip()
    except Exception as e:
        return f"OCR Error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) > 2:
        base64_content = sys.argv[1]
        file_mime_type = sys.argv[2]
        result = process_ocr(base64_content, file_mime_type)
        print(result)
    else:
        print("Usage: python ocr_processor.py <base64_file_content> <file_mime_type>")
