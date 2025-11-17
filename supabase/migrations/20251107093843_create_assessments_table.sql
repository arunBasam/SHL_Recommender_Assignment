/*
  # Create SHL Assessments Table

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key) - Unique identifier for each assessment
      - `url` (text, unique, not null) - Assessment URL from SHL catalog
      - `name` (text, not null) - Name of the assessment
      - `description` (text) - Detailed description of the assessment
      - `test_type` (text[]) - Array of test types (e.g., "Knowledge & Skills", "Personality & Behavior")
      - `adaptive_support` (text) - Whether adaptive testing is supported ("Yes"/"No")
      - `remote_support` (text) - Whether remote testing is supported ("Yes"/"No")
      - `duration` (integer) - Duration of assessment in minutes
      - `embedding` (vector(768)) - Text embedding for semantic search
      - `raw_data` (jsonb) - Store any additional scraped data
      - `created_at` (timestamptz) - Timestamp of record creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `assessments` table
    - Add policy for public read access (assessments are public data)
    - Add policy for authenticated insert/update (for admin operations)

  3. Indexes
    - Create index on test_type for filtering
    - Create index on name for text search
*/

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  test_type text[] DEFAULT '{}',
  adaptive_support text DEFAULT 'No',
  remote_support text DEFAULT 'No',
  duration integer DEFAULT 0,
  embedding vector(768),
  raw_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read assessments (public data)
CREATE POLICY "Public read access to assessments"
  ON assessments
  FOR SELECT
  TO public
  USING (true);

-- Policy: Authenticated users can insert assessments
CREATE POLICY "Authenticated users can insert assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update assessments
CREATE POLICY "Authenticated users can update assessments"
  ON assessments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_assessments_test_type ON assessments USING GIN (test_type);
CREATE INDEX IF NOT EXISTS idx_assessments_name ON assessments USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_assessments_description ON assessments USING GIN (to_tsvector('english', description));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();