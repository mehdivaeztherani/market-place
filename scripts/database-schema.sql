-- Dubai Agents Marketplace Database Schema
-- This script creates the necessary tables for the MVP

-- Create database (if using PostgreSQL)
-- CREATE DATABASE dubai_agents_marketplace;

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    profile_image VARCHAR(255),
    address TEXT,
    bio TEXT,
    experience INTEGER,
    phone VARCHAR(20),
    email VARCHAR(100),
    instagram_handle VARCHAR(50),
    linkedin_handle VARCHAR(50),
    twitter_handle VARCHAR(50),
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent specialties table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS agent_specialties (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50) REFERENCES agents(id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent certifications table
CREATE TABLE IF NOT EXISTS agent_certifications (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50) REFERENCES agents(id) ON DELETE CASCADE,
    certification VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table for scraped Instagram content
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(50) PRIMARY KEY,
    agent_id VARCHAR(50) REFERENCES agents(id) ON DELETE CASCADE,
    caption TEXT,
    media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
    media_thumbnail VARCHAR(255),
    media_url VARCHAR(255),
    transcription TEXT,
    enhanced_content TEXT,
    post_date TIMESTAMP,
    original_url VARCHAR(255),
    instagram_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post hashtags table
CREATE TABLE IF NOT EXISTS post_hashtags (
    id SERIAL PRIMARY KEY,
    post_id VARCHAR(50) REFERENCES posts(id) ON DELETE CASCADE,
    hashtag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scraping logs table to track scraping activities
CREATE TABLE IF NOT EXISTS scraping_logs (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50) REFERENCES agents(id) ON DELETE CASCADE,
    instagram_handle VARCHAR(50),
    posts_scraped INTEGER DEFAULT 0,
    last_scraped_at TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('success', 'failed', 'partial')),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
CREATE INDEX IF NOT EXISTS idx_agents_experience ON agents(experience);
CREATE INDEX IF NOT EXISTS idx_agent_specialties_agent_id ON agent_specialties(agent_id);
CREATE INDEX IF NOT EXISTS idx_posts_agent_id ON posts(agent_id);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(post_date DESC);
CREATE INDEX IF NOT EXISTS idx_post_hashtags_post_id ON post_hashtags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_hashtags_hashtag ON post_hashtags(hashtag);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_agent_id ON scraping_logs(agent_id);

-- Insert sample data
INSERT INTO agents (id, name, profile_image, address, bio, experience, phone, email, instagram_handle, linkedin_handle, twitter_handle, rating, review_count) VALUES
('ahmed-hassan', 'Ahmed Hassan', '/placeholder.svg?height=400&width=400', 'Downtown Dubai, UAE', 'Experienced real estate professional specializing in luxury properties in Downtown Dubai and Dubai Marina. With over 8 years in the industry, I help clients find their dream homes and investment opportunities in Dubai''s most prestigious locations.', 8, '+971 50 123 4567', 'ahmed.hassan@dubaiagents.com', 'ahmed_dubai_properties', 'ahmed-hassan-dubai', 'ahmed_dubai_re', 4.9, 127),
('sarah-williams', 'Sarah Williams', '/placeholder.svg?height=400&width=400', 'Dubai Marina, UAE', 'British expat with 6 years of experience in Dubai''s real estate market. I specialize in helping international clients navigate the Dubai property market, with expertise in Marina, JBR, and Palm Jumeirah areas.', 6, '+971 55 987 6543', 'sarah.williams@dubaiagents.com', 'sarah_dubai_homes', 'sarah-williams-dubai-re', NULL, 4.8, 89),
('omar-al-mansouri', 'Omar Al Mansouri', '/placeholder.svg?height=400&width=400', 'Business Bay, UAE', 'Local Dubai expert with deep knowledge of emerging neighborhoods and off-plan developments. Specializing in Business Bay, DIFC, and upcoming areas with high growth potential.', 10, '+971 52 456 7890', 'omar.almansouri@dubaiagents.com', 'omar_dubai_expert', 'omar-al-mansouri-dubai', 'omar_dubai_prop', 4.9, 156);

-- Insert specialties
INSERT INTO agent_specialties (agent_id, specialty) VALUES
('ahmed-hassan', 'Luxury Properties'),
('ahmed-hassan', 'Downtown Dubai'),
('ahmed-hassan', 'Investment Properties'),
('ahmed-hassan', 'Off-Plan Sales'),
('sarah-williams', 'Dubai Marina'),
('sarah-williams', 'JBR'),
('sarah-williams', 'Palm Jumeirah'),
('sarah-williams', 'Expat Services'),
('omar-al-mansouri', 'Business Bay'),
('omar-al-mansouri', 'DIFC'),
('omar-al-mansouri', 'Off-Plan Developments'),
('omar-al-mansouri', 'Commercial Properties');

-- Insert certifications
INSERT INTO agent_certifications (agent_id, certification) VALUES
('ahmed-hassan', 'RERA Certified Agent'),
('ahmed-hassan', 'Dubai Real Estate Institute Graduate'),
('ahmed-hassan', 'Luxury Property Specialist'),
('sarah-williams', 'RERA Certified Agent'),
('sarah-williams', 'International Property Consultant'),
('omar-al-mansouri', 'RERA Certified Agent'),
('omar-al-mansouri', 'Commercial Real Estate Specialist'),
('omar-al-mansouri', 'Off-Plan Development Expert');

-- Insert sample posts
INSERT INTO posts (id, agent_id, caption, media_type, media_thumbnail, media_url, transcription, enhanced_content, post_date, original_url) VALUES
('post-1', 'ahmed-hassan', '🏙️ Just closed another amazing deal in Downtown Dubai! This stunning 2BR apartment with Burj Khalifa views is now home to a lovely family from the UK. The Dubai real estate market continues to show strong growth, especially in prime locations like this. #DubaiRealEstate #DowntownDubai #BurjKhalifaViews #PropertyInvestment', 'image', '/placeholder.svg?height=600&width=600', '/placeholder.svg?height=1200&width=1200', NULL, NULL, '2024-01-15 10:30:00', 'https://instagram.com/p/example1'),
('post-2', 'ahmed-hassan', '🎥 Take a virtual tour of this incredible penthouse in Downtown Dubai! Featuring panoramic city views, premium finishes, and access to world-class amenities. This is luxury living at its finest. Contact me for more details! #LuxuryLiving #PenthouseDubai #VirtualTour', 'video', '/placeholder.svg?height=600&width=600', '/placeholder.svg?height=1200&width=1200', 'Welcome to this stunning penthouse in the heart of Downtown Dubai. As you can see, the living area features floor-to-ceiling windows with breathtaking views of the Burj Khalifa and Dubai Fountain. The kitchen is equipped with top-of-the-line appliances and premium marble countertops.', NULL, '2024-01-12 14:45:00', 'https://instagram.com/p/example2'),
('post-3', 'sarah-williams', '🌊 Marina living at its best! Just listed this beautiful 1BR apartment with stunning marina views. Perfect for young professionals or as an investment property. The Dubai Marina continues to be one of the most sought-after locations for both residents and investors. #DubaiMarina #MarinaViews #InvestmentOpportunity', 'image', '/placeholder.svg?height=600&width=600', '/placeholder.svg?height=1200&width=1200', NULL, NULL, '2024-01-10 09:15:00', 'https://instagram.com/p/example3');

-- Insert hashtags
INSERT INTO post_hashtags (post_id, hashtag) VALUES
('post-1', 'DubaiRealEstate'),
('post-1', 'DowntownDubai'),
('post-1', 'BurjKhalifaViews'),
('post-1', 'PropertyInvestment'),
('post-2', 'LuxuryLiving'),
('post-2', 'PenthouseDubai'),
('post-2', 'VirtualTour'),
('post-3', 'DubaiMarina'),
('post-3', 'MarinaViews'),
('post-3', 'InvestmentOpportunity');

-- Create a view for agent summary with post counts
CREATE OR REPLACE VIEW agent_summary AS
SELECT 
    a.*,
    COUNT(p.id) as total_posts,
    MAX(p.post_date) as last_post_date,
    STRING_AGG(DISTINCT s.specialty, ', ') as specialties_list
FROM agents a
LEFT JOIN posts p ON a.id = p.agent_id
LEFT JOIN agent_specialties s ON a.id = s.agent_id
GROUP BY a.id, a.name, a.profile_image, a.address, a.bio, a.experience, a.phone, a.email, a.instagram_handle, a.linkedin_handle, a.twitter_handle, a.rating, a.review_count, a.created_at, a.updated_at;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
