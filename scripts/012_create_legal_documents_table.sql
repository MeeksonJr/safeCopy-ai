-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create legal_documents table to store scraped content and its embeddings
CREATE TABLE IF NOT EXISTS public.legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(768), -- Assuming a 768-dimensional embedding from Gemini or similar model
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a HNSW index for efficient similarity search (optional, but highly recommended for performance)
CREATE INDEX IF NOT EXISTS idx_legal_documents_embedding ON public.legal_documents USING hnsw (embedding vector_cosine_ops);

-- Enable Row Level Security (RLS) on legal_documents (if needed, but usually RAG source data is public)
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- Optional: Add RLS policy if you want to restrict access to legal documents
-- For a general legal RAG system, this table might not need strict RLS.
-- CREATE POLICY "Enable read access for all users" ON public.legal_documents FOR SELECT USING (true);

