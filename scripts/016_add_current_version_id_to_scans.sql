ALTER TABLE scans
ADD COLUMN current_version_id UUID REFERENCES scan_versions(id) ON DELETE SET NULL;

