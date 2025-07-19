"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronUp, Share2, Mail, Phone, ArrowLeft, Calendar, MapPin, Instagram } from "lucide-react"

interface Agent {
  id: string
  name: string
  address: string
  bio: string
  phone: string
  email: string
  instagram?: string
  twitter?: string
  linkedin?: string
  profileImage?: string
}

interface Post {
  id: string
  agentId: string
  title: string
  content: string
  transcription?: string
  date: string
  media: {
    type: string
    thumbnail: string
  }
  caption: string
  originalUrl: string
  thumbnail?: string
  enhanced_content?: string
}

interface PostPageClientProps {
  agent: Agent
  post: Post
}

// Helper function to get the correct image path
function getImagePath(imagePath: string | undefined): string {
  if (!imagePath) return "/placeholder.svg"
  
  // If it's already a full URL or starts with http, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
    return imagePath
  }
  
  // If it starts with /agents/, it's our database path - use directly
  if (imagePath.startsWith('/agents/')) {
    return imagePath
  }
  
  // If it starts with /, use as is (public directory)
  if (imagePath.startsWith('/')) {
    return imagePath
  }
  
  // Otherwise, assume it's a relative path and add /
  return `/${imagePath}`
}

// Helper function to detect if text contains Persian/Arabic characters
function containsPersianText(text: string): boolean {
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
  return persianRegex.test(text)
}

export default function PostPageClient({ agent, post }: PostPageClientProps) {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showShareSuccess, setShowShareSuccess] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setShowShareSuccess(true)
      setTimeout(() => setShowShareSuccess(false), 2000)
    } catch (err) {
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setShowShareSuccess(true)
      setTimeout(() => setShowShareSuccess(false), 2000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToContact = () => {
    document.getElementById("contact-info")?.scrollIntoView({ behavior: "smooth" })
  }

  // Get the image source
  const imageSrc = getImagePath(post.media?.thumbnail || post.thumbnail)

  // Detect RTL content
  const isContentRTL = containsPersianText(post.content || '')
  const isCaptionRTL = containsPersianText(post.caption || '')

  return (
    <div className="min-h-screen luxury-bg relative" dir="rtl">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-slate-100/40 to-slate-200/40 rounded-full blur-3xl animate-luxury-float"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-blue-50/60 to-indigo-50/60 rounded-full blur-3xl animate-luxury-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Minimal Header */}
      <header className="relative z-50 border-b minimal-border bg-white/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Elegant Logo */}
            <div className="flex items-center space-x-6 space-x-reverse">
              <div className="relative">
                <div className="w-12 h-12 luxury-gradient rounded-xl flex items-center justify-center luxury-shadow">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 status-premium rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl luxury-heading text-luxury">دبی الیت</h1>
                <p className="text-sm text-slate-500 luxury-text">املاک لوکس</p>
              </div>
            </div>

            {/* Minimal Navigation */}
            <nav className="flex items-center space-x-8 space-x-reverse">
              <Link 
                href="/" 
                className="flex items-center space-x-2 space-x-reverse text-slate-700 hover:text-slate-900 transition-colors luxury-text font-medium group"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>خانه</span>
              </Link>
              <Link 
                href={`/agents/${agent.id}`} 
                className="text-slate-500 hover:text-slate-700 transition-colors luxury-text"
              >
                پروفایل مشاور
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12 relative z-10">
        {/* Elegant Breadcrumb */}
        <nav className="flex items-center space-x-3 space-x-reverse text-sm text-slate-500 mb-12 animate-fade-in">
          <Link href="/" className="hover:text-slate-700 transition-colors luxury-text">خانه</Link>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <Link href={`/agents/${agent.id}`} className="hover:text-slate-700 transition-colors luxury-text">{agent.name}</Link>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <span className="text-slate-900 luxury-text font-medium">پست املاک</span>
        </nav>

        {/* Agent Header Card */}
        <div className="luxury-card rounded-2xl p-8 luxury-shadow mb-12 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 space-x-reverse">
              <div className="w-14 h-14 luxury-gradient rounded-xl flex items-center justify-center luxury-shadow relative">
                <span className="text-white luxury-text font-semibold text-lg">
                  {agent.name?.split(' ').map(n => n[0]).join('') || '?'}
                </span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 status-online rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-xl luxury-heading text-luxury mb-1">{agent.name}</h2>
                <div className="flex items-center space-x-4 space-x-reverse text-slate-600">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="luxury-text">{agent.address}</span>
                  </div>
                  {agent.instagram && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Instagram className="w-4 h-4 text-pink-400" />
                      <span className="luxury-text">@{agent.instagram}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse text-slate-500 bg-slate-50 px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span className="luxury-text">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Post Title */}
        <h1 className="text-3xl md:text-4xl luxury-heading text-luxury leading-tight mb-12 text-right animate-slide-up">
          {post.title || `Exclusive Property by ${agent.name}`}
        </h1>

        {/* Main Image - Keep Original Design */}
        {(post.media?.thumbnail || post.thumbnail) && !imageError && (
          <div className="mb-16 animate-fade-in">
            <div className="relative w-full bg-slate-100 rounded-2xl overflow-hidden luxury-shadow-lg">
              <Image
                src={imageSrc}
                alt={post.title || "Post"}
                width={1200}
                height={800}
                className="w-full h-auto object-contain max-h-[80vh]"
                priority
                onError={(e) => {
                  console.log("Post image failed to load:", imageSrc)
                  setImageError(true)
                }}
                onLoad={() => {
                  console.log("Post image loaded successfully:", imageSrc)
                }}
              />
            </div>
          </div>
        )}

        {/* Show placeholder if image failed to load */}
        {imageError && (
          <div className="mb-16 animate-fade-in">
            <div className="relative w-full h-96 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <span className="text-slate-500 text-4xl mb-4 block">📷</span>
                <p className="text-slate-600 luxury-text">تصویر در دسترس نیست</p>
                <p className="text-xs text-slate-500 luxury-text mt-2">Path: {imageSrc}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-12 animate-fade-in">
          {/* Property Details */}
          {post.content && (
            <section className="luxury-card rounded-2xl p-10 luxury-shadow">
                <div className="flex items-center mb-8">
                  <div className="w-1 h-8 luxury-gradient rounded-full mr-4"></div>
                  <h3 className="text-2xl luxury-heading text-luxury">جزئیات املاک</h3>
                </div>
                <div className="max-w-none text-right" dir="rtl">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap luxury-text">
                    {post.content}
                  </p>
                </div>
            </section>
          )}

          {/* Original Caption */}
          <section className="luxury-card rounded-2xl p-10 luxury-shadow">
              <div className="flex items-center mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
                <h3 className="text-2xl luxury-heading text-luxury">پست اصلی</h3>
              </div>
              <div className="max-w-none text-right" dir="rtl">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap luxury-text">
                  {post.caption}
                </p>
              </div>
          </section>
        </div>

        {/* Enhanced Content */}
        {post.transcription && (
          <div className="mt-12">
            <h2 className="text-2xl luxury-heading text-luxury mb-4">محتوای تکمیلی</h2>
            <div className="max-w-none text-right" dir="rtl">
              {post.transcription}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 sm:space-x-reverse my-16 animate-fade-in">
          <button 
            onClick={scrollToContact} 
            className="w-full sm:w-auto luxury-button px-10 py-4 rounded-xl luxury-text font-medium"
          >
            تماس با مشاور
          </button>

          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center space-x-3 space-x-reverse text-slate-700 hover:text-slate-900 transition-colors px-8 py-4 rounded-xl luxury-card minimal-border luxury-text font-medium"
              title="Share this post"
            >
              <Share2 className="w-5 h-5" />
              <span>اشتراک‌گذاری املاک</span>
            </button>
            {showShareSuccess && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-6 py-3 luxury-card text-emerald-800 text-sm rounded-xl luxury-shadow minimal-border luxury-text animate-scale-in">
                لینک با موفقیت کپی شد! ✓
              </div>
            )}
          </div>

          {post.originalUrl && (
            <a
              href={post.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors px-8 py-4 rounded-xl luxury-card minimal-border luxury-text font-medium"
            >
              مشاهده در اینستاگرام
            </a>
          )}
        </div>

        {/* Premium Contact Section */}
        <section id="contact-info" className="luxury-card rounded-2xl p-12 luxury-shadow mt-20 animate-fade-in">
            <div className="text-center mb-12">
              <div className="w-16 h-16 gold-accent rounded-2xl mx-auto mb-6 flex items-center justify-center luxury-shadow">
                <Sparkles className="w-8 h-8 text-slate-800" />
              </div>
              <h3 className="text-3xl luxury-heading text-luxury mb-4">آماده کشف این املاک هستید؟</h3>
              <p className="text-lg text-slate-600 luxury-text">برای دسترسی انحصاری با {agent.name} تماس بگیرید</p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-center p-8 luxury-card rounded-2xl luxury-shadow elegant-hover">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mr-6 luxury-shadow">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 luxury-text font-medium mb-1">اینستاگرام</p>
                  <p className="text-pink-600 luxury-text font-semibold">@{agent.instagram}</p>
                  <p className="text-slate-500 text-sm luxury-text">ارسال پیام مستقیم</p>
                </div>
              </div>
            </div>
        </section>

        {/* Back to Profile */}
        <div className="text-center mt-16 animate-fade-in">
          <Link 
            href={`/agents/${agent.id}`} 
            className="inline-flex items-center space-x-3 space-x-reverse px-10 py-4 luxury-card text-slate-700 rounded-xl hover:bg-white/80 transition-colors luxury-text font-medium luxury-shadow minimal-border elegant-hover"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>بازگشت به نمونه کارهای {agent.name}</span>
          </Link>
        </div>
      </main>

      {/* Premium Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 luxury-button text-white rounded-xl flex items-center justify-center luxury-shadow-lg transition-all duration-300 elegant-hover z-50"
          title="Back to top"
        >
          <ChevronUp className="w-8 h-8" />
        </button>
      )}

      {/* Clean Footer */}
      <div className="border-t minimal-border bg-white/60 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-8 py-8 text-center">
            <p className="text-slate-500 luxury-text">
              © ۲۰۲۴ دبی الیت - املاک لوکس. تمامی حقوق محفوظ است.
            </p>
        </div>
      </div>
    </div>
  )
}