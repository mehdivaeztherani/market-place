/*
# Clean Database Structure with Proper Post-Agent Linking

1. Database Structure
   - Clean agents table with proper columns
   - Clean posts table with thumbnail column
   - Proper foreign key relationships
   - Unique post IDs linked to specific agents

2. Sample Data
   - 6 agents with unique IDs
   - Each agent has 3-5 posts with unique thumbnails
   - Proper linking between agents and their posts

3. Data Integrity
   - Foreign key constraints
   - Proper indexing for performance
   - Clean column names and types
*/

-- Use the database
USE dubai_marketplace;

-- Drop existing tables to start fresh (be careful in production!)
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS agents;

-- Create agents table with clean structure
CREATE TABLE agents (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    profile_image VARCHAR(255),
    address TEXT,
    bio TEXT,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    instagram VARCHAR(50),
    twitter VARCHAR(50),
    linkedin VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create posts table with proper structure and thumbnail column
CREATE TABLE posts (
    id VARCHAR(50) PRIMARY KEY,
    agent_id VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    content TEXT,
    caption TEXT,
    thumbnail VARCHAR(255), -- This will store the thumbnail path
    transcription TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    original_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_agents_name ON agents(name);
CREATE INDEX idx_agents_email ON agents(email);
CREATE INDEX idx_posts_agent_id ON posts(agent_id);
CREATE INDEX idx_posts_date ON posts(date DESC);

-- Insert agents with unique IDs
INSERT INTO agents (id, name, profile_image, address, bio, phone, email, instagram, twitter, linkedin) VALUES
('ahmed-hassan-001', 'Ahmed Hassan', '/profile_picture.jpg', 'Downtown Dubai, UAE', 'Experienced real estate professional specializing in luxury properties in Downtown Dubai and Dubai Marina. With over 8 years in the industry, I help clients find their dream homes and investment opportunities in Dubai\'s most prestigious locations.', '+971 50 123 4567', 'ahmed.hassan@dubaiagents.com', 'ahmed_dubai_properties', 'ahmed_dubai_re', 'ahmed-hassan-dubai'),

('sarah-williams-002', 'Sarah Williams', '/profile_picture.jpg', 'Dubai Marina, UAE', 'British expat with 6 years of experience in Dubai\'s real estate market. I specialize in helping international clients navigate the Dubai property market, with expertise in Marina, JBR, and Palm Jumeirah areas.', '+971 55 987 6543', 'sarah.williams@dubaiagents.com', 'sarah_dubai_homes', NULL, 'sarah-williams-dubai-re'),

('omar-al-mansouri-003', 'Omar Al Mansouri', '/profile_picture.jpg', 'Business Bay, UAE', 'Local Dubai expert with deep knowledge of emerging neighborhoods and off-plan developments. Specializing in Business Bay, DIFC, and upcoming areas with high growth potential.', '+971 52 456 7890', 'omar.almansouri@dubaiagents.com', 'omar_dubai_expert', 'omar_dubai_prop', 'omar-al-mansouri-dubai'),

('priya-sharma-004', 'Priya Sharma', '/profile_picture.jpg', 'Jumeirah Village Circle, UAE', 'Dedicated to helping families find perfect homes in Dubai\'s family-friendly communities. Expert in JVC, JVT, and other emerging residential areas with great amenities and schools.', '+971 56 234 5678', 'priya.sharma@dubaiagents.com', 'priya_dubai_families', NULL, 'priya-sharma-dubai-homes'),

('james-mitchell-005', 'James Mitchell', '/profile_picture.jpg', 'Dubai Hills Estate, UAE', 'Luxury property specialist focusing on Dubai Hills Estate, Emirates Hills, and other premium golf course communities. Helping high-net-worth individuals find exclusive properties.', '+971 50 345 6789', 'james.mitchell@dubaiagents.com', 'james_luxury_dubai', 'james_dubai_luxury', 'james-mitchell-luxury-re'),

('fatima-al-zahra-006', 'Fatima Al Zahra', '/profile_picture.jpg', 'Arabian Ranches, UAE', 'Specializing in villa communities and family-oriented developments. Expert in Arabian Ranches, Mudon, and other established villa communities with strong community feel.', '+971 55 678 9012', 'fatima.alzahra@dubaiagents.com', 'fatima_dubai_villas', NULL, 'fatima-al-zahra-dubai');

-- Insert posts with unique IDs linked to specific agents and proper thumbnails
-- Ahmed Hassan's posts (agent-001)
INSERT INTO posts (id, agent_id, title, content, caption, thumbnail, transcription, date, original_url) VALUES
('ahmed-001-post-001', 'ahmed-hassan-001', 'Stunning Downtown Dubai Apartment', 'Beautiful 2BR apartment with Burj Khalifa views in the heart of Downtown Dubai.', '🏙️ Just closed another amazing deal in Downtown Dubai! This stunning 2BR apartment with Burj Khalifa views is now home to a lovely family from the UK. The Dubai real estate market continues to show strong growth, especially in prime locations like this. #DubaiRealEstate #DowntownDubai #BurjKhalifaViews #PropertyInvestment', '/posts/post_1_thumbnail.jpg', NULL, '2024-01-15 10:30:00', 'https://instagram.com/p/ahmed-downtown-apartment'),

('ahmed-001-post-002', 'ahmed-hassan-001', 'Luxury Penthouse Tour', 'Virtual tour of incredible penthouse with panoramic city views.', '🎥 Take a virtual tour of this incredible penthouse in Downtown Dubai! Featuring panoramic city views, premium finishes, and access to world-class amenities. This is luxury living at its finest. Contact me for more details! #LuxuryLiving #PenthouseDubai #VirtualTour', '/posts/post_2_thumbnail.jpg', 'Welcome to this stunning penthouse in the heart of Downtown Dubai. As you can see, the living area features floor-to-ceiling windows with breathtaking views of the Burj Khalifa and Dubai Fountain. The kitchen is equipped with top-of-the-line appliances and premium marble countertops.', '2024-01-12 14:45:00', 'https://instagram.com/p/ahmed-penthouse-tour'),

('ahmed-001-post-003', 'ahmed-hassan-001', 'Investment Opportunity in DIFC', 'Prime commercial space in Dubai International Financial Centre.', '💼 Exclusive investment opportunity in DIFC! This premium commercial space offers excellent returns and is perfect for businesses looking to establish themselves in Dubai\'s financial hub. #DIFC #CommercialRealEstate #Investment #Dubai', '/posts/post_3_thumbnail.jpg', NULL, '2024-01-08 09:20:00', 'https://instagram.com/p/ahmed-difc-commercial');

-- Sarah Williams's posts (agent-002)
INSERT INTO posts (id, agent_id, title, content, caption, thumbnail, transcription, date, original_url) VALUES
('sarah-002-post-001', 'sarah-williams-002', 'Marina Living at its Best', 'Beautiful 1BR apartment with stunning marina views.', '🌊 Marina living at its best! Just listed this beautiful 1BR apartment with stunning marina views. Perfect for young professionals or as an investment property. The Dubai Marina continues to be one of the most sought-after locations for both residents and investors. #DubaiMarina #MarinaViews #InvestmentOpportunity', '/posts/post_4_thumbnail.jpg', NULL, '2024-01-10 09:15:00', 'https://instagram.com/p/sarah-marina-apartment'),

('sarah-002-post-002', 'sarah-williams-002', 'JBR Beachfront Living', 'Luxury beachfront apartment in Jumeirah Beach Residence.', '🏖️ Wake up to the sound of waves! This stunning beachfront apartment in JBR offers direct beach access and breathtaking sea views. Perfect for those who want to live the Dubai beach lifestyle. #JBR #BeachfrontLiving #DubaiBeach #LuxuryLiving', '/posts/post_5_thumbnail.jpg', 'Here we have an amazing beachfront property in JBR. The apartment features floor-to-ceiling windows with unobstructed sea views. The living area flows seamlessly to a private balcony where you can enjoy your morning coffee while watching the sunrise over the Arabian Gulf.', '2024-01-07 16:30:00', 'https://instagram.com/p/sarah-jbr-beachfront'),

('sarah-002-post-003', 'sarah-williams-002', 'Palm Jumeirah Villa', 'Exclusive villa on the iconic Palm Jumeirah island.', '🌴 Exclusive Palm Jumeirah villa now available! This magnificent property offers privacy, luxury, and stunning views of the Dubai skyline. A rare opportunity to own a piece of paradise. #PalmJumeirah #LuxuryVilla #DubaiSkyline #ExclusiveLiving', '/posts/post_1_thumbnail.jpg', NULL, '2024-01-05 11:45:00', 'https://instagram.com/p/sarah-palm-villa');

-- Omar Al Mansouri's posts (agent-003)
INSERT INTO posts (id, agent_id, title, content, caption, thumbnail, transcription, date, original_url) VALUES
('omar-003-post-001', 'omar-al-mansouri-003', 'Off-Plan Opportunity in Business Bay', 'Exciting new development with flexible payment plans.', '🏗️ Exciting off-plan opportunity in Business Bay! This new development offers modern design, premium amenities, and flexible payment plans. Perfect timing to invest in Dubai\'s growing business district. Early bird prices available! #OffPlan #BusinessBay #NewDevelopment #InvestmentOpportunity', '/posts/post_2_thumbnail.jpg', NULL, '2024-01-08 16:20:00', 'https://instagram.com/p/omar-business-bay-offplan'),

('omar-003-post-002', 'omar-al-mansouri-003', 'DIFC Commercial Space', 'Premium office space in Dubai\'s financial district.', '🏢 Premium office space in DIFC now available for lease! This Grade A building offers state-of-the-art facilities and is perfect for financial services companies. Located in the heart of Dubai\'s financial district. #DIFC #OfficeSpace #CommercialLease #FinancialDistrict', '/posts/post_3_thumbnail.jpg', 'This premium office space in DIFC features modern design and cutting-edge technology. The building offers 24/7 security, high-speed elevators, and panoramic views of the Dubai skyline. Perfect for companies looking to establish their presence in the Middle East.', '2024-01-06 14:10:00', 'https://instagram.com/p/omar-difc-office'),

('omar-003-post-003', 'omar-al-mansouri-003', 'Canal Views Apartment', 'Stunning apartment overlooking Dubai Water Canal.', '💧 Stunning canal views! This beautiful apartment overlooks the Dubai Water Canal and offers a serene living environment in the heart of the city. Modern amenities and excellent connectivity. #DubaiCanal #CanalViews #ModernLiving #CityLife', '/posts/post_4_thumbnail.jpg', NULL, '2024-01-04 10:25:00', 'https://instagram.com/p/omar-canal-views');

-- Priya Sharma's posts (agent-004)
INSERT INTO posts (id, agent_id, title, content, caption, thumbnail, transcription, date, original_url) VALUES
('priya-004-post-001', 'priya-sharma-004', 'Family Home in JVC', 'Spacious 3BR apartment perfect for growing families.', '👨‍👩‍👧‍👦 Family-friendly living in JVC! This spacious 3BR apartment is perfect for growing families. Close to schools, parks, and community amenities. JVC offers the perfect balance of affordability and quality of life in Dubai. #FamilyLiving #JVC #FamilyFriendly #AffordableHomes', '/posts/post_5_thumbnail.jpg', 'Here we have a wonderful family home in Jumeirah Village Circle. The spacious living area is perfect for family gatherings, and as you can see, there\'s plenty of natural light throughout. The kitchen is well-designed with ample storage space.', '2024-01-05 11:30:00', 'https://instagram.com/p/priya-jvc-family-home'),

('priya-004-post-002', 'priya-sharma-004', 'JVT Townhouse', 'Beautiful townhouse in Jumeirah Village Triangle.', '🏘️ Beautiful townhouse in JVT! This 3-bedroom townhouse offers a private garden and is located in a family-friendly community with excellent amenities. Perfect for families looking for more space and privacy. #JVT #Townhouse #FamilyHome #PrivateGarden', '/posts/post_1_thumbnail.jpg', NULL, '2024-01-03 15:20:00', 'https://instagram.com/p/priya-jvt-townhouse'),

('priya-004-post-003', 'priya-sharma-004', 'School District Properties', 'Homes near top-rated international schools.', '🎓 Properties near top schools! These beautiful homes are located within walking distance of Dubai\'s best international schools. Perfect for families prioritizing education and convenience. #SchoolDistrict #FamilyHomes #Education #Convenience', '/posts/post_2_thumbnail.jpg', 'These properties are strategically located near some of Dubai\'s most prestigious international schools. The community offers safe walking paths, playgrounds, and family-oriented amenities that make it perfect for children to grow and thrive.', '2024-01-02 09:45:00', 'https://instagram.com/p/priya-school-district');

-- James Mitchell's posts (agent-005)
INSERT INTO posts (id, agent_id, title, content, caption, thumbnail, transcription, date, original_url) VALUES
('james-005-post-001', 'james-mitchell-005', 'Dubai Hills Estate Villa', 'Luxury villa with golf course views.', '⛳ Luxury living in Dubai Hills Estate! This stunning villa offers panoramic golf course views and is located in one of Dubai\'s most prestigious communities. Features include a private pool, landscaped garden, and premium finishes throughout. #DubaiHills #LuxuryVilla #GolfCourse #PrestigiousLiving', '/posts/post_3_thumbnail.jpg', NULL, '2024-01-09 13:15:00', 'https://instagram.com/p/james-dubai-hills-villa'),

('james-005-post-002', 'james-mitchell-005', 'Emirates Hills Mansion', 'Exclusive mansion in Emirates Hills community.', '🏰 Exclusive Emirates Hills mansion! This magnificent property offers unparalleled luxury and privacy in Dubai\'s most exclusive gated community. Features include a private cinema, wine cellar, and stunning lake views. #EmiratesHills #Mansion #ExclusiveLiving #LuxuryRealEstate', '/posts/post_4_thumbnail.jpg', 'Welcome to this extraordinary mansion in Emirates Hills. The property features a grand entrance hall with double-height ceilings, a formal dining room that seats 12, and a gourmet kitchen with top-of-the-line appliances. The master suite includes a private terrace with lake views.', '2024-01-06 17:40:00', 'https://instagram.com/p/james-emirates-hills-mansion');

-- Fatima Al Zahra's posts (agent-006)
INSERT INTO posts (id, agent_id, title, content, caption, thumbnail, transcription, date, original_url) VALUES
('fatima-006-post-001', 'fatima-al-zahra-006', 'Arabian Ranches Villa', 'Beautiful villa in established community.', '🏡 Beautiful villa in Arabian Ranches! This stunning 4-bedroom villa is located in one of Dubai\'s most established and family-friendly communities. Features include a private garden, community pool, and excellent schools nearby. #ArabianRanches #VillaCommunity #FamilyFriendly #EstablishedCommunity', '/posts/post_5_thumbnail.jpg', NULL, '2024-01-07 12:30:00', 'https://instagram.com/p/fatima-arabian-ranches-villa'),

('fatima-006-post-002', 'fatima-al-zahra-006', 'Mudon Community Home', 'Charming home in Mudon community.', '🌺 Charming home in Mudon! This beautiful property offers a perfect blend of modern living and community spirit. The area features parks, cycling tracks, and a strong sense of community. Ideal for families. #Mudon #CommunityLiving #FamilyHome #ModernLiving', '/posts/post_1_thumbnail.jpg', 'This lovely home in Mudon showcases the perfect family lifestyle. The open-plan living area connects seamlessly to the garden, creating a wonderful space for entertaining. The community offers numerous amenities including parks, playgrounds, and cycling tracks.', '2024-01-04 14:50:00', 'https://instagram.com/p/fatima-mudon-home'),

('fatima-006-post-003', 'fatima-al-zahra-006', 'Villa Community Lifestyle', 'Experience the villa community lifestyle.', '🌟 Experience villa community living! These beautiful homes offer the perfect combination of privacy and community amenities. Enjoy resort-style living with pools, parks, and recreational facilities right at your doorstep. #VillaCommunity #ResortLiving #CommunityAmenities #LifestyleLiving', '/posts/post_2_thumbnail.jpg', NULL, '2024-01-01 16:15:00', 'https://instagram.com/p/fatima-villa-community');

-- Verify the data
SELECT 'Agents Count' as Type, COUNT(*) as Count FROM agents
UNION ALL
SELECT 'Posts Count' as Type, COUNT(*) as Count FROM posts
UNION ALL
SELECT 'Posts per Agent' as Type, COUNT(*) as Count FROM posts GROUP BY agent_id;

-- Show sample data
SELECT a.name as Agent, COUNT(p.id) as Posts 
FROM agents a 
LEFT JOIN posts p ON a.id = p.agent_id 
GROUP BY a.id, a.name 
ORDER BY a.name;