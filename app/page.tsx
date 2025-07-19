import { getAllAgents } from "@/lib/data"
import Link from "next/link"
import ClientOnly from "@/components/ClientOnly"
import ImageWithFallback from "@/components/ImageWithFallback"
import { getImagePath, getInitials } from "@/lib/utils/imageUtils"
import { Search, Star, MapPin, Phone, Instagram, ArrowLeft, Award, Users, Building, TrendingUp, Crown, Sparkles } from "lucide-react"

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
    <div className="min-h-screen luxury-bg relative" dir="rtl">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-slate-100/40 to-slate-200/40 rounded-full blur-3xl animate-luxury-float"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-blue-50/60 to-indigo-50/60 rounded-full blur-3xl animate-luxury-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Minimal Header */}
      <header className="relative z-50 border-b minimal-border bg-white/80 backdrop-blur-xl">
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
                <p className="text-sm text-slate-500 luxury-text">املاک لوکس و منحصر به فرد</p>
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
                href="/api/test-db" 
                className="text-slate-500 hover:text-slate-700 transition-colors luxury-text"
              >
                سیستم
              </Link>
              <button className="luxury-button px-6 py-3 rounded-xl luxury-text font-medium">
                تماس با ما
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Hero Section */}
        <section className="luxury-section text-center">
          <div className="max-w-4xl mx-auto animate-slide-up">
            {/* Premium Badge */}
            <div className="inline-flex items-center space-x-3 space-x-reverse bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full minimal-border mb-8">
              <div className="w-2 h-2 status-premium rounded-full"></div>
              <span className="text-slate-600 luxury-text font-medium">بهترین مشاوران املاک دبی</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl luxury-heading text-luxury mb-8 leading-tight">
              املاک لوکس
              <br />
              <span className="text-gold">دبی</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed luxury-text mb-12">
              با متخصصان برتر املاک دبی ارتباط برقرار کنید و در پویاترین بازار املاک جهان سرمایه‌گذاری کنید
            </p>

            {/* Elegant Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center animate-scale-in" style={{animationDelay: '0.1s'}}>
                <div className="text-3xl luxury-heading text-luxury mb-2">{agents?.length || 0}+</div>
                <div className="text-slate-500 luxury-text">مشاور متخصص</div>
              </div>
              
              <div className="text-center animate-scale-in" style={{animationDelay: '0.2s'}}>
                <div className="text-3xl luxury-heading text-luxury mb-2">500+</div>
                <div className="text-slate-500 luxury-text">املاک فروخته شده</div>
              </div>
              
              <div className="text-center animate-scale-in" style={{animationDelay: '0.3s'}}>
                <div className="text-3xl luxury-heading text-luxury mb-2">98%</div>
                <div className="text-slate-500 luxury-text">رضایت مشتریان</div>
              </div>
              
              <div className="text-center animate-scale-in" style={{animationDelay: '0.4s'}}>
                <div className="text-3xl luxury-heading text-luxury mb-2">5.0</div>
                <div className="text-slate-500 luxury-text">امتیاز متوسط</div>
              </div>
            </div>
          </div>
        </section>

        {/* Debug Info - Development Only */}
        {process.env.NODE_ENV === 'development' && (
          <ClientOnly>
            <div className="mb-16">
              <div className="luxury-card rounded-2xl p-8 luxury-shadow">
                <h3 className="text-xl luxury-heading text-luxury mb-6">وضعیت سیستم</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50/50 rounded-xl p-6 minimal-border">
                    <p className="luxury-text font-medium text-slate-700 mb-2">وضعیت دیتابیس</p>
                    <p className={`luxury-text font-semibold ${error ? 'text-red-600' : 'text-emerald-600'}`}>
                      {error ? 'قطع شده' : 'متصل'}
                    </p>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-6 minimal-border">
                    <p className="luxury-text font-medium text-slate-700 mb-2">مشاوران یافت شده</p>
                    <p className="text-slate-900 luxury-text font-semibold">{agents?.length || 0} مشاور</p>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-6 minimal-border">
                    <p className="luxury-text font-medium text-slate-700 mb-2">سیستم</p>
                    <p className="text-emerald-600 luxury-text font-semibold">MySQL + Next.js</p>
                  </div>
                </div>
                {error && (
                  <div className="mt-6 p-6 bg-red-50 rounded-xl minimal-border">
                    <p className="text-red-800 luxury-text">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </ClientOnly>
        )}

        {/* Agents Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl luxury-heading text-luxury mb-4">مشاوران برتر</h2>
            <p className="text-xl text-slate-600 luxury-text">متخصصان املاک لوکس دبی</p>
          </div>

          {/* Agent Cards Grid */}
          {agents && agents.length > 0 ? (
            <div className="property-grid">
              {agents.map((agent, index) => (
                <Link key={agent.id} href={`/agents/${agent.id}`}>
                  <div className="property-card luxury-card rounded-2xl overflow-hidden luxury-shadow elegant-hover animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="property-card-content">
                      {/* Agent Header */}
                      <div className="p-8 text-center">
                        <div className="relative mx-auto mb-6 w-24 h-24">
                          <div className="w-full h-full luxury-gradient rounded-2xl flex items-center justify-center luxury-shadow-lg relative overflow-hidden">
                            {agent.profileImage ? (
                              <ImageWithFallback
                                src={getImagePath(agent.profileImage)}
                                alt={agent.name || "Agent"}
                                fill
                                className="object-cover"
                                fallbackSrc="/placeholder-user.jpg"
                              />
                            ) : (
                              <span className="text-white luxury-text font-semibold text-xl">
                                {getInitials(agent.name || "Agent")}
                              </span>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 status-online rounded-full border-2 border-white"></div>
                        </div>

                        <h3 className="text-xl luxury-heading text-luxury mb-2">
                          {agent.name || 'مشاور ناشناس'}
                        </h3>
                        
                        <div className="flex items-center justify-center space-x-2 space-x-reverse text-slate-500 mb-4">
                          <MapPin className="w-4 h-4" />
                          <span className="luxury-text text-sm">{agent.address || 'دبی، امارات'}</span>
                        </div>

                        <div className="flex items-center justify-center space-x-1 space-x-reverse mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-slate-500 mr-2 luxury-text">(4.9)</span>
                        </div>
                      </div>

                      {/* Bio Preview */}
                      {agent.bio && (
                        <div className="px-8 pb-6">
                          <p className="text-slate-600 text-center luxury-text leading-relaxed line-clamp-3">
                            {agent.bio}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="property-card-footer p-8 pt-0">
                      <div className="space-y-4">
                        {agent.instagram && (
                          <div className="flex items-center justify-center space-x-2 space-x-reverse text-slate-500">
                            <Instagram className="w-4 h-4" />
                            <span className="luxury-text text-sm">@{agent.instagram}</span>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <div className="inline-flex items-center space-x-2 space-x-reverse text-slate-700 luxury-text font-medium bg-slate-50 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <span>مشاهده پروفایل</span>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="luxury-card rounded-2xl p-12 luxury-shadow max-w-lg mx-auto">
                <div className="w-16 h-16 luxury-gradient rounded-2xl mx-auto mb-8 flex items-center justify-center">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl luxury-heading text-luxury mb-6">
                  {error ? 'مشکل اتصال به دیتابیس' : 'مشاوری یافت نشد'}
                </h3>
                <p className="text-slate-600 mb-10 luxury-text leading-relaxed">
                  {error 
                    ? 'لطفاً اتصال دیتابیس MySQL خود را بررسی کنید.' 
                    : 'در حال حاضر هیچ مشاوری در دیتابیس موجود نیست.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/api/test-db" 
                    className="luxury-button px-6 py-3 rounded-xl luxury-text font-medium"
                  >
                    تست اتصال دیتابیس
                  </Link>
                  <Link 
                    href="/api/agents" 
                    className="luxury-button px-6 py-3 rounded-xl luxury-text font-medium"
                  >
                    بررسی API
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="text-center py-20">
          <div className="luxury-card rounded-2xl p-12 luxury-shadow max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="w-16 h-16 gold-accent rounded-2xl mx-auto mb-6 flex items-center justify-center luxury-shadow">
                <Sparkles className="w-8 h-8 text-slate-800" />
              </div>
              <h2 className="text-3xl luxury-heading text-luxury mb-4">آماده برای شروع؟</h2>
              <p className="text-xl text-slate-600 luxury-text leading-relaxed">
                با مشاوران برتر املاک دبی در تماس باشید
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="gold-button px-8 py-4 rounded-xl luxury-text font-medium">
                مشاهده مشاوران
              </button>
              <button className="luxury-button px-8 py-4 rounded-xl luxury-text font-medium">
                تماس با ما
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <div className="border-t minimal-border bg-white/60 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-8 py-8 text-center">
          <p className="text-slate-500 luxury-text">
            © ۲۰۲۴ دبی الیت. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </div>
  )
}