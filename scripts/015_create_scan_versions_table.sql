CREATE TABLE scan_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE NOT NULL,
    version_number INT NOT NULL,
    original_text TEXT NOT NULL,
    rewritten_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (scan_id, version_number)
);

ALTER TABLE scan_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view scan versions" ON scan_versions
FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM scans WHERE scans.id = scan_versions.scan_id AND scans.user_id = auth.uid())
);

CREATE POLICY "Authenticated users can insert scan versions" ON scan_versions
FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM scans WHERE scans.id = scan_versions.scan_id AND scans.user_id = auth.uid())
);

CREATE POLICY "Authenticated users can update scan versions" ON scan_versions
FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM scans WHERE scans.id = scan_versions.scan_id AND scans.user_id = auth.uid())
);

CREATE POLICY "Authenticated users can delete scan versions" ON scan_versions
FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM scans WHERE scans.id = scan_versions.scan_id AND scans.user_id = auth.uid())
);

