/*
# Add Title Column to Posts Table

1. Database Changes
   - Add `title` column to posts table
   - Update existing posts with default Persian titles
   - Ensure proper indexing for search functionality

2. Data Migration
   - Add title column with VARCHAR(255) type
   - Set default values for existing posts
   - Create index for better search performance
*/

-- Add title column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS title VARCHAR(255) AFTER agent_id;

-- Update existing posts with default Persian titles based on content
UPDATE posts 
SET title = CASE 
    WHEN title IS NULL OR title = '' THEN 
        CONCAT('املاک ویژه شماره ', 
               (SELECT COUNT(*) + 1 FROM posts p2 WHERE p2.agent_id = posts.agent_id AND p2.id < posts.id))
    ELSE title 
END
WHERE title IS NULL OR title = '';

-- Create index for title search
CREATE INDEX IF NOT EXISTS idx_posts_title ON posts(title);

-- Show updated structure
DESCRIBE posts;

-- Show sample titles
SELECT id, agent_id, title, LEFT(content, 50) as content_preview 
FROM posts 
ORDER BY created_at DESC 
LIMIT 5;