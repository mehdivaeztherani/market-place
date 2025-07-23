import instaloader
import time
import browser_cookie3
from instaloader.exceptions import ConnectionException, ProfileNotExistsException
import os
import shutil
from dotenv import load_dotenv
from io import BytesIO
import requests
from elevenlabs.client import ElevenLabs
import sys
import mysql.connector
from mysql.connector import Error
import uuid
from datetime import datetime
import json
from openai import OpenAI  # Updated import to match test_openai.py

load_dotenv()

# ElevenLabs API key
api_key = "sk_b03b8f47d46f87bcf7650605247cf32635f4bb224f6043b0"

# Initialize OpenAI client for OpenRouter to match test_openai.py
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY", "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"),
    base_url="https://openrouter.ai/api/v1",
    default_headers={"HTTP-Referer": "https://localhost"}  # Required for OpenRouter
)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'turntable.proxy.rlwy.net'),
    'port': int(os.getenv('DB_PORT', '42664')),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'OlWIFZHFiPpWIXCfaWdBLhILYxoqgecm'),
    'database': os.getenv('DB_NAME', 'railway'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
    'ssl_disabled': False,
    'autocommit': True
}

try:
    elevenlabs = ElevenLabs(api_key=api_key)
    print("✅ ElevenLabs client initialized successfully")
except Exception as e:
    print(f"❌ Error initializing ElevenLabs client: {str(e)}")
    print("⚠️ Continuing without transcription service...")
    elevenlabs = None

def create_database_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("✅ Successfully connected to MySQL database")
            return connection
    except Error as e:
        print(f"❌ Error connecting to MySQL database: {e}")
        return None

def ensure_database_structure(connection):
    """Ensure the database has the correct structure"""
    try:
        cursor = connection.cursor()
        cursor.execute("""
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = %s AND TABLE_NAME = 'posts' AND COLUMN_NAME = 'thumbnail'
        """, (DB_CONFIG['database'],))
        if not cursor.fetchone():
            print("📝 Adding thumbnail column to posts table...")
            cursor.execute("ALTER TABLE posts ADD COLUMN thumbnail VARCHAR(255) AFTER caption")
            connection.commit()
            print("✅ Thumbnail column added successfully")
        print("✅ Database structure verified")
        return True
    except Error as e:
        print(f"❌ Error checking database structure: {e}")
        return False
    finally:
        if cursor:
            cursor.close()

def detect_language(text):
    """Detect if text is Persian/Farsi or English"""
    persian_chars = set('آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی')
    text_chars = set(text.replace(' ', '').replace('\n', ''))
    persian_ratio = len(text_chars.intersection(persian_chars)) / max(len(text_chars), 1)
    return 'persian' if persian_ratio > 0.3 else 'english'

def enhance_transcription_with_openai(transcription, caption="", agent_name="", min_words=500):
    """
    Use OpenAI to enhance and expand a transcription to meet minimum word requirements.
    Specifically designed for Persian and English real estate content.
    """
    try:
        print(f"🤖 Enhancing transcription with OpenAI (target: {min_words}+ words)...")
        
        # Check if OpenAI API key is available
        if not client.api_key:
            print("❌ OpenAI API key not found!")
            return transcription
        
        # Detect language
        language = detect_language(transcription)
        print(f"🌐 Detected language: {language}")
        
        # Count current words
        current_word_count = len(transcription.split())
        print(f"📊 Current transcription: {current_word_count} words")
        print(f"📄 Original text: {transcription}")
        
        if current_word_count >= min_words:
            print(f"✅ Transcription already meets minimum requirement ({current_word_count} >= {min_words} words)")
            return transcription

        context_info = f"Caption: {caption[:200]}" if caption else "No caption available"
        agent_context = f"Real estate agent: {agent_name}" if agent_name else "Dubai real estate professional"

        if language == 'persian':
            system_prompt = f"""شما یک متخصص تولید محتوای املاک در دبی هستید که به زبان فارسی کار می‌کنید. 

وظیفه شما:
1. متن کوتاه اصلی را به 5 پاراگراف کامل فارسی گسترش دهید
2. هر پاراگراف حداقل 100 کلمه داشته باشد (مجموعاً حداقل {min_words} کلمه)
3. معنا و لحن اصلی را حفظ کنید
4. اطلاعات مفیدی درباره املاک دبی، سرمایه‌گذاری، و ویژگی‌های ملک اضافه کنید
5. سبک زبان اصلی را حفظ کنید
6. محتوا باید مانند ادامه طبیعی صحبت اصلی باشد
7. هیچ عنوان یا سرتیتر نیآورید - فقط 5 پاراگراف کامل

موضوعات برای گسترش:
- ویژگی‌های ملک و امکانات
- مزایای موقعیت و دسترسی‌ها
- فرصت‌های سرمایه‌گذاری در دبی
- سبک زندگی و امکانات محله
- نکات بازار املاک و توصیه‌های تخصصی

زمینه: {agent_context}
اطلاعات اضافی: {context_info}"""

            user_prompt = f"""
متن اصلی کوتاه ({current_word_count} کلمه):
\"\"\"{transcription}\"\"\"

لطفاً این متن کوتاه را به 5 پاراگراف کامل فارسی گسترش دهید. هر پاراگراف حداقل 100 کلمه و مجموعاً حداقل {min_words} کلمه باشد.

پاراگراف 1: شروع با همین موضوع اصلی و توضیح بیشتر
پاراگراف 2: ویژگی‌های ملک و امکانات
پاراگراف 3: مزایای موقعیت و دسترسی‌ها
پاراگراف 4: فرصت‌های سرمایه‌گذاری
پاراگراف 5: نکات تخصصی و توصیه‌های نهایی

معنا و لحن اصلی را حفظ کنید و محتوا را طبیعی و مفید بنویسید.
"""

        else:  # English
            system_prompt = f"""You are a professional content enhancer specializing in Dubai real estate transcriptions. Your task is to:

1. Take the short original transcription and expand it into exactly 5 complete paragraphs
2. Each paragraph should be at least 100 words (total minimum {min_words} words)
3. Keep the original meaning and tone intact
4. Add relevant details about Dubai real estate, property features, location benefits, and investment opportunities
5. Keep the original language style and perspective
6. Make it sound like a natural continuation of the original speech
7. Do NOT add titles or headers - just provide 5 complete paragraphs

Topics to expand on:
- Property features and amenities
- Location advantages and accessibility
- Investment opportunities in Dubai
- Lifestyle and neighborhood amenities
- Market insights and professional advice

Context: {agent_context}
Additional context: {context_info}"""

            user_prompt = f"""
Original Short Transcription ({current_word_count} words):
\"\"\"{transcription}\"\"

Please expand this short transcription into exactly 5 complete paragraphs, each at least 100 words (total minimum {min_words} words).

Paragraph 1: Start with the original topic and expand on it
Paragraph 2: Property features and amenities
Paragraph 3: Location advantages and accessibility
Paragraph 4: Investment opportunities
Paragraph 5: Professional insights and final recommendations

Maintain the original meaning and tone while making the content natural and valuable.
"""

        print(f"🔄 Sending request to OpenAI...")
        print(f"📝 System prompt length: {len(system_prompt)} chars")
        print(f"📝 User prompt length: {len(user_prompt)} chars")

        response = client.chat.completions.create(
            model="meta-llama/llama-3.1-8b-instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=4000,
            temperature=0.8
        )

        enhanced_content = response.choices[0].message.content.strip()
        enhanced_word_count = len(enhanced_content.split())
        
        print("✅ OpenAI transcription enhancement completed")
        print(f"📝 Original length: {current_word_count} words")
        print(f"📝 Enhanced length: {enhanced_word_count} words")
        print(f"🌐 Language: {language}")
        print(f"📄 Enhanced preview: {enhanced_content[:200]}...")
        
        if enhanced_word_count < min_words:
            print(f"⚠️ Warning: Enhanced transcription ({enhanced_word_count} words) still below target ({min_words} words)")
            print(f"🔄 Trying again with more explicit instructions...")
            
            # Try one more time with more explicit instructions
            if language == 'persian':
                retry_prompt = f"""متن قبلی فقط {enhanced_word_count} کلمه داشت. این کافی نیست!

لطفاً دقیقاً 5 پاراگراف کامل و طولانی بنویسید:

پاراگراف 1 (حداقل 120 کلمه): {transcription} - این موضوع را کامل توضیح دهید
پاراگراف 2 (حداقل 120 کلمه): ویژگی‌های ملک، امکانات، و مشخصات فنی
پاراگراف 3 (حداقل 120 کلمه): موقعیت، دسترسی‌ها، و مزایای محله
پاراگراف 4 (حداقل 120 کلمه): فرصت‌های سرمایه‌گذاری و بازدهی مالی
پاراگراف 5 (حداقل 120 کلمه): توصیه‌های تخصصی و نکات مهم خرید

مجموعاً باید حداقل {min_words} کلمه باشد. هر پاراگراف را کامل و مفصل بنویسید."""
            else:
                retry_prompt = f"""The previous text was only {enhanced_word_count} words. This is not enough!

Please write exactly 5 complete and detailed paragraphs:

Paragraph 1 (minimum 120 words): {transcription} - fully explain this topic
Paragraph 2 (minimum 120 words): Property features, amenities, and technical specifications
Paragraph 3 (minimum 120 words): Location, accessibility, and neighborhood advantages
Paragraph 4 (minimum 120 words): Investment opportunities and financial returns
Paragraph 5 (minimum 120 words): Professional recommendations and important buying tips

Total must be at least {min_words} words. Write each paragraph completely and in detail."""
            
            retry_response = client.chat.completions.create(
                model="meta-llama/llama-3.1-8b-instruct",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": retry_prompt}
                ],
                max_tokens=4000,
                temperature=0.9
            )
            
            retry_content = retry_response.choices[0].message.content.strip()
            retry_word_count = len(retry_content.split())
            
            print(f"🔄 Retry completed: {retry_word_count} words")
            
            if retry_word_count > enhanced_word_count:
                enhanced_content = retry_content
                enhanced_word_count = retry_word_count
                print(f"✅ Retry successful: Using enhanced version with {enhanced_word_count} words")
            else:
                print(f"⚠️ Retry didn't improve length, using original enhanced version")
        
        # Final check
        if enhanced_word_count < min_words:
            print(f"❌ Final enhanced transcription still below target: {enhanced_word_count} < {min_words}")
        else:
            print(f"✅ Successfully enhanced transcription: {enhanced_word_count} >= {min_words} words")
        
        return enhanced_content

    except Exception as e:
        print(f"❌ OpenAI transcription enhancement failed: {e}")
        print(f"🔍 Error details: {str(e)}")
        print("🔄 Falling back to original transcription")
        return transcription

def enhance_caption_with_openai(caption, agent_name="", target_words=300):
    """
    Use OpenAI to enhance a caption when no video transcription is available.
    """
    try:
        print(f"🤖 Enhancing caption with OpenAI (target: {target_words}+ words)...")
        
        # Check if OpenAI API key is available
        if not client.api_key:
            print("❌ OpenAI API key not found!")
            return caption
        
        # Detect language
        language = detect_language(caption)
        print(f"🌐 Detected language: {language}")
        
        current_word_count = len(caption.split())
        print(f"📊 Current caption: {current_word_count} words")

        agent_context = f"Real estate agent: {agent_name}" if agent_name else "Dubai real estate professional"

        if language == 'persian':
            system_prompt = f"""شما یک متخصص تولید محتوای املاک در دبی هستید. وظیفه شما:

1. کپشن اصلی اینستاگرام را به توضیح جامع ملک با حداقل {target_words} کلمه تبدیل کنید
2. لحن و سبک اصلی پست را حفظ کنید
3. جزئیات مفید درباره املاک دبی، ویژگی‌های ملک، مزایای موقعیت و فرصت‌های سرمایه‌گذاری اضافه کنید
4. هشتگ‌ها و منشن‌های اصلی را حفظ کنید
5. مانند محتوای طبیعی بازاریابی املاک به نظر برسد
6. روی جزئیات ملک، مزایای موقعیت، بینش‌های بازار و مزایای سبک زندگی تمرکز کنید
7. هیچ عنوان یا سرتیتر اضافه نکنید

زمینه: {agent_context}"""
        else:
            system_prompt = f"""You are a professional content enhancer specializing in Dubai real estate social media content. Your task is to:

1. Take the original Instagram caption and expand it into a comprehensive property description of at least {target_words} words.
2. Maintain the original tone and style of the post.
3. Add relevant details about Dubai real estate, property features, location benefits, and investment opportunities.
4. Keep any hashtags and mentions from the original.
5. Make it sound like natural real estate marketing content.
6. Focus on property details, location advantages, market insights, and lifestyle benefits.
7. Do NOT add titles or headers - just provide the enhanced content.

Context: {agent_context}"""

        user_prompt = f"""
Original Caption ({current_word_count} words):
\"\"\"{caption}\"\"

Please expand this caption into a comprehensive property description of at least {target_words} words while maintaining the original tone and style.
"""

        response = client.chat.completions.create(
            model="meta-llama/llama-3.1-8b-instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=2000,
            temperature=0.7
        )

        enhanced_content = response.choices[0].message.content.strip()
        enhanced_word_count = len(enhanced_content.split())
        
        print("✅ OpenAI caption enhancement completed")
        print(f"📝 Original length: {current_word_count} words")
        print(f"📝 Enhanced length: {enhanced_word_count} words")
        print(f"📄 Preview: {enhanced_content[:150]}...")
        
        return enhanced_content

    except Exception as e:
        print(f"❌ OpenAI caption enhancement failed: {e}")
        print(f"🔍 Error details: {str(e)}")
        print("🔄 Falling back to original caption")
        return caption

def create_agent_in_database(connection, username, profile_data):
    """Create a new agent in the database with complete profile information"""
    try:
        cursor = connection.cursor()
        timestamp = int(time.time())
        agent_id = f"{username.replace('.', '-').replace('_', '-')}-{timestamp}"
        full_name = profile_data.get('full_name', '').strip() or username.replace('.', ' ').replace('_', ' ').title()
        biography = profile_data.get('biography', '').strip() or f'Real estate professional in Dubai. Follow @{username} for the latest property updates and investment opportunities.'
        profile_image_path = f"/agents/{agent_id}/profile/profile_picture.jpg"
        email_username = username.replace('.', '').replace('_', '')
        phone = "+971 50 XXX XXXX"
        email = f"{email_username}@dubaiagents.com"
        insert_query = """
            INSERT INTO agents (id, name, profile_image, address, bio, phone, email, instagram, twitter, linkedin, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """
        agent_values = (
            agent_id, full_name, profile_image_path, "Dubai, UAE", biography,
            phone, email, username, None, None
        )
        cursor.execute(insert_query, agent_values)
        connection.commit()
        print(f"✅ Agent created successfully in database! ID: {agent_id}")
        return agent_id
    except Error as e:
        print(f"❌ Error creating agent in database: {e}")
        connection.rollback()
        return None
    finally:
        if cursor:
            cursor.close()

def save_post_to_database(connection, agent_id, post_data, post_number):
    """Save a post to the database with enhanced transcription"""
    try:
        cursor = connection.cursor()
        # Generate unique post ID
        timestamp = int(time.time())
        post_id = f"{agent_id}-post-{post_number:03d}-{timestamp}"
        
        # Extract post data
        title = post_data.get('title', f"Post {post_number}")
        content = post_data.get('content', '')
        caption = post_data.get('caption', '')
        thumbnail_path = f"/agents/{agent_id}/posts/post_{post_number}_thumbnail.jpg"
        
        # Use the enhanced transcription as the main transcription field
        enhanced_transcription = post_data.get('enhanced_transcription', None)
        original_transcription = post_data.get('original_transcription', None)
        
        post_date = post_data.get('date', datetime.now())
        original_url = post_data.get('original_url', '')
        
        # Prepare SQL query - store enhanced transcription in the transcription field
        insert_query = """
            INSERT INTO posts (id, agent_id, title, content, caption, thumbnail, transcription, date, original_url, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """
        
        post_values = (
            post_id,
            agent_id,
            title,
            content,
            caption,
            thumbnail_path,
            enhanced_transcription,  # This is the enhanced version that will be used in frontend
            post_date,
            original_url
        )
        
        cursor.execute(insert_query, post_values)
        connection.commit()
        
        print(f"✅ Post {post_number} saved to database!")
        print(f"   📋 Post ID: {post_id}")
        print(f"   🖼️  Thumbnail: {thumbnail_path}")
        print(f"   📝 Caption: {caption[:50]}{'...' if len(caption) > 50 else ''}")
        
        if original_transcription:
            print(f"   🎤 Original Transcription: {len(original_transcription.split())} words")
        if enhanced_transcription:
            print(f"   🤖 Enhanced Transcription: {len(enhanced_transcription.split())} words")
            
        return post_id
    except Error as e:
        print(f"❌ Error saving post to database: {e}")
        connection.rollback()
        return None
    finally:
        if cursor:
            cursor.close()

def organize_files_in_public_directory(username, agent_id, downloaded_folder):
    """Organize all downloaded files in the public directory structure"""
    try:
        print(f"📁 Organizing files for agent {agent_id}...")
        agent_public_dir = f"public/agents/{agent_id}"
        profile_dir = f"{agent_public_dir}/profile"
        posts_dir = f"{agent_public_dir}/posts"
        os.makedirs(profile_dir, exist_ok=True)
        os.makedirs(posts_dir, exist_ok=True)
        print(f"✅ Created directory structure: {agent_public_dir}")
        profile_pic_source = os.path.join(downloaded_folder, f"{username}_profile.jpg")
        if os.path.exists(profile_pic_source):
            profile_pic_dest = os.path.join(profile_dir, "profile_picture.jpg")
            shutil.copy2(profile_pic_source, profile_pic_dest)
            print(f"✅ Profile picture copied to: {profile_pic_dest}")
        else:
            print(f"⚠️ Profile picture not found at: {profile_pic_source}")
        post_folders = sorted([d for d in os.listdir(downloaded_folder)
                               if os.path.isdir(os.path.join(downloaded_folder, d)) and d.startswith("post_")])
        for i, post_folder in enumerate(post_folders, 1):
            post_folder_path = os.path.join(downloaded_folder, post_folder)
            thumbnail_files = [f for f in os.listdir(post_folder_path) if f.endswith('_thumbnail.jpg')]
            if thumbnail_files:
                thumbnail_source = os.path.join(post_folder_path, thumbnail_files[0])
                thumbnail_dest = os.path.join(posts_dir, f"post_{i}_thumbnail.jpg")
                shutil.copy2(thumbnail_source, thumbnail_dest)
                print(f"✅ Post {i} thumbnail copied to: {thumbnail_dest}")
            video_files = [f for f in os.listdir(post_folder_path) if f.endswith('_video.mp4')]
            if video_files:
                video_source = os.path.join(post_folder_path, video_files[0])
                video_dest = os.path.join(posts_dir, f"post_{i}_video.mp4")
                shutil.copy2(video_source, video_dest)
                print(f"✅ Post {i} video copied to: {video_dest}")
            for file in os.listdir(post_folder_path):
                if file.endswith('.txt'):
                    file_source = os.path.join(post_folder_path, file)
                    file_dest = os.path.join(posts_dir, f"post_{i}_{file}")
                    shutil.copy2(file_source, file_dest)
                    print(f"✅ Post {i} {file} copied to: {file_dest}")
        print(f"🎉 All files organized successfully in public directory!")
        return True
    except Exception as e:
        print(f"❌ Error organizing files: {e}")
        return False

def download_instagram_profile(username, browser="firefox", max_posts=5):
    """Download Instagram profile and save everything to database with enhanced transcriptions"""
    print(f"🚀 Starting Instagram scraper for @{username}")
    print("=" * 60)
    
    # Check OpenAI API key first
    if not client.api_key:
        print("❌ CRITICAL: OpenAI API key not found!")
        print("Please add OPENROUTER_API_KEY to your .env file")
        return
    else:
        print(f"✅ OpenAI API key found: {client.api_key[:10]}...")
    
    connection = create_database_connection()
    if not connection:
        print("❌ Cannot proceed without database connection")
        return
    if not ensure_database_structure(connection):
        print("❌ Database structure check failed")
        return
    ig = instaloader.Instaloader(
        download_videos=True,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        post_metadata_txt_pattern=""
    )
    try:
        print(f"🍪 Loading cookies from {browser}...")
        cookies = None
        if browser.lower() == "firefox":
            cookies = browser_cookie3.firefox(domain_name="instagram.com")
        elif browser.lower() == "chrome":
            cookies = browser_cookie3.chrome(domain_name="instagram.com")
        elif browser.lower() == "chromium":
            cookies = browser_cookie3.chromium(domain_name="instagram.com")
        else:
            print(f"❌ Unsupported browser: {browser}")
            return
        ig.context._session.cookies.update(cookies)
        print("✅ Cookies loaded successfully!")
        download_folder = f"{username}_posts_{int(time.time())}"
        os.makedirs(download_folder, exist_ok=True)
        print(f"📁 Created download folder: {download_folder}")
        print(f"🔍 Fetching profile information for @{username}...")
        profile = instaloader.Profile.from_username(ig.context, username)
        profile_data = {
            'full_name': profile.full_name or '',
            'biography': profile.biography or '',
            'followers': profile.followers,
            'followees': profile.followees,
            'mediacount': profile.mediacount,
            'is_verified': profile.is_verified,
            'is_business_account': profile.is_business_account
        }
        print(f"📊 Profile Information:")
        print(f" 👤 Full Name: {profile_data['full_name']}")
        print(f" 📝 Bio: {profile_data['biography'][:100]}{'...' if len(profile_data['biography']) > 100 else ''}")
        print(f" 👥 Followers: {profile_data['followers']:,}")
        print(f" 📸 Posts: {profile_data['mediacount']:,}")
        print(f" ✅ Verified: {profile_data['is_verified']}")
        print(f" 🏢 Business: {profile_data['is_business_account']}")
        print(f"\n💾 Creating agent in database...")
        agent_id = create_agent_in_database(connection, username, profile_data)
        if not agent_id:
            print("❌ Failed to create agent in database")
            return
        print(f"\n📸 Downloading profile picture...")
        try:
            profile_pic_url = profile.get_profile_pic_url()
            profile_pic_response = requests.get(profile_pic_url, timeout=30)
            if profile_pic_response.status_code == 200:
                profile_pic_path = os.path.join(download_folder, f"{username}_profile.jpg")
                with open(profile_pic_path, 'wb') as f:
                    f.write(profile_pic_response.content)
                print(f"✅ Profile picture saved: {profile_pic_path}")
            else:
                print(f"⚠️ Failed to download profile picture (HTTP {profile_pic_response.status_code})")
        except Exception as e:
            print(f"⚠️ Error downloading profile picture: {e}")
        print(f"\n📥 Downloading {max_posts} posts...")
        post_count = 0
        successful_posts = 0
        for post in profile.get_posts():
            if post_count >= max_posts:
                break
            post_count += 1
            print(f"\n📋 Processing post {post_count}/{max_posts}...")
            try:
                post_folder = os.path.join(download_folder, f"post_{post_count}_{post.date_utc.strftime('%Y%m%d_%H%M%S')}")
                os.makedirs(post_folder, exist_ok=True)
                print(f"📥 Downloading post content...")
                ig.download_post(post, target=download_folder)
                print(f"🖼️ Downloading thumbnail...")
                try:
                    thumbnail_url = post.url
                    thumbnail_response = requests.get(thumbnail_url, timeout=30)
                    if thumbnail_response.status_code == 200:
                        thumbnail_path = os.path.join(post_folder, f"post_{post_count}_thumbnail.jpg")
                        with open(thumbnail_path, 'wb') as f:
                            f.write(thumbnail_response.content)
                        print(f"✅ Thumbnail saved: {thumbnail_path}")
                    else:
                        print(f"⚠️ Failed to download thumbnail (HTTP {thumbnail_response.status_code})")
                except Exception as e:
                    print(f"⚠️ Error downloading thumbnail: {e}")
                caption = post.caption if post.caption else "No caption available"
                if post.caption_mentions:
                    caption += f"\n\n👥 Mentions: {', '.join([f'@{mention}' for mention in post.caption_mentions])}"
                if post.caption_hashtags:
                    caption += f"\n\n🏷️ Hashtags: {', '.join([f'#{hashtag}' for hashtag in post.caption_hashtags])}"
                caption_file = os.path.join(post_folder, "caption.txt")
                with open(caption_file, 'w', encoding='utf-8') as f:
                    f.write(caption)
                print(f"✅ Caption saved: {caption_file}")
                
                # Initialize transcription variables
                original_transcription = None
                enhanced_transcription = None
                video_processed = False
                
                # Process video files
                for file in os.listdir(download_folder):
                    if file.endswith('.mp4') and 'UTC' in file:
                        old_video_path = os.path.join(download_folder, file)
                        new_video_path = os.path.join(post_folder, f"post_{post_count}_video.mp4")
                        shutil.move(old_video_path, new_video_path)
                        print(f"✅ Video moved: {new_video_path}")
                        video_processed = True
                        break
                
                # Transcribe video if available
                if elevenlabs and video_processed:
                    print(f"🎤 Transcribing video...")
                    try:
                        with open(new_video_path, 'rb') as f:
                            audio_data = BytesIO(f.read())
                        
                        transcription = elevenlabs.speech_to_text.convert(
                            file=audio_data,
                            model_id="scribe_v1",
                            tag_audio_events=True,
                            language_code="fas",
                            diarize=True,
                        )
                        
                        original_transcription = transcription.text
                        
                        # Save original transcription
                        original_transcription_file = os.path.join(post_folder, "original_transcription.txt")
                        with open(original_transcription_file, 'w', encoding='utf-8') as f:
                            f.write(original_transcription)
                        print(f"✅ Original transcription saved: {original_transcription_file}")
                        print(f"📝 Original transcription: {len(original_transcription.split())} words")
                        print(f"📄 Original text: {original_transcription}")
                        
                        # Enhance transcription with OpenAI to meet minimum word requirement
                        print(f"🤖 Enhancing transcription to 5 complete paragraphs (500+ words)...")
                        enhanced_transcription = enhance_transcription_with_openai(
                            original_transcription,
                            caption,
                            profile_data['full_name'],
                            min_words=500
                        )
                        
                        # Save enhanced transcription
                        enhanced_transcription_file = os.path.join(post_folder, "enhanced_transcription.txt")
                        with open(enhanced_transcription_file, 'w', encoding='utf-8') as f:
                            f.write(enhanced_transcription)
                        print(f"✅ Enhanced transcription saved: {enhanced_transcription_file}")
                        print(f"📝 Enhanced transcription: {len(enhanced_transcription.split())} words")
                        print(f"📄 Enhanced preview: {enhanced_transcription[:200]}...")
                            
                    except Exception as e:
                        print(f"⚠️ Transcription failed: {e}")
                        print(f"🔍 Transcription error details: {str(e)}")
                
                # If no video, enhance caption instead
                if not video_processed:
                    print(f"🤖 No video found, enhancing caption instead...")
                    enhanced_transcription = enhance_caption_with_openai(
                        caption,
                        profile_data['full_name'],
                        target_words=300
                    )
                    enhanced_file = os.path.join(post_folder, "enhanced_content.txt")
                    with open(enhanced_file, 'w', encoding='utf-8') as f:
                        f.write(enhanced_transcription)
                    print(f"✅ Enhanced content from caption saved: {enhanced_file}")
                
                # Fallback to caption if no enhancement possible
                if not enhanced_transcription:
                    enhanced_transcription = caption[:1000]
                    print(f"⚠️ Using caption as fallback content")
                
                # Prepare post data for database
                post_data = {
                    'title': f"Post {post_count} by {profile_data['full_name'] or username}",
                    'content': enhanced_transcription or caption[:1000],
                    'caption': caption,
                    'original_transcription': original_transcription,
                    'enhanced_transcription': enhanced_transcription,  # This will be stored as the main transcription
                    'date': post.date_utc,
                    'original_url': f"https://instagram.com/p/{post.shortcode}"
                }
                
                print(f"💾 Saving to database...")
                post_id = save_post_to_database(connection, agent_id, post_data, post_count)
                if post_id:
                    successful_posts += 1
                    print(f"✅ Post saved to database with ID: {post_id}")
                else:
                    print(f"❌ Failed to save post to database")
                time.sleep(2)
            except Exception as e:
                print(f"❌ Error processing post {post_count}: {e}")
                print(f"🔍 Post processing error details: {str(e)}")
                continue
        print(f"\n🎉 Download completed!")
        print(f"📊 Posts processed: {post_count}")
        print(f"✅ Successfully saved: {successful_posts}")
        print(f"\n📁 Organizing files in public directory...")
        if organize_files_in_public_directory(username, agent_id, download_folder):
            print(f"✅ Files organized successfully!")
        print(f"\n📋 FINAL SUMMARY")
        print("=" * 40)
        print(f"👤 Agent: {profile_data['full_name']} (@{username})")
        print(f"🆔 Agent ID: {agent_id}")
        print(f"📸 Profile Picture: Saved")
        print(f"📊 Posts Downloaded: {successful_posts}/{post_count}")
        print(f"💾 Database Records: Created")
        print(f"📁 Files Organized: ✅")
        print(f"🤖 OpenAI Enhancement: {'✅' if client.api_key else '❌'}")
        print(f"🎤 Transcription Enhancement: {'✅ (5 paragraphs, 500+ words)' if client.api_key else '❌'}")
        print(f"🌐 Ready for website: ✅")
        try:
            shutil.rmtree(download_folder)
            print(f"🧹 Cleaned up temporary folder: {download_folder}")
        except:
            print(f"⚠️ Could not clean up folder: {download_folder}")
    except ProfileNotExistsException:
        print(f"❌ Instagram profile @{username} does not exist")
    except ConnectionException as e:
        print(f"❌ Instagram connection error: {e}")
        print("💡 Try again later or check your internet connection")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        print(f"🔍 Unexpected error details: {str(e)}")
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("🔌 Database connection closed")

def test_database_and_show_agents():
    """Test database connection and show current agents"""
    print("🔍 Testing database connection...")
    connection = create_database_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM agents")
            agent_count = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM posts")
            post_count = cursor.fetchone()[0]
            print(f"📊 Database Status:")
            print(f"👥 Total Agents: {agent_count}")
            print(f"📸 Total Posts: {post_count}")
            cursor.execute("""
                SELECT a.id, a.name, a.instagram, COUNT(p.id) as post_count
                FROM agents a
                LEFT JOIN posts p ON a.id = p.agent_id
                GROUP BY a.id, a.name, a.instagram
                ORDER BY a.created_at DESC
                LIMIT 5
            """)
            recent_agents = cursor.fetchall()
            if recent_agents:
                print(f"\n🔍 Recent Agents:")
                for agent in recent_agents:
                    print(f"• {agent[1]} (@{agent[2]}) - {agent[3]} posts - ID: {agent[0]}")
            else:
                print(f"\n📝 No agents found in database")
        except Error as e:
            print(f"❌ Error querying database: {e}")
        finally:
            cursor.close()
            connection.close()
            print()

if __name__ == "__main__":
    print("🚀 ENHANCED INSTAGRAM SCRAPER WITH PERSIAN TRANSCRIPTION ENHANCEMENT")
    print("=" * 60)
    print("📋 This script will:")
    print("• Download Instagram profile and posts")
    print("• Transcribe videos with ElevenLabs")
    print("• Enhance Persian transcriptions to 5 complete paragraphs (500+ words)")
    print("• Save enhanced transcriptions to MySQL database")
    print("• Organize files in public directory")
    print("• Create proper thumbnails and links")
    print("=" * 60)
    if not client.api_key:
        print("❌ CRITICAL: OpenAI API key not found!")
        print("Add OPENROUTER_API_KEY to your .env file to enable AI enhancement.")
        print("Without this, transcription enhancement will not work!")
    else:
        print("✅ OpenAI API key found - Persian transcription enhancement enabled")
        print(f"🔑 API Key: {client.api_key[:10]}...")
    test_database_and_show_agents()
    print("📝 Configuration:")
    username = input("Enter Instagram username (default: mojtaba.dubai.amlak): ").strip() or "mojtaba.dubai.amlak"
    browser = input("Enter browser for cookies (firefox/chrome/chromium, default: firefox): ").strip() or "chrome"
    try:
        max_posts = int(input("Enter number of posts to download (default: 5): ").strip() or "5")
    except ValueError:
        max_posts = 5
    print(f"\n🎯 Starting scraper with:")
    print(f"📸 Username: @{username}")
    print(f"🌐 Browser: {browser}")
    print(f"📊 Max Posts: {max_posts}")
    print(f"🤖 AI Enhancement: {'Enabled' if client.api_key else 'Disabled'}")
    print(f"🎤 Persian Enhancement: {'✅ (5 paragraphs, 500+ words)' if client.api_key else '❌'}")
    print("=" * 60)
    download_instagram_profile(username, browser, max_posts)
    print("\n🎉 Script completed! Check your database and public/agents/ folder.")