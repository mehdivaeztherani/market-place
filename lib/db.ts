import mysql from 'mysql2/promise';

// Create connection pool for better performance
export const db = mysql.createPool({
  host: process.env.DB_HOST || 'turntable.proxy.rlwy.net',
  port: parseInt(process.env.DB_PORT || '42664'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'OlWIFZHFiPpWIXCfaWdBLhILYxoqgecm',
  database: process.env.DB_NAME || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 30000,
  connectTimeout: 30000,
  idleTimeout: 600000,
  timeout: 60000,
  ssl: {
    rejectUnauthorized: false
  },
  charset: 'utf8mb4',
  multipleStatements: false
});

// Test database connection
export async function testConnection() {
  try {
    console.log('🔄 Attempting to connect to Railway MySQL...');
    console.log(`📍 Host: ${process.env.DB_HOST || 'turntable.proxy.rlwy.net'}`);
    console.log(`🔌 Port: ${process.env.DB_PORT || '42664'}`);
    console.log(`🗄️  Database: ${process.env.DB_NAME || 'railway'}`);
    
    const connection = await db.getConnection();
    console.log('✅ Railway MySQL Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Railway MySQL Database connection failed:');
    console.error('Error details:', error);
    console.error('Connection config:', {
      host: process.env.DB_HOST || 'turntable.proxy.rlwy.net',
      port: process.env.DB_PORT || '42664',
      database: process.env.DB_NAME || 'railway',
      user: process.env.DB_USER || 'root'
    });
    return false;
  }
}

// Initialize database with sample data if tables are empty
export async function initializeDatabase() {
  let connection;
  try {
    connection = await db.getConnection();
    
    // First, create tables if they don't exist
    console.log('🔧 Creating database tables if they don\'t exist...');
    
    // Create agents table
    await connection.query(`
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
      )
    `);
    
    // Create posts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(50) PRIMARY KEY,
        agent_id VARCHAR(50),
        title VARCHAR(255),
        content TEXT,
        transcription TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        caption TEXT,
        original_url VARCHAR(255),
        thumbnail VARCHAR(255),
        instagram_shortcode VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
      )
    `);
    
    // Create filtered_posts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS filtered_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        agent_id VARCHAR(50),
        instagram_shortcode VARCHAR(50),
        filter_reason VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_agent_shortcode (agent_id, instagram_shortcode)
      )
    `);
    
    // Create indexes
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name)`);
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_agents_instagram ON agents(instagram)`);
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_posts_agent_id ON posts(agent_id)`);
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC)`);
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_posts_title ON posts(title)`);
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_posts_shortcode ON posts(instagram_shortcode)`);
    
    console.log('✅ Database tables created successfully');
    
    // Check if agents table exists and has data
    const [agents] = await connection.query('SELECT COUNT(*) as count FROM agents');
    const agentCount = (agents as any[])[0].count;
    
    if (agentCount === 0) {
      console.log('📝 Inserting sample data...');
      
      // Insert sample agents
      await connection.query(`
        INSERT IGNORE INTO agents (id, name, profile_image, address, bio, phone, email, instagram, twitter, linkedin) VALUES
        ('ahmed-hassan-001', 'Ahmed Hassan', '/agents/ahmed-hassan-001/profile/profile_picture.jpg', 'Downtown Dubai, UAE', 'Experienced real estate professional specializing in luxury properties in Downtown Dubai and Dubai Marina. With over 8 years in the industry, I help clients find their dream homes and investment opportunities in Dubai\'s most prestigious locations.', '+971 50 123 4567', 'ahmed.hassan@dubaiagents.com', 'ahmed_dubai_properties', 'ahmed_dubai_re', 'ahmed-hassan-dubai'),
        ('sarah-williams-002', 'Sarah Williams', '/agents/sarah-williams-002/profile/profile_picture.jpg', 'Dubai Marina, UAE', 'British expat with 6 years of experience in Dubai\'s real estate market. I specialize in helping international clients navigate the Dubai property market, with expertise in Marina, JBR, and Palm Jumeirah areas.', '+971 55 987 6543', 'sarah.williams@dubaiagents.com', 'sarah_dubai_homes', NULL, 'sarah-williams-dubai-re'),
        ('omar-al-mansouri-003', 'Omar Al Mansouri', '/agents/omar-al-mansouri-003/profile/profile_picture.jpg', 'Business Bay, UAE', 'Local Dubai expert with deep knowledge of emerging neighborhoods and off-plan developments. Specializing in Business Bay, DIFC, and upcoming areas with high growth potential.', '+971 52 456 7890', 'omar.almansouri@dubaiagents.com', 'omar_dubai_expert', 'omar_dubai_prop', 'omar-al-mansouri-dubai'),
        ('priya-sharma-004', 'Priya Sharma', '/agents/priya-sharma-004/profile/profile_picture.jpg', 'Jumeirah Village Circle, UAE', 'Dedicated to helping families find perfect homes in Dubai\'s family-friendly communities. Expert in JVC, JVT, and other emerging residential areas with great amenities and schools.', '+971 56 234 5678', 'priya.sharma@dubaiagents.com', 'priya_dubai_families', NULL, 'priya-sharma-dubai-homes'),
        ('james-mitchell-005', 'James Mitchell', '/agents/james-mitchell-005/profile/profile_picture.jpg', 'Dubai Hills Estate, UAE', 'Luxury property specialist focusing on Dubai Hills Estate, Emirates Hills, and other premium golf course communities. Helping high-net-worth individuals find exclusive properties.', '+971 50 345 6789', 'james.mitchell@dubaiagents.com', 'james_luxury_dubai', 'james_dubai_luxury', 'james-mitchell-luxury-re'),
        ('fatima-al-zahra-006', 'Fatima Al Zahra', '/agents/fatima-al-zahra-006/profile/profile_picture.jpg', 'Arabian Ranches, UAE', 'Specializing in villa communities and family-oriented developments. Expert in Arabian Ranches, Mudon, and other established villa communities with strong community feel.', '+971 55 678 9012', 'fatima.alzahra@dubaiagents.com', 'fatima_dubai_villas', NULL, 'fatima-al-zahra-dubai')
      `);
      
      // Insert sample posts
      await connection.query(`
        INSERT IGNORE INTO posts (id, agent_id, title, content, caption, thumbnail, date, original_url, instagram_shortcode) VALUES
        ('ahmed-001-post-001', 'ahmed-hassan-001', 'Stunning Downtown Dubai Apartment', 'Beautiful 2BR apartment with Burj Khalifa views in the heart of Downtown Dubai.', '🏙️ Just closed another amazing deal in Downtown Dubai! This stunning 2BR apartment with Burj Khalifa views is now home to a lovely family from the UK. The Dubai real estate market continues to show strong growth, especially in prime locations like this. #DubaiRealEstate #DowntownDubai #BurjKhalifaViews #PropertyInvestment', '/posts/post_1_thumbnail.jpg', '2024-01-15 10:30:00', 'https://instagram.com/p/ahmed-downtown-apartment', 'ahmed-downtown-apartment'),
        ('ahmed-001-post-002', 'ahmed-hassan-001', 'Luxury Penthouse Tour', 'Virtual tour of incredible penthouse with panoramic city views.', '🎥 Take a virtual tour of this incredible penthouse in Downtown Dubai! Featuring panoramic city views, premium finishes, and access to world-class amenities. This is luxury living at its finest. Contact me for more details! #LuxuryLiving #PenthouseDubai #VirtualTour', '/posts/post_2_thumbnail.jpg', '2024-01-12 14:45:00', 'https://instagram.com/p/ahmed-penthouse-tour', 'ahmed-penthouse-tour'),
        ('sarah-002-post-001', 'sarah-williams-002', 'Marina Living at its Best', 'Beautiful 1BR apartment with stunning marina views.', '🌊 Marina living at its best! Just listed this beautiful 1BR apartment with stunning marina views. Perfect for young professionals or as an investment property. The Dubai Marina continues to be one of the most sought-after locations for both residents and investors. #DubaiMarina #MarinaViews #InvestmentOpportunity', '/posts/post_3_thumbnail.jpg', '2024-01-10 09:15:00', 'https://instagram.com/p/sarah-marina-apartment', 'sarah-marina-apartment'),
        ('omar-003-post-001', 'omar-al-mansouri-003', 'Off-Plan Opportunity in Business Bay', 'Exciting new development with flexible payment plans.', '🏗️ Exciting off-plan opportunity in Business Bay! This new development offers modern design, premium amenities, and flexible payment plans. Perfect timing to invest in Dubai\'s growing business district. Early bird prices available! #OffPlan #BusinessBay #NewDevelopment #InvestmentOpportunity', '/posts/post_4_thumbnail.jpg', '2024-01-08 16:20:00', 'https://instagram.com/p/omar-business-bay-offplan', 'omar-business-bay-offplan'),
        ('priya-004-post-001', 'priya-sharma-004', 'Family Home in JVC', 'Spacious 3BR apartment perfect for growing families.', '👨‍👩‍👧‍👦 Family-friendly living in JVC! This spacious 3BR apartment is perfect for growing families. Close to schools, parks, and community amenities. JVC offers the perfect balance of affordability and quality of life in Dubai. #FamilyLiving #JVC #FamilyFriendly #AffordableHomes', '/posts/post_5_thumbnail.jpg', '2024-01-05 11:30:00', 'https://instagram.com/p/priya-jvc-family-home', 'priya-jvc-family-home')
      `);
      
      console.log('✅ Sample data inserted successfully');
    } else {
      console.log(`📊 Database already has ${agentCount} agents`);
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}