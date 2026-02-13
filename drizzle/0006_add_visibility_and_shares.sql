-- Add visibility column to notes table
ALTER TABLE notes ADD COLUMN visibility TEXT NOT NULL DEFAULT 'PRIVATE' CHECK (visibility IN ('PRIVATE','PUBLIC'));

-- Create index on visibility
CREATE INDEX IF NOT EXISTS idx_notes_visibility ON notes(visibility);

-- Create note_shares table
CREATE TABLE IF NOT EXISTS note_shares (
  note_id INTEGER NOT NULL,
  email TEXT NOT NULL, -- store normalized lower(trim(email))
  role TEXT NOT NULL DEFAULT 'READER' CHECK (role IN ('READER','EDITOR')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  created_by TEXT NOT NULL, -- who created the share (user email)

  PRIMARY KEY (note_id, email),
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- Create indexes on note_shares
CREATE INDEX IF NOT EXISTS idx_note_shares_email ON note_shares(email);
CREATE INDEX IF NOT EXISTS idx_note_shares_note_id ON note_shares(note_id);
