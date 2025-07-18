#!/usr/bin/env python3
"""
Script to regenerate titles for existing posts in the database
This will update posts that have generic titles with AI-generated ones
"""

import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '00eability'),
    'database': os.getenv('DB_NAME', 'dubai_marketplace'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

# Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def create_database_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("✅ Connected to MySQL database")
            return connection
    except Error as e:
        print(f"❌ Error connecting to MySQL database: {e}")
        return None

def generate_persian_title_with_ai(groq_client, content, caption="", agent_name=""):
    """Generate Persian title using Groq AI"""
    if not groq_client or not content:
        return None
    
    try:
        prompt = f"""تو یک متخصص تولید عنوان برای آگهی‌های املاک در دبی هستی که باید عنوان‌های جذاب و منحصر به فرد بسازی.

وظیفه تو:
1. بر اساس محتوای ارائه شده، یک عنوان جذاب، منحصر به فرد و حرفه‌ای به زبان فارسی بنویس
2. عنوان باید بین 6 تا 15 کلمه باشد
3. عنوان باید شامل نوع ملک (آپارتمان، ویلا، دفتر، پنت‌هاوس و...) و منطقه دبی باشد
4. از کلمات جذاب مثل "لوکس"، "منحصر به فرد"، "ویژه"، "استثنایی"، "برتر"، "فوق‌العاده" استفاده کن
5. عنوان باید برای بازاریابی املاک و SEO مناسب باشد
6. عنوان باید منعکس‌کننده محتوای واقعی پست باشد
7. فقط عنوان را بنویس، هیچ توضیح، علامت نقل قول یا متن اضافی نده

مشاور املاک: {agent_name if agent_name else "مشاور املاک دبی"}

محتوای کامل املاک:
{content[:800]}

کپشن اصلی:
{caption[:300] if caption else "بدون کپشن"}

حالا یک عنوان منحصر به فرد و جذاب بساز:"""

        response = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.1-70b-versatile",
            temperature=0.7,
            max_tokens=150,
            top_p=0.9
        )
        
        title = response.choices[0].message.content.strip()
        
        # Clean up the title
        title = title.replace('"', '').replace("'", '').replace('«', '').replace('»', '').strip()
        
        # Remove any prefixes
        if ':' in title:
            title = title.split(':', 1)[-1].strip()
        
        # Validate title length
        if len(title.split()) < 4 or len(title.split()) > 20:
            return None
        
        return title
        
    except Exception as e:
        print(f"⚠️ AI title generation failed: {e}")
        return None

def regenerate_titles():
    """Regenerate titles for existing posts"""
    print("🔄 REGENERATING TITLES FOR EXISTING POSTS")
    print("=" * 50)
    
    # Initialize Groq client
    try:
        if not GROQ_API_KEY:
            print("❌ GROQ_API_KEY not found in .env file!")
            return
            
        groq_client = Groq(api_key=GROQ_API_KEY)
        print("✅ Groq client initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing Groq client: {e}")
        return
    
    # Connect to database
    connection = create_database_connection()
    if not connection:
        return
    
    try:
        cursor = connection.cursor()
        
        # Find posts with generic titles
        cursor.execute("""
            SELECT p.id, p.title, p.content, p.caption, a.name
            FROM posts p
            JOIN agents a ON p.agent_id = a.id
            WHERE p.title LIKE '%املاک ویژه شماره%' 
               OR p.title LIKE '%پست %'
               OR p.title LIKE '%Post %'
               OR p.title IS NULL
               OR p.title = ''
            ORDER BY p.created_at DESC
        """)
        
        posts_to_update = cursor.fetchall()
        
        if not posts_to_update:
            print("✅ No posts found with generic titles!")
            return
        
        print(f"📋 Found {len(posts_to_update)} posts with generic titles")
        print("🤖 Generating new AI titles...")
        
        updated_count = 0
        failed_count = 0
        
        for post_id, old_title, content, caption, agent_name in posts_to_update:
            print(f"\n📝 Processing post: {post_id}")
            print(f"   Old title: {old_title}")
            
            # Generate new title
            new_title = generate_persian_title_with_ai(
                groq_client, 
                content or caption or "", 
                caption or "", 
                agent_name or ""
            )
            
            if new_title:
                # Update the post with new title
                update_cursor = connection.cursor()
                update_cursor.execute(
                    "UPDATE posts SET title = %s WHERE id = %s",
                    (new_title, post_id)
                )
                connection.commit()
                update_cursor.close()
                
                print(f"   ✅ New title: {new_title}")
                updated_count += 1
            else:
                print(f"   ❌ Failed to generate title")
                failed_count += 1
        
        print(f"\n🎉 REGENERATION COMPLETED!")
        print(f"✅ Updated: {updated_count} posts")
        print(f"❌ Failed: {failed_count} posts")
        
    except Error as e:
        print(f"❌ Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("🔌 Database connection closed")

if __name__ == "__main__":
    regenerate_titles()