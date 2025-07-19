"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Instagram, Twitter, Linkedin, Mail, Phone, MoreHorizontal, MapPin, Calendar, Star, Users, Camera, ArrowRight, Sparkles, TrendingUp, Award } from "lucide-react"
import ClientOnly from "@/components/ClientOnly"
import ImageWithFallback from "@/components/ImageWithFallback"
import { getImagePath, containsPersianText, getInitials } from "@/lib/utils/imageUtils"

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
}

interface AgentPageClientProps {
  agent: Agent
}

export default function AgentPageClient({ agent }: AgentPageClientProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchPosts = useCallback(async () => {
    if (!agent?.id || hasFetched) {
      console.log("AgentPageClient: Skipping fetch - no agent ID or already fetched")
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log("AgentPageClient: Fetching posts for agent:", agent.id)

      const response = await fetch(`/api/agents/${agent.id}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      console.log("AgentPageClient: Posts API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("AgentPageClient: Posts API error:", errorData)
        throw new Error(`Failed to fetch posts: ${response.status} - ${errorData.details || "Unknown error"}`)
      }

      const data = await response.json()
      console.log("AgentPageClient: Posts data received:", data)
      setPosts(data.posts || [])
      setHasFetched(true)
    } catch (error) {
      console.error("AgentPageClient: Error fetching posts:", error)
      setError(error instanceof Error ? error.message : "خطا در بارگذاری پست‌ها")
    } finally {
      setLoading(false)
    }
  }, [agent?.id, hasFetched])

  useEffect(() => {
    console.log("AgentPageClient: useEffect triggered", { agentId: agent?.id, hasFetched })
    if (agent?.id && !hasFetched) {
      fetchPosts()
    }
  }, [agent?.id, hasFetched, fetchPosts])

  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center" dir="rtl">
        <div className="text-center bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-3xl">❌</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">مشاور املاک یافت نشد</h1>
          <p className="text-gray-600 mb-8 text-lg">مشاور املاک درخواستی یافت نشد.</p>
          <Link href="/" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-bold shadow-lg">
            بازگشت به خانه
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative overflow-hidden" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>

      {/* Premium Header */}
      <header className="glass-effect sticky top-0 z-50 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
                className="text-gray-700 hover:text-amber-600 transition-all duration-300 font-medium px-4 py-2 rounded-xl hover:bg-amber-50 relative group"
              >
                <span className="relative z-10">خانه</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </Link>
              <Link 
                href="#properties" 
                className="text-gray-700 hover:text-amber-600 transition-all duration-300 font-medium px-4 py-2 rounded-xl hover:bg-amber-50"
              >
                املاک
              </Link>
              <Link 
                href="#contact" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 font-bold shadow-xl btn-glow transform hover:scale-105"
              >
                تماس
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Profile Section */}
        <div className="glass-effect rounded-3xl p-12 shadow-2xl border border-white/20 mb-16 relative overflow-hidden animate-fade-in-up">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-bl from-amber-200/20 to-orange-200/20 rounded-full -translate-y-32 -translate-x-32 animate-float"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full translate-y-24 translate-x-24 animate-float" style={{animationDelay: '2s'}}></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12 lg:space-x-reverse">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl animate-bounce-in">
                  {agent.profileImage ? (
                    <ImageWithFallback
                      src={getImagePath(agent.profileImage)}
                      alt={agent.name || "مشاور املاک"}
                      fill
                      className="object-cover"
                      fallbackSrc="/placeholder-user.jpg"
                    />
                  ) : (
                    <span className="text-white font-bold text-8xl">
                      {getInitials(agent.name || "مشاور املاک")}
                    </span>
                  )}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-400 rounded-full border-4 border-white flex items-center justify-center animate-pulse">
                  <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                </div>
              </div>

              {/* Agent Information */}
              <div className="flex-1 text-center lg:text-right">
                <div className="mb-6">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                    {agent.name || agent.instagram?.toUpperCase() || "مشاور املاک ناشناس"}
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-6 sm:space-x-reverse text-gray-600">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <MapPin className="w-5 h-5 text-amber-500" />
                      <span className="font-medium text-lg">{agent.address || "دبی، امارات متحده عربی"}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Camera className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-lg">{posts.length} املاک</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-sm text-gray-600 mr-2 font-medium">(4.9)</span>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <ClientOnly>
                  <div className="flex justify-center lg:justify-start space-x-4 space-x-reverse mb-8">
                    {agent.instagram && (
                      <a
                        href={`https://instagram.com/${agent.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg btn-glow"
                      >
                        <Instagram className="w-7 h-7 text-white" />
                      </a>
                    )}
                    {agent.twitter && (
                      <a
                        href={`https://twitter.com/${agent.twitter.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg btn-glow"
                      >
                        <Twitter className="w-7 h-7 text-white" />
                      </a>
                    )}
                    {agent.linkedin && (
                      <a 
                        href={`https://linkedin.com/in/${agent.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg btn-glow"
                      >
                        <Linkedin className="w-7 h-7 text-white" />
                      </a>
                    )}
                  </div>
                </ClientOnly>

                {/* Bio */}
                <div className="prose prose-xl max-w-none mb-8 text-right" dir="rtl">
                  <p className="text-gray-700 text-xl leading-relaxed font-medium">
                    {agent.bio || "مشاور املاک حرفه‌ای متخصص در املاک لوکس دبی."}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="text-center lg:text-right">
                  <p className="text-gray-600 text-lg font-medium">
                    تماس از طریق اینستاگرام: @{agent.instagram}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <section id="properties" className="mb-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">املاک ویژه</h2>
              <p className="text-xl text-gray-600 font-medium">املاک منحصر به فرد از {agent.name}</p>
            </div>
          </div>

          {/* Debug Info - Only in development */}
          {process.env.NODE_ENV === 'development' && (
            <ClientOnly>
              <div className="mb-8 glass-effect rounded-3xl p-8 border border-blue-200/50">
                <h3 className="text-lg font-bold text-blue-900 mb-3">وضعیت سیستم</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/80 rounded-2xl p-6 border border-blue-100">
                    <p className="font-semibold text-blue-800">شناسه مشاور</p>
                    <p className="text-blue-600">{agent.id}</p>
                  </div>
                  <div className="bg-white/80 rounded-2xl p-6 border border-blue-100">
                    <p className="font-semibold text-blue-800">پست‌های بارگذاری شده</p>
                    <p className="text-blue-600">{posts.length} املاک</p>
                  </div>
                  <div className="bg-white/80 rounded-2xl p-6 border border-blue-100">
                    <p className="font-semibold text-blue-800">وضعیت</p>
                    <p className={`font-medium ${loading ? 'text-amber-600' : error ? 'text-red-600' : 'text-green-600'}`}>
                      {loading ? 'در حال بارگذاری...' : error ? 'خطا' : 'آماده'}
                    </p>
                  </div>
                </div>
                {agent.profileImage && (
                  <div className="mt-6 p-6 bg-white/80 rounded-2xl border border-blue-100">
                    <p className="text-xs text-blue-600">
                      <span className="font-semibold">تصویر پروفایل:</span> {agent.profileImage} → {getImagePath(agent.profileImage)}
                    </p>
                  </div>
                )}
              </div>
            </ClientOnly>
          )}

          {/* Properties Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl mx-auto mb-8 flex items-center justify-center animate-pulse">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl text-gray-500 font-medium">در حال بارگذاری املاک منحصر به فرد...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="glass-effect rounded-3xl p-12 shadow-2xl border border-red-200/50 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                  <span className="text-white text-2xl">⚠️</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">امکان بارگذاری املاک وجود ندارد</h3>
                <p className="text-red-600 mb-10 font-medium text-lg">{error}</p>
                <button
                  onClick={() => {
                    setHasFetched(false)
                    setError(null)
                    fetchPosts()
                  }}
                  className="px-10 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-bold shadow-xl btn-glow text-lg"
                >
                  تلاش مجدد
                </button>
              </div>
            </div>
          ) : posts.length > 0 ? (
            <div className="property-grid">
              {posts.map((post, index) => (
                <Link key={post.id} href={`/agents/${agent.id}/posts/${post.id}`}>
                  <div className="property-card glass-effect rounded-3xl overflow-hidden shadow-xl border border-white/20 card-hover cursor-pointer animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                    {/* Post Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center overflow-hidden relative">
                          {agent.profileImage ? (
                            <ImageWithFallback
                              src={getImagePath(agent.profileImage)}
                              alt={agent.name || "مشاور املاک"}
                              width={48}
                              height={48}
                              className="object-cover"
                              fallbackSrc="/placeholder-user.jpg"
                            />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {getInitials(agent.name || agent.instagram || "مشاور املاک")}
                            </span>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{agent.name || agent.instagram}</p>
                          <div className="flex items-center space-x-2 space-x-reverse text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {post.date ? new Date(post.date).toLocaleDateString('fa-IR') : "اخیراً"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors rotate-180" />
                      </div>
                    </div>

                    {/* Property Image */}
                    <div className="relative h-80 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                      <ClientOnly
                        fallback={
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <Camera className="w-12 h-12 text-gray-400" />
                          </div>
                        }
                      >
                        {(post.thumbnail || post.media?.thumbnail) ? (
                          <ImageWithFallback
                            src={getImagePath(post.thumbnail || post.media?.thumbnail)}
                            alt={post.title || "املاک"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            fallbackSrc="/placeholder.jpg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <Camera className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </ClientOnly>
                      
                      {/* Property Badge */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg animate-pulse">
                        ویژه
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="property-card-content p-6 text-right" dir="rtl">
                      <h3 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {post.title || post.caption?.substring(0, 60) + "..." || "آگهی املاک منحصر به فرد"}
                      </h3>
                      <p className="text-gray-600 text-base line-clamp-3 leading-relaxed mb-4">
                        {post.caption || "این فرصت املاک استثنایی را در مکان‌های لوکس دبی کشف کنید."}
                      </p>
                      
                      {/* Property Features */}
                      <div className="property-card-footer flex items-center justify-between pt-4 border-t border-gray-200/50 mt-auto">
                        <div className="flex items-center space-x-2 space-x-reverse text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-medium">دبی</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-lg">
                          <span className="text-sm">مشاهده جزئیات</span>
                          <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="glass-effect rounded-3xl p-12 shadow-2xl border border-gray-200/50 max-w-lg mx-auto animate-bounce-in">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">هنوز املاکی وجود ندارد</h3>
                <p className="text-gray-500 mb-10 text-lg leading-relaxed">
                  {agent.name} در حال آماده‌سازی فهرست املاک منحصر به فرد است. به زودی برای فرصت‌های شگفت‌انگیز املاک بازگردید!
                </p>
                <Link
                  href={`/api/agents/${agent.id}/posts`}
                  className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-xl btn-glow text-lg"
                >
                  بررسی وضعیت API
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section id="contact" className="glass-effect rounded-3xl p-12 shadow-2xl border border-white/20 relative overflow-hidden animate-fade-in-up">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-bl from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-24 -translate-x-24 animate-float"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tr from-amber-200/20 to-orange-200/20 rounded-full translate-y-20 translate-x-20 animate-float" style={{animationDelay: '3s'}}></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-bounce-in">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight animate-fade-in-up">ارتباط با {agent.name}</h3>
              <p className="text-lg text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
                برای کشف املاک لوکس دبی با راهنمایی شخصی و فرصت‌های منحصر به فرد تماس بگیرید.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="max-w-lg mx-auto">
                <div className="flex items-center justify-center p-8 glass-effect rounded-3xl border border-white/20 shadow-xl card-hover">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center ml-6 btn-glow">
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-1">اینستاگرام</p>
                    <p className="text-pink-600 font-bold text-lg">@{agent.instagram}</p>
                    <p className="text-gray-500 text-sm">ارسال پیام مستقیم</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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