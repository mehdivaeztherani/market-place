import { getAllAgents } from "@/lib/data"
import Link from "next/link"
import ClientOnly from "@/components/ClientOnly"
import ImageWithFallback from "@/components/ImageWithFallback"
import { getImagePath, getInitials } from "@/lib/utils/imageUtils"
import { Search, Star, MapPin, Phone, Instagram, ArrowLeft, Sparkles, TrendingUp, Award, Users } from "lucide-react"

export default async function HomePage() {
  let agents: any[] = [];
  let error = null;

  try {
    console.log('Homepage: Starting to fetch agents...');
    agents = await getAllAgents()
    console.log('Homepage: Received agents:', agents?.length || 0);
    
    if (!agents || agents.length === 0) {
      console.log('Homepage: No agents found, checking API directly...');
      const response = await fetch('http://localhost:3000/api/agents', {
        cache: 'no-store'
      });
      const data = await response.json();
      console.log('Homepage: Direct API response:', data);
    }
  } catch (err) {
    console.error('Homepage: Error fetching agents:', err);
    agents = [];
    error = 'Failed to load agents. Please check database connection.';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between" dir="rtl">
            {/* Premium Logo */}
            <div className="flex items-center space-x-4 space-x-reverse animate-slide-in-right">
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
                <p className="text-sm text-amber-600 font-medium">املاک لوکس و منحصر به فرد</p>
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
                href="/api/test-db" 
                className="text-gray-700 hover:text-amber-600 transition-all duration-300 font-medium px-4 py-2 rounded-xl hover:bg-amber-50"
              >
                تست دیتابیس
              </Link>
              <Link 
                href="#contact" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 font-bold shadow-xl btn-glow transform hover:scale-105"
              >
                تماس با ما
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10" dir="rtl">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full mb-8 animate-bounce-in">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800 font-medium">بهترین مشاوران املاک دبی</span>
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="gradient-text">دبی الیت</span>
            <br />
            <span className="text-gray-700">بازار املاک لوکس</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium mb-12">
            با بهترین متخصصان املاک دبی ارتباط برقرار کنید و خانه رویایی خود را در پویاترین شهر جهان کشف کنید
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="glass-effect rounded-2xl p-6 text-center animate-bounce-in" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{agents?.length || 0}+</div>
              <div className="text-sm text-gray-600 font-medium">مشاور متخصص</div>
            </div>
            
            <div className="glass-effect rounded-2xl p-6 text-center animate-bounce-in" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600 font-medium">املاک فروخته شده</div>
            </div>
            
            <div className="glass-effect rounded-2xl p-6 text-center animate-bounce-in" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600 font-medium">رضایت مشتریان</div>
            </div>
            
            <div className="glass-effect rounded-2xl p-6 text-center animate-bounce-in" style={{animationDelay: '0.4s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">5.0</div>
              <div className="text-sm text-gray-600 font-medium">امتیاز متوسط</div>
            </div>
          </div>
        </div>

        {/* Debug Info - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <ClientOnly>
            <div className="mb-12 glass-effect rounded-3xl p-8 border border-blue-200/50 animate-fade-in-up">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full ml-3"></div>
                وضعیت توسعه
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 rounded-2xl p-6 border border-blue-100">
                  <p className="font-semibold text-blue-800 mb-2">وضعیت دیتابیس</p>
                  <p className={`font-bold text-lg ${error ? 'text-red-600' : 'text-green-600'}`}>
                    {error ? 'قطع شده' : 'متصل'}
                  </p>
                </div>
                <div className="bg-white/80 rounded-2xl p-6 border border-blue-100">
                  <p className="font-semibold text-blue-800 mb-2">مشاوران یافت شده</p>
                  <p className="text-blue-600 font-bold text-lg">{agents?.length || 0} مشاور</p>
                </div>
                <div className="bg-white/80 rounded-2xl p-6 border border-blue-100">
                  <p className="font-semibold text-blue-800 mb-2">سیستم</p>
                  <p className="text-green-600 font-bold text-lg">MySQL + Next.js</p>
                </div>
              </div>
              {error && (
                <div className="mt-6 p-6 bg-red-50 rounded-2xl border border-red-200">
                  <p className="text-red-800 font-medium">خطا: {error}</p>
                </div>
              )}
            </div>
          </ClientOnly>
        )}

        {/* Agents Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">مشاوران برتر املاک</h2>
            <p className="text-xl text-gray-600 font-medium">با بهترین متخصصان املاک دبی آشنا شوید</p>
          </div>

          {/* Agent Cards Grid */}
          {agents && agents.length > 0 ? (
            <div className="property-grid">
              {agents.map((agent, index) => (
                <Link key={agent.id} href={`/agents/${agent.id}`}>
                  <div className="property-card glass-effect rounded-3xl p-8 card-hover border border-white/20 shadow-xl animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="property-card-content">
                      {/* Profile Image */}
                      <div className="relative mx-auto mb-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-shadow">
                          {agent.profileImage ? (
                            <ImageWithFallback
                              src={getImagePath(agent.profileImage)}
                              alt={agent.name || "Agent"}
                              fill
                              className="object-cover"
                              fallbackSrc="/placeholder-user.jpg"
                            />
                          ) : (
                            <span className="text-white font-bold text-3xl">
                              {getInitials(agent.name || "Agent")}
                            </span>
                          )}
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center animate-pulse">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                      </div>

                      {/* Agent Info */}
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                          {agent.name || 'مشاور ناشناس'}
                        </h3>
                        
                        <div className="flex items-center justify-center space-x-2 space-x-reverse text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          <span className="font-medium">{agent.address || 'دبی، امارات'}</span>
                        </div>

                        <div className="flex items-center justify-center space-x-1 space-x-reverse mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-sm text-gray-600 mr-2 font-medium">(4.9)</span>
                        </div>
                      </div>

                      {/* Bio Preview */}
                      {agent.bio && (
                        <p className="text-gray-600 text-center text-sm leading-relaxed mb-6 line-clamp-3">
                          {agent.bio}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="property-card-footer">
                      <div className="pt-6 border-t border-gray-200/50 space-y-3">
                        {agent.instagram && (
                          <div className="flex items-center justify-center space-x-2 space-x-reverse text-pink-600">
                            <Instagram className="w-4 h-4" />
                            <span className="text-sm font-medium">@{agent.instagram}</span>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <span className="inline-flex items-center space-x-2 space-x-reverse text-amber-600 font-bold text-sm bg-amber-50 px-4 py-2 rounded-xl">
                            <span>مشاهده پروفایل</span>
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="glass-effect rounded-3xl p-12 shadow-2xl border border-gray-200/50 max-w-lg mx-auto animate-bounce-in">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                  <span className="text-white text-4xl">📊</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {error ? 'مشکل اتصال به دیتابیس' : 'مشاوری یافت نشد'}
                </h3>
                <p className="text-gray-500 mb-10 text-lg leading-relaxed">
                  {error 
                    ? 'لطفاً اتصال دیتابیس MySQL خود را بررسی کنید و اطمینان حاصل کنید که جداول ایجاد شده‌اند.' 
                    : 'در حال حاضر هیچ مشاوری در دیتابیس موجود نیست.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/api/test-db" 
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-xl btn-glow"
                  >
                    تست اتصال دیتابیس
                  </Link>
                  <Link 
                    href="/api/agents" 
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-xl btn-glow"
                  >
                    بررسی API مشاوران
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="text-center py-20 relative">
          <div className="glass-effect rounded-3xl p-12 shadow-2xl border border-white/20 max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-float">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">آماده برای شروع هستید؟</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                با مشاوران برتر املاک دبی در تماس باشید و بهترین فرصت‌های سرمایه‌گذاری را کشف کنید
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="#agents" 
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 font-bold shadow-xl btn-glow text-lg transform hover:scale-105"
              >
                مشاهده مشاوران
              </Link>
              <Link 
                href="#contact" 
                className="inline-flex items-center px-10 py-5 bg-white text-gray-900 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-xl border-2 border-gray-200 text-lg transform hover:scale-105"
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}