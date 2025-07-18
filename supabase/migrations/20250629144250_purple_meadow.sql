-- Dubai Agents Marketplace Database Setup
-- Run this script in your MySQL database to create the required tables

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

-- Show tables to confirm creation
SHOW TABLES;
DESCRIBE agents;
DESCRIBE posts;