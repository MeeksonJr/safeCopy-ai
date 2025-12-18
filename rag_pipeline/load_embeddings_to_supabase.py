# rag_pipeline/load_embeddings_to_supabase.py
import os
import json
from supabase import create_client, Client

# Initialize Supabase client
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("Supabase URL and Service Role Key must be set in environment variables")

# Use service role key for inserting data to bypass RLS for this operation
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async def load_embeddings(embedded_file="embedded_data.json"):
    """Loads embeddings from a JSON file into the Supabase legal_documents table."""
    if not os.path.exists(embedded_file):
        print(f"Error: {embedded_file} not found. Please run embedder.py first.")
        return

    with open(embedded_file, 'r', encoding='utf-8') as f:
        embeddings_data = json.load(f)

    print(f"Attempting to load {len(embeddings_data)} documents into Supabase...")

    for item in embeddings_data:
        source_url_from_filename = item["source_file"].replace('_', '/').replace('.txt', '').replace('scraped_data', '')
        # Reconstruct a more readable URL if possible, or just use the sanitized filename as URL
        # For better data quality, `scraper.py` should ideally store the original URL
        original_url = f"https://{source_url_from_filename}"

        response = await supabase.from("legal_documents").insert({
            "source_url": original_url,
            "content": item["content"],
            "embedding": item["embedding"]
        }).execute()

        if response.data:
            print(f"Inserted document from {item["source_file"]}")
        elif response.error:
            print(f"Error inserting document {item["source_file"]}: {response.error}")
        else:
            print(f"Unknown response when inserting {item["source_file"]}")

    print("Finished loading embeddings.")

if __name__ == "__main__":
    import asyncio
    asyncio.run(load_embeddings())

