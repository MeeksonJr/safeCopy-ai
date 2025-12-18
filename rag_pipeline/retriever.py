# rag_pipeline/retriever.py
import os
import json
from supabase import create_client, Client
# from openai import OpenAI # Or your Gemini Python SDK
import asyncio # Import asyncio for running async Supabase calls
import sys

# Assuming generate_embedding is available from embedder.py or a shared utility
from embedder import generate_embedding # For local testing

# Initialize Supabase client
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    # Fallback to anon key if service role not available, for read-only RPC
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
elif SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
else:
    raise ValueError("Supabase URL and Anon Key/Service Role Key must be set in environment variables")

async def async_retrieve_relevant_documents(query_text: str, match_count: int = 3) -> list[dict]:
    """Retrieves the most semantically similar legal documents from Supabase."""
    query_embedding = generate_embedding(query_text)

    try:
        # Ensure the vector extension is enabled and the table has a vector column
        response = await supabase.rpc(
            'match_documents',
            {
                'query_embedding': query_embedding,
                'match_count': match_count,
                'filter': {}
            }
        ).execute()

        if response.data:
            # Return a list of dictionaries, including content and similarity
            return [{'content': doc['content'], 'similarity': doc['similarity']} for doc in response.data]
        return []
    except Exception as e:
        print(f"Error retrieving documents from Supabase: {e}", file=sys.stderr)
        return []

def retrieve_relevant_documents_sync(query_text: str, match_count: int = 3) -> list[dict]:
    """Synchronous wrapper for retrieving relevant documents."""
    return asyncio.run(async_retrieve_relevant_documents(query_text, match_count))

if __name__ == "__main__":
    # This block is executed when the script is run directly, e.g., by Node.js child_process
    if len(sys.argv) < 2:
        print("Usage: python retriever.py \"<query_text>\"", file=sys.stderr)
        sys.exit(1)

    query_text = sys.argv[1]
    
    # Set environment variables for local testing or when execPromise runs it
    # In a Next.js environment, these should be passed from the Node.js process.
    os.environ["NEXT_PUBLIC_SUPABASE_URL"] = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:54321") # Default for local Supabase
    os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "YOUR_ANON_KEY")
    os.environ["SUPABASE_SERVICE_ROLE_KEY"] = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "YOUR_SERVICE_ROLE_KEY")

    try:
        relevant_docs = retrieve_relevant_documents_sync(query_text)
        print(json.dumps(relevant_docs)) # Print JSON to stdout for Node.js to capture
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
