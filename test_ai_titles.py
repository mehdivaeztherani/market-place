#!/usr/bin/env python3
"""
Test script for AI title generation
This script tests the AI title generation functionality without running the full scraper
"""

import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# Test Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def test_groq_connection():
    """Test Groq API connection"""
    try:
        if not GROQ_API_KEY:
            print("❌ GROQ_API_KEY not found in .env file!")
            return False
            
        groq_client = Groq(api_key=GROQ_API_KEY)
        print("✅ Groq client initialized successfully")
        print(f"🔑 API Key: {GROQ_API_KEY[:10]}...")
        return groq_client
    except Exception as e:
        print(f"❌ Error initializing Groq client: {e}")
        return False

def generate_test_title(groq_client, content, caption="", agent_name=""):
    """Test title generation with sample content"""
    try:
        print(f"🤖 Testing title generation...")
        print(f"📝 Content: {content[:100]}...")
        
        prompt = f"""تو یک متخصص تولید عنوان برای آگهی‌های املاک در دبی هستی که باید عنوان‌های جذاب و منحصر به فرد بسازی.

وظیفه تو:
1. بر اساس محتوای ارائه شده، یک عنوان جذاب، منحصر به فرد و حرفه‌ای به زبان فارسی بنویس
2. عنوان باید بین 6 تا 15 کلمه باشد
3. عنوان باید شامل نوع ملک (آپارتمان، ویلا، دفتر، پنت‌هاوس و...) و منطقه دبی باشد
4. از کلمات جذاب مثل "لوکس"، "منحصر به فرد"، "ویژه"، "استثنایی"، "برتر"، "فوق‌العاده" استفاده کن
5. عنوان باید برای بازاریابی املاک و SEO مناسب باشد
6. عنوان باید منعکس‌کننده محتوای واقعی پست باشد
7. فقط عنوان را بنویس، هیچ توضیح، علامت نقل قول یا متن اضافی نده
8. عنوان باید کاملاً منحصر به فرد و مرتبط با محتوا باشد

مثال‌های عنوان خوب:
- "آپارتمان لوکس ۲ خوابه با نمای برج خلیفه در داون‌تاون دبی"
- "ویلای استثنایی ۴ خوابه با استخر خصوصی در امیریتس هیلز"
- "پنت‌هاوس فوق‌العاده با نمای ۳۶۰ درجه در دبی مارینا"
- "دفتر تجاری مدرن در قلب مرکز مالی دبی"

مشاور املاک: {agent_name if agent_name else "مشاور املاک دبی"}

محتوای کامل املاک:
{content}

کپشن اصلی:
{caption if caption else "بدون کپشن"}

حالا یک عنوان منحصر به فرد و جذاب بساز:"""

        response = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
<<<<<<< HEAD
            model="gemma2-9b-it",
=======
            model="llama-3.1-70b-versatile",
>>>>>>> f050a1533b219fe630f34035c4fe0cc7fa66264b
            temperature=0.7,
            max_tokens=150,
            top_p=0.9
        )
        
        title = response.choices[0].message.content.strip()
        
        # Clean up the title
        title = title.replace('"', '').replace("'", '').replace('«', '').replace('»', '').strip()
        
        # Remove any prefixes like "عنوان:" or "Title:"
        if ':' in title:
            title = title.split(':', 1)[-1].strip()
        
        print(f"✅ Generated title: {title}")
        print(f"📊 Title length: {len(title.split())} words")
        
        return title
        
    except Exception as e:
        print(f"❌ Title generation failed: {e}")
        return None

def main():
    """Main test function"""
    print("🧪 TESTING AI TITLE GENERATION")
    print("=" * 50)
    
    # Test Groq connection
    groq_client = test_groq_connection()
    if not groq_client:
        print("❌ Cannot proceed without Groq client")
        return
    
    # Test cases with different types of content
    test_cases = [
        {
            "content": "همه ما می‌دانیم که خرید خانه در دوبی یک فرایند پیچیده و حساس است که به دقت و توجه دقیق نیاز دارد. یکی از مهم‌ترین نکات در این فرایند، واریز وجه به حساب صحیح است. بزرگترین اشتباه که بسیاری از خریداران در فرایند خرید خانه در دوبی مرتکب می‌شوند، این است که پول خود را به حسابی غیر از اکانت پروژه مربوطه واریز می‌کنند.",
            "caption": "🏙️ Just closed another amazing deal in Downtown Dubai! This stunning 2BR apartment with Burj Khalifa views is now home to a lovely family from the UK. #DubaiRealEstate #DowntownDubai #BurjKhalifaViews",
            "agent_name": "مجتبی دبی املاک"
        },
        {
            "content": "این ویلای فوق‌العاده در امیریتس هیلز با ۵ اتاق خواب، استخر خصوصی، باغ زیبا و نمای دریاچه ارائه می‌شود. این ملک در یکی از محبوب‌ترین مناطق دبی قرار دارد و دسترسی آسان به مراکز خرید و مدارس بین‌المللی دارد.",
            "caption": "🌴 Exclusive Emirates Hills villa now available! This magnificent property offers privacy, luxury, and stunning views. #EmiratesHills #LuxuryVilla #DubaiSkyline",
            "agent_name": "احمد حسن"
        },
        {
            "content": "آپارتمان یک خوابه مدرن در دبی مارینا با نمای دریا و امکانات کامل ورزشی. این واحد در طبقه ۲۵ قرار دارد و دسترسی مستقیم به ساحل و مراکز تفریحی دارد. مناسب برای سرمایه‌گذاری یا سکونت.",
            "caption": "🌊 Marina living at its best! Just listed this beautiful 1BR apartment with stunning marina views. Perfect for young professionals! #DubaiMarina #MarinaViews",
            "agent_name": "سارا ویلیامز"
        }
    ]
    
    print(f"\n🧪 Testing {len(test_cases)} different content types:")
    print("=" * 50)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📋 Test Case {i}:")
        print(f"👤 Agent: {test_case['agent_name']}")
        
        title = generate_test_title(
            groq_client,
            test_case['content'],
            test_case['caption'],
            test_case['agent_name']
        )
        
        if title:
            print(f"✅ SUCCESS: Generated unique title")
        else:
            print(f"❌ FAILED: Could not generate title")
        
        print("-" * 30)
    
    print(f"\n🎉 Title generation test completed!")
    print("💡 If all tests passed, the AI title generation should work in the main scraper.")

if __name__ == "__main__":
    main()