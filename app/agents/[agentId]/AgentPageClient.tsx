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
                className="text-slate-700 hover:text-slate-900 transition-colors luxury-text font-medium"
              >
                خانه
              </Link>
              <Link 
                href="#properties" 
                className="text-slate-500 hover:text-slate-700 transition-colors luxury-text"
              >
                املاک
              </Link>
              <button className="luxury-button px-6 py-3 rounded-xl luxury-text font-medium">
                تماس
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 relative z-10">
        {/* Hero Profile Section */}
        <div className="luxury-card rounded-2xl p-12 luxury-shadow-lg mb-16 animate-slide-up">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12 lg:space-x-reverse">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-48 h-48 luxury-gradient rounded-2xl relative overflow-hidden flex items-center justify-center luxury-shadow-lg">
                  {agent.profileImage ? (
                    <ImageWithFallback
                      src={getImagePath(agent.profileImage)}
                      alt={agent.name || "مشاور املاک"}
                      fill
                      className="object-cover"
                      fallbackSrc="/placeholder-user.jpg"
                    />
                  ) : (
                    <span className="text-white luxury-text font-bold text-6xl">
                      {getInitials(agent.name || "مشاور املاک")}
                    </span>
                  )}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 status-online rounded-full border-3 border-white">
                </div>
              </div>

              {/* Agent Information */}
              <div className="flex-1 text-center lg:text-right">
                <div className="mb-6">
                  <h1 className="text-4xl lg:text-5xl luxury-heading text-luxury mb-4 leading-tight">
                    {agent.name || agent.instagram?.toUpperCase() || "مشاور املاک ناشناس"}
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-6 sm:space-x-reverse text-slate-600">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span className="luxury-text font-medium">{agent.address || "دبی، امارات متحده عربی"}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Camera className="w-5 h-5 text-slate-400" />
                      <span className="luxury-text font-medium">{posts.length} املاک</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-slate-500 mr-2 luxury-text">(4.9)</span>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <ClientOnly>
                  <div className="flex justify-center lg:justify-start space-x-6 space-x-reverse mb-8">
                    {agent.instagram && (
                      <a
                        href={`https://instagram.com/${agent.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer elegant-hover luxury-shadow"
                      >
                        <Instagram className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {agent.twitter && (
                      <a
                        href={`https://twitter.com/${agent.twitter.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center cursor-pointer elegant-hover luxury-shadow"
                      >
                        <Twitter className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {agent.linkedin && (
                      <a 
                        href={`https://linkedin.com/in/${agent.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center cursor-pointer elegant-hover luxury-shadow"
                      >
                        <Linkedin className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>
                </ClientOnly>

                {/* Bio */}
                <div className="max-w-none mb-8 text-right" dir="rtl">
                  <p className="text-slate-600 text-lg leading-relaxed luxury-text">
                    {agent.bio || "مشاور املاک حرفه‌ای متخصص در املاک لوکس دبی."}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="text-center lg:text-right">
                  <p className="text-slate-500 luxury-text">
                    تماس از طریق اینستاگرام: @{agent.instagram}
                  </p>
                </div>
              </div>
            </div>
        </div>

        {/* Properties Section */}
        <section id="properties" className="mb-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl luxury-heading text-luxury mb-2">املاک ویژه</h2>
              <p className="text-lg text-slate-600 luxury-text">املاک منحصر به فرد از {agent.name}</p>
            </div>
          </div>

          {/* Debug Info - Only in development */}
          {process.env.NODE_ENV === 'development' && (
            <ClientOnly>
              <div className="mb-8 luxury-card rounded-2xl p-8 luxury-shadow">
                <h3 className="text-lg luxury-heading text-luxury mb-6">وضعیت سیستم</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-50/50 rounded-xl p-6 minimal-border">
                    <p className="luxury-text font-medium text-slate-700">شناسه مشاور</p>
                    <p className="text-slate-900 luxury-text">{agent.id}</p>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-6 minimal-border">
                    <p className="luxury-text font-medium text-slate-700">پست‌های بارگذاری شده</p>
                    <p className="text-slate-900 luxury-text">{posts.length} املاک</p>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-6 minimal-border">
                    <p className="luxury-text font-medium text-slate-700">وضعیت</p>
                    <p className={`luxury-text font-medium ${loading ? 'text-amber-600' : error ? 'text-red-600' : 'text-emerald-600'}`}>
                      {loading ? 'در حال بارگذاری...' : error ? 'خطا' : 'آماده'}
                    </p>
                  </div>
                </div>
                {agent.profileImage && (
                  <div className="mt-6 p-6 bg-slate-50/50 rounded-xl minimal-border">
                    <p className="text-xs text-slate-600 luxury-text">
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
              <div className="w-16 h-16 luxury-gradient rounded-2xl mx-auto mb-8 flex items-center justify-center loading-shimmer">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <p className="text-xl text-slate-500 luxury-text">در حال بارگذاری املاک...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="luxury-card rounded-2xl p-12 luxury-shadow max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
                  <span className="text-white text-xl">⚠️</span>
                </div>
                <h3 className="text-2xl luxury-heading text-luxury mb-6">امکان بارگذاری املاک وجود ندارد</h3>
                <p className="text-red-600 mb-10 luxury-text">{error}</p>
                <button
                  onClick={() => {
                    setHasFetched(false)
                    setError(null)
                    fetchPosts()
                  }}
                  className="luxury-button px-8 py-4 rounded-xl luxury-text font-medium"
                >
                  تلاش مجدد
                </button>
              </div>
            </div>
          ) : posts.length > 0 ? (
            <div className="property-grid">
              {posts.map((post, index) => (
                <Link key={post.id} href={`/agents/${agent.id}/posts/${post.id}`}>
                  <div className="property-card luxury-card rounded-2xl overflow-hidden luxury-shadow elegant-hover cursor-pointer animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    {/* Post Header */}
                    <div className="flex items-center justify-between p-6 border-b minimal-border">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-12 h-12 luxury-gradient rounded-xl flex items-center justify-center overflow-hidden relative">
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
                            <span className="text-white luxury-text font-semibold text-sm">
                              {getInitials(agent.name || agent.instagram || "مشاور املاک")}
                            </span>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 status-online rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <p className="luxury-text font-semibold text-slate-900">{agent.name || agent.instagram}</p>
                          <div className="flex items-center space-x-2 space-x-reverse text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm luxury-text">
                              {post.date ? new Date(post.date).toLocaleDateString('fa-IR') : "اخیراً"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors rotate-180" />
                      </div>
                    </div>

                    {/* Property Image */}
                    <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                      <ClientOnly
                        fallback={
                          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-slate-400" />
                          </div>
                        }
                      >
                        {(post.thumbnail || post.media?.thumbnail) ? (
                          <ImageWithFallback
                            src={getImagePath(post.thumbnail || post.media?.thumbnail)}
                            alt={post.title || "املاک"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            fallbackSrc="/placeholder.jpg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
                      </ClientOnly>
                      
                      {/* Premium Badge */}
                      <div className="absolute top-4 right-4 gold-accent text-slate-800 px-3 py-1 rounded-lg luxury-text font-medium text-sm luxury-shadow">
                        ویژه
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="property-card-content p-6 text-right" dir="rtl">
                      <h3 className="luxury-heading text-luxury text-lg mb-3 line-clamp-2 group-hover:text-slate-700 transition-colors">
                        {post.title || post.caption?.substring(0, 60) + "..." || "آگهی املاک منحصر به فرد"}
                      </h3>
                      <p className="text-slate-600 luxury-text line-clamp-3 leading-relaxed mb-4">
                        {post.caption || "این فرصت املاک استثنایی را در مکان‌های لوکس دبی کشف کنید."}
                      </p>
                      
                      {/* Property Features */}
                      <div className="property-card-footer flex items-center justify-between pt-4 border-t minimal-border mt-auto">
                        <div className="flex items-center space-x-2 space-x-reverse text-slate-500">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm luxury-text">دبی</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-slate-700 luxury-text font-medium bg-slate-50 px-3 py-1 rounded-lg">
                          <span className="text-sm">مشاهده</span>
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="luxury-card rounded-2xl p-12 luxury-shadow max-w-lg mx-auto">
                <div className="w-16 h-16 luxury-gradient rounded-2xl mx-auto mb-8 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl luxury-heading text-luxury mb-6">هنوز املاکی وجود ندارد</h3>
                <p className="text-slate-500 mb-10 luxury-text leading-relaxed">
                  {agent.name} در حال آماده‌سازی فهرست املاک منحصر به فرد است. به زودی برای فرصت‌های شگفت‌انگیز املاک بازگردید!
                </p>
                <Link
                  href={`/api/agents/${agent.id}/posts`}
                  className="luxury-button px-8 py-4 rounded-xl luxury-text font-medium"
                >
                  بررسی وضعیت API
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section id="contact" className="luxury-card rounded-2xl p-12 luxury-shadow animate-fade-in">
            <div className="text-center mb-12">
              <div className="w-16 h-16 gold-accent rounded-2xl mx-auto mb-6 flex items-center justify-center luxury-shadow">
                <Sparkles className="w-8 h-8 text-slate-800" />
              </div>
              <h3 className="text-3xl luxury-heading text-luxury mb-4">ارتباط با {agent.name}</h3>
              <p className="text-lg text-slate-600 luxury-text max-w-3xl mx-auto leading-relaxed">
                برای کشف املاک لوکس دبی تماس بگیرید
              </p>
            </div>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center justify-center p-8 luxury-card rounded-2xl luxury-shadow elegant-hover">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center ml-6 luxury-shadow">
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
      </main>

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