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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative overflow-hidden" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>

      {/* Premium Header */}
      <header className="glass-effect sticky top-0 z-50 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between" dir="rtl">
            {/* Premium Logo */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl animate-float">
                  <span className="text-white font-bold text-2xl">د</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-3xl font-bold gradient-text">
                  دبی الیت
                </h1>
                <p className="text-sm text-amber-600 font-medium">املاک لوکس</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6 space-x-reverse">
              <Link 
                href="/" 
                className="flex items-center space-x-2 space-x-reverse text-gray-700 hover:text-amber-600 transition-all duration-300 font-medium group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>خانه</span>
              </Link>
              <Link 
                href={`/agents/${agent.id}`} 
                className="text-gray-700 hover:text-amber-600 transition-all duration-300 font-medium px-4 py-2 rounded-xl hover:bg-amber-50"
              >
                پروفایل مشاور
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Elegant Breadcrumb */}
        <nav className="flex items-center space-x-3 space-x-reverse text-sm text-gray-500 mb-12 animate-slide-in-right">
          <Link href="/" className="hover:text-amber-600 transition-colors font-medium">خانه</Link>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <Link href={`/agents/${agent.id}`} className="hover:text-amber-600 transition-colors font-medium">{agent.name}</Link>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <span className="text-gray-900 font-medium">پست املاک</span>
        </nav>

        {/* Agent Header Card */}
        <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/20 mb-12 animate-fade-in-up">
          <div className="flex items-center justify-between" dir="rtl">
            <div className="flex items-center space-x-6 space-x-reverse">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg relative">
                <span className="text-white font-bold text-2xl">
                  {agent.name?.split(' ').map(n => n[0]).join('') || '?'}
                </span>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{agent.name}</h2>
                <div className="flex items-center space-x-4 space-x-reverse text-gray-600">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">{agent.address}</span>
                  </div>
                  {agent.instagram && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span className="font-medium">@{agent.instagram}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse text-gray-500 bg-amber-50 px-4 py-2 rounded-xl">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-12 text-right animate-fade-in-up">
          {post.title || `Exclusive Property by ${agent.name}`}
        </h1>

        {/* Main Image - Keep Original Design */}
        {(post.media?.thumbnail || post.thumbnail) && !imageError && (
          <div className="mb-16 animate-fade-in-up">
            <div className="relative w-full bg-gray-100 rounded-3xl overflow-hidden shadow-2xl">
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
          <div className="mb-16 animate-fade-in-up">
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center">
              <div className="text-center">
                <span className="text-gray-500 text-6xl mb-4 block">📷</span>
                <p className="text-gray-600">Image not available</p>
                <p className="text-xs text-gray-500 mt-2">Path: {imageSrc}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-12 animate-fade-in-up">
          {/* Property Details */}
          {post.content && (
            <section className="glass-effect rounded-3xl p-10 shadow-2xl border border-white/20 relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full -translate-y-16 translate-x-16 animate-float"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full translate-y-12 -translate-x-12 animate-float" style={{animationDelay: '2s'}}></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="w-2 h-12 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-6"></div>
                  <h3 className="text-3xl font-bold text-gray-900">جزئیات املاک</h3>
                </div>
                <div className="prose prose-xl max-w-none text-right" dir="rtl">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-xl font-medium">
                    {post.content}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Original Caption */}
          <section className="glass-effect rounded-3xl p-10 border border-blue-200/50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-10 -translate-x-10 animate-float"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-200/20 to-pink-200/20 rounded-full translate-y-8 translate-x-8 animate-float" style={{animationDelay: '3s'}}></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-6"></div>
                <h3 className="text-3xl font-bold text-gray-900">پست اصلی</h3>
              </div>
              <div className="prose prose-xl max-w-none text-right" dir="rtl">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {post.caption}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Enhanced Content */}
        {post.transcription && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">محتوای تکمیلی</h2>
            <div className="prose prose-xl max-w-none text-right" dir="rtl">
              {post.transcription}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 sm:space-x-reverse my-16 animate-fade-in-up">
          <button 
            onClick={scrollToContact} 
            className="w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-2xl hover:from-amber-600 hover:via-orange-600 hover:to-red-600 transition-all duration-300 font-bold text-lg shadow-xl btn-glow transform hover:scale-105"
          >
            تماس با مشاور
          </button>

          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center space-x-3 space-x-reverse text-gray-700 hover:text-amber-600 transition-all duration-300 px-10 py-5 rounded-2xl glass-effect border border-white/20 hover:border-amber-200 font-semibold shadow-lg"
              title="Share this post"
            >
              <Share2 className="w-5 h-5" />
              <span>اشتراک‌گذاری املاک</span>
            </button>
            {showShareSuccess && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-6 py-3 glass-effect text-green-800 text-sm rounded-xl shadow-lg border border-green-200 font-medium animate-bounce-in">
                لینک با موفقیت کپی شد! ✓
              </div>
            )}
          </div>

          {post.originalUrl && (
            <a
              href={post.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-all duration-300 px-10 py-5 rounded-2xl glass-effect border border-blue-200/50 hover:border-blue-300 font-semibold shadow-lg"
            >
              مشاهده در اینستاگرام
            </a>
          )}
        </div>

        {/* Premium Contact Section */}
        <section id="contact-info" className="glass-effect rounded-3xl p-12 shadow-2xl border border-white/20 mt-20 relative overflow-hidden animate-fade-in-up">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-200/20 to-orange-200/20 rounded-full -translate-y-20 translate-x-20 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full translate-y-16 -translate-x-16 animate-float" style={{animationDelay: '4s'}}></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-bounce-in">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">آماده کشف این املاک هستید؟</h3>
              <p className="text-xl text-gray-600 font-medium">برای دسترسی انحصاری و خدمات شخصی با {agent.name} تماس بگیرید</p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-center p-8 glass-effect rounded-3xl border border-white/20 shadow-xl card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 btn-glow">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-1">اینستاگرام</p>
                  <p className="text-pink-600 font-bold text-lg">@{agent.instagram}</p>
                  <p className="text-gray-500 text-sm">ارسال پیام مستقیم</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Profile */}
        <div className="text-center mt-16 animate-fade-in-up">
          <Link 
            href={`/agents/${agent.id}`} 
            className="inline-flex items-center space-x-3 space-x-reverse px-12 py-6 glass-effect text-gray-700 rounded-2xl hover:bg-white/50 transition-all duration-300 font-bold text-lg shadow-xl border border-white/20 transform hover:scale-105"
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
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 z-50 btn-glow animate-bounce-in"
          title="Back to top"
        >
          <ChevronUp className="w-8 h-8" />
        </button>
      )}

      {/* Minimal Footer */}
      <footer className="mt-24 py-8 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-effect rounded-2xl p-6 border border-white/20">
            <p className="text-gray-600 font-medium">
              © ۲۰۲۴ دبی الیت - املاک لوکس. تمامی حقوق محفوظ است.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}