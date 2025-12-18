-- Function to perform vector similarity search for legal documents
CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding VECTOR(768),
  match_count INTEGER DEFAULT NULL,
  filter JSONB DEFAULT '{}'
)
RETURNS TABLE (
  id UUID,
  source_url TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    id,
    source_url,
    content,
    1 - (legal_documents.embedding <=> query_embedding) AS similarity
  FROM
    public.legal_documents
  WHERE (
    CASE
      WHEN filter IS NULL OR jsonb_build_array() = filter THEN TRUE
      ELSE jsonb_path_exists(to_jsonb(legal_documents), filter)
    END
  )
  ORDER BY
    legal_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

