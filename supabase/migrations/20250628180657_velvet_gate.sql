-- Dubai Agents Marketplace Database Schema
-- Run this script to create the database structure

CREATE DATABASE IF NOT EXISTS dubai_marketplace;
USE dubai_marketplace;

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    profile_image VARCHAR(255),
    address TEXT,
    bio TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    instagram VARCHAR(50),
    twitter VARCHAR(50),
    linkedin VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(50) PRIMARY KEY,
    agent_id VARCHAR(50),
    title VARCHAR(255),
    content TEXT,
    transcription TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
    media_thumbnail VARCHAR(255),
    caption TEXT,
    original_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
CREATE INDEX IF NOT EXISTS idx_posts_agent_id ON posts(agent_id);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);

-- Insert sample data
INSERT INTO agents (id, name, profile_image, address, bio, phone, email, instagram, twitter, linkedin) VALUES
('ahmed-hassan', 'Ahmed Hassan', '/placeholder.svg?height=400&width=400', 'Downtown Dubai, UAE', 'Experienced real estate professional specializing in luxury properties in Downtown Dubai and Dubai Marina. With over 8 years in the industry, I help clients find their dream homes and investment opportunities in Dubai\'s most prestigious locations.', '+971 50 123 4567', 'ahmed.hassan@dubaiagents.com', 'ahmed_dubai_properties', 'ahmed_dubai_re', 'ahmed-hassan-dubai'),
('sarah-williams', 'Sarah Williams', '/placeholder.svg?height=400&width=400', 'Dubai Marina, UAE', 'British expat with 6 years of experience in Dubai\'s real estate market. I specialize in helping international clients navigate the Dubai property market, with expertise in Marina, JBR, and Palm Jumeirah areas.', '+971 55 987 6543', 'sarah.williams@dubaiagents.com', 'sarah_dubai_homes', NULL, 'sarah-williams-dubai-re'),
('omar-al-mansouri', 'Omar Al Mansouri', '/placeholder.svg?height=400&width=400', 'Business Bay, UAE', 'Local Dubai expert with deep knowledge of emerging neighborhoods and off-plan developments. Specializing in Business Bay, DIFC, and upcoming areas with high growth potential.', '+971 52 456 7890', 'omar.almansouri@dubaiagents.com', 'omar_dubai_expert', 'omar_dubai_prop', 'omar-al-mansouri-dubai'),
('priya-sharma', 'Priya Sharma', '/placeholder.svg?height=400&width=400', 'Jumeirah Village Circle, UAE', 'Dedicated to helping families find perfect homes in Dubai\'s family-friendly communities. Expert in JVC, JVT, and other emerging residential areas with great amenities and schools.', '+971 56 234 5678', 'priya.sharma@dubaiagents.com', 'priya_dubai_families', NULL, 'priya-sharma-dubai-homes'),
('james-mitchell', 'James Mitchell', '/placeholder.svg?height=400&width=400', 'Dubai Hills Estate, UAE', 'Luxury property specialist focusing on Dubai Hills Estate, Emirates Hills, and other premium golf course communities. Helping high-net-worth individuals find exclusive properties.', '+971 50 345 6789', 'james.mitchell@dubaiagents.com', 'james_luxury_dubai', 'james_dubai_luxury', 'james-mitchell-luxury-re'),
('fatima-al-zahra', 'Fatima Al Zahra', '/placeholder.svg?height=400&width=400', 'Arabian Ranches, UAE', 'Specializing in villa communities and family-oriented developments. Expert in Arabian Ranches, Mudon, and other established villa communities with strong community feel.', '+971 55 678 9012', 'fatima.alzahra@dubaiagents.com', 'fatima_dubai_villas', NULL, 'fatima-al-zahra-dubai');

-- Insert sample posts
INSERT INTO posts (id, agent_id, title, content, caption, media_type, media_thumbnail, transcription, date, original_url) VALUES
('post-1', 'ahmed-hassan', 'Stunning Downtown Dubai Apartment', 'Beautiful 2BR apartment with Burj Khalifa views', '🏙️ Just closed another amazing deal in Downtown Dubai! This stunning 2BR apartment with Burj Khalifa views is now home to a lovely family from the UK. The Dubai real estate market continues to show strong growth, especially in prime locations like this. #DubaiRealEstate #DowntownDubai #BurjKhalifaViews #PropertyInvestment', 'image', '/placeholder.svg?height=600&width=600', NULL, '2024-01-15 10:30:00', 'https://instagram.com/p/example1'),
('post-2', 'ahmed-hassan', 'Luxury Penthouse Tour', 'Virtual tour of incredible penthouse', '🎥 Take a virtual tour of this incredible penthouse in Downtown Dubai! Featuring panoramic city views, premium finishes, and access to world-class amenities. This is luxury living at its finest. Contact me for more details! #LuxuryLiving #PenthouseDubai #VirtualTour', 'video', '/placeholder.svg?height=600&width=600', 'Welcome to this stunning penthouse in the heart of Downtown Dubai. As you can see, the living area features floor-to-ceiling windows with breathtaking views of the Burj Khalifa and Dubai Fountain. The kitchen is equipped with top-of-the-line appliances and premium marble countertops.', '2024-01-12 14:45:00', 'https://instagram.com/p/example2'),
('post-3', 'sarah-williams', 'Marina Living at its Best', 'Beautiful 1BR apartment with marina views', '🌊 Marina living at its best! Just listed this beautiful 1BR apartment with stunning marina views. Perfect for young professionals or as an investment property. The Dubai Marina continues to be one of the most sought-after locations for both residents and investors. #DubaiMarina #MarinaViews #InvestmentOpportunity', 'image', '/placeholder.svg?height=600&width=600', NULL, '2024-01-10 09:15:00', 'https://instagram.com/p/example3'),
('post-4', 'omar-al-mansouri', 'Off-Plan Opportunity', 'Exciting new development in Business Bay', '🏗️ Exciting off-plan opportunity in Business Bay! This new development offers modern design, premium amenities, and flexible payment plans. Perfect timing to invest in Dubai\'s growing business district. Early bird prices available! #OffPlan #BusinessBay #NewDevelopment #InvestmentOpportunity', 'image', '/placeholder.svg?height=600&width=600', NULL, '2024-01-08 16:20:00', 'https://instagram.com/p/example4'),
('post-5', 'priya-sharma', 'Family Home in JVC', 'Spacious 3BR apartment perfect for families', '👨‍👩‍👧‍👦 Family-friendly living in JVC! This spacious 3BR apartment is perfect for growing families. Close to schools, parks, and community amenities. JVC offers the perfect balance of affordability and quality of life in Dubai. #FamilyLiving #JVC #FamilyFriendly #AffordableHomes', 'video', '/placeholder.svg?height=600&width=600', 'Here we have a wonderful family home in Jumeirah Village Circle. The spacious living area is perfect for family gatherings, and as you can see, there\'s plenty of natural light throughout. The kitchen is well-designed with ample storage space.', '2024-01-05 11:30:00', 'https://instagram.com/p/example5');

COMMIT;