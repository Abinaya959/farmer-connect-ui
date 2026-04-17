import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sprout, CloudSun, TrendingUp, HeartHandshake, Globe, Brain,
  ShieldCheck, Languages, Smartphone, ArrowRight, CheckCircle2,
  Star, Users, Sparkles, BarChart3, Leaf, Phone, Mail
} from 'lucide-react';
import heroImage from '@/assets/hero-farming.jpg';
import farmerImage from '@/assets/farmer-tech.jpg';

const features = [
  {
    icon: Brain,
    en: { title: 'AI Crop Guidance', desc: 'Smart crop recommendations tailored to your district, soil, and season' },
    ta: { title: 'AI பயிர் வழிகாட்டுதல்', desc: 'உங்கள் மாவட்டம், மண் மற்றும் பருவத்திற்கு ஏற்ப பயிர் பரிந்துரைகள்' },
    color: 'emerald',
  },
  {
    icon: CloudSun,
    en: { title: 'Weather & Risk Alerts', desc: 'Real-time weather updates and spoilage risk warnings for your stored crops' },
    ta: { title: 'வானிலை & ஆபத்து எச்சரிக்கைகள்', desc: 'நேரடி வானிலை மற்றும் சேமிப்பு பயிர் எச்சரிக்கைகள்' },
    color: 'sky',
  },
  {
    icon: BarChart3,
    en: { title: 'Live Market Prices', desc: 'Daily mandi prices for all Tamil Nadu crops with sell-time recommendations' },
    ta: { title: 'நேரடி சந்தை விலை', desc: 'அனைத்து தமிழ்நாடு பயிர்களுக்கான தினசரி மண்டி விலை' },
    color: 'amber',
  },
  {
    icon: HeartHandshake,
    en: { title: 'Govt Schemes', desc: 'Direct access to subsidies, loans, insurance and cold-storage support' },
    ta: { title: 'அரசு திட்டங்கள்', desc: 'மானியங்கள், கடன், காப்பீடு மற்றும் குளிர்சாதன ஆதரவு' },
    color: 'purple',
  },
  {
    icon: Languages,
    en: { title: 'Tamil + English', desc: 'Use the app in your preferred language with one tap' },
    ta: { title: 'தமிழ் + English', desc: 'உங்கள் விருப்பமான மொழியில் செயலியை பயன்படுத்துங்கள்' },
    color: 'rose',
  },
  {
    icon: ShieldCheck,
    en: { title: 'Cold Storage Help', desc: 'Storage condition checks and post-harvest spoilage prevention' },
    ta: { title: 'குளிர் சேமிப்பு உதவி', desc: 'சேமிப்பு நிலை சோதனை மற்றும் அறுவடைக்குப் பின் பாதுகாப்பு' },
    color: 'blue',
  },
];

const steps = [
  {
    num: '01',
    en: { title: 'Sign Up Free', desc: 'Create your account in under 30 seconds with email and password' },
    ta: { title: 'இலவசமாக பதிவு செய்', desc: 'மின்னஞ்சல் மூலம் 30 விநாடிகளில் கணக்கை உருவாக்கவும்' },
  },
  {
    num: '02',
    en: { title: 'Choose Your Goal', desc: 'Plan a new crop, monitor existing ones, or check market prices' },
    ta: { title: 'உங்கள் இலக்கை தேர்ந்தெடு', desc: 'புதிய பயிர் திட்டமிடல், கண்காணிப்பு அல்லது சந்தை விலை' },
  },
  {
    num: '03',
    en: { title: 'Get AI Insights', desc: 'Receive personalized recommendations and risk predictions instantly' },
    ta: { title: 'AI நுண்ணறிவைப் பெறு', desc: 'தனிப்பட்ட பரிந்துரைகள் & ஆபத்து கணிப்புகளை உடனடியாக பெறவும்' },
  },
  {
    num: '04',
    en: { title: 'Take Action', desc: 'Apply to schemes, sell at right time, prevent crop losses' },
    ta: { title: 'நடவடிக்கை எடு', desc: 'திட்டங்களுக்கு விண்ணப்பிக்கவும், சரியான நேரத்தில் விற்கவும்' },
  },
];

const stats = [
  { value: '10,000+', en: 'Farmers Helped', ta: 'விவசாயிகள் உதவி பெற்றனர்' },
  { value: '38', en: 'Districts Covered', ta: 'மாவட்டங்கள்' },
  { value: '50+', en: 'Crops Supported', ta: 'பயிர் வகைகள்' },
  { value: '24/7', en: 'AI Support', ta: 'AI ஆதரவு' },
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Coimbatore',
    en: 'VIVASAI helped me choose the right crop for my land. My yield increased by 30% this season!',
    ta: 'விவசாய் என் நிலத்திற்கு சரியான பயிரை தேர்வு செய்ய உதவியது. என் விளைச்சல் 30% அதிகரித்தது!',
  },
  {
    name: 'Lakshmi Devi',
    location: 'Madurai',
    en: 'The market price alerts saved my onion harvest. I sold at the best time and got 40% more profit.',
    ta: 'சந்தை விலை எச்சரிக்கைகள் என் வெங்காய அறுவடையை காப்பாற்றியது. சிறந்த நேரத்தில் விற்றேன்.',
  },
  {
    name: 'Murugan S',
    location: 'Thanjavur',
    en: 'Found 3 government schemes I never knew about. The direct apply links made everything easy.',
    ta: 'நான் அறியாத 3 அரசு திட்டங்களை கண்டேன். நேரடி இணைப்புகள் எல்லாவற்றையும் எளிதாக்கின.',
  },
];

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  sky: 'bg-sky-100 text-sky-700',
  amber: 'bg-amber-100 text-amber-700',
  purple: 'bg-purple-100 text-purple-700',
  rose: 'bg-rose-100 text-rose-700',
  blue: 'bg-blue-100 text-blue-700',
};

export default function LandingPage() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const isTA = language === 'ta';

  return (
    <div className="min-h-screen bg-background">
      {/* ============ NAVBAR ============ */}
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-xl shadow-md">
              🌾
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-emerald-900">VIVASAI</h1>
              <p className="text-[10px] leading-none text-muted-foreground">விவசாய் • Smart Farming AI</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-emerald-700">
              {isTA ? 'அம்சங்கள்' : 'Features'}
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-emerald-700">
              {isTA ? 'எப்படி வேலை செய்கிறது' : 'How it Works'}
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-emerald-700">
              {isTA ? 'மதிப்புரைகள்' : 'Reviews'}
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-emerald-700">
              {isTA ? 'தொடர்பு' : 'Contact'}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 sm:flex">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ta' | 'en')}
                className="rounded-md border border-input bg-background px-2 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
            >
              {isTA ? 'உள்நுழைய' : 'Login'}
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/signup')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
            >
              {isTA ? 'பதிவு' : 'Sign Up'}
            </Button>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Tamil Nadu farming fields at golden hour"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-800/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-50/10 px-4 py-1.5 text-xs font-medium text-emerald-100 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {isTA ? 'தமிழ்நாடு விவசாயிகளுக்கான AI' : 'AI Built for Tamil Nadu Farmers'}
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {isTA ? (
                <>
                  புத்திசாலி விவசாயம், <br />
                  <span className="bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">
                    நல்ல வாழ்க்கை.
                  </span>
                </>
              ) : (
                <>
                  Smart Farming, <br />
                  <span className="bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">
                    Better Harvest.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-emerald-50/90 sm:text-xl">
              {isTA
                ? 'AI மூலம் பயிர் கணிப்பு, ஆபத்து மதிப்பீடு, சந்தை விலை மற்றும் அரசு திட்டங்களை ஒரே இடத்தில் பெறுங்கள்.'
                : 'Get AI crop predictions, risk alerts, daily market prices, and government schemes — all in one place.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="h-12 bg-emerald-500 px-6 text-base font-semibold text-white shadow-xl hover:bg-emerald-400"
              >
                {isTA ? 'இலவசமாக தொடங்கு' : 'Get Started Free'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="h-12 border-white/30 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                {isTA ? 'உள்நுழைய' : 'Login'}
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-emerald-100/90">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                {isTA ? '100% இலவசம்' : '100% Free'}
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                {isTA ? 'தமிழ் & English' : 'Tamil & English'}
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                {isTA ? 'மொபைலுக்கு உகந்தது' : 'Mobile Friendly'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-extrabold text-emerald-700 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                {isTA ? s.ta : s.en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              {isTA ? 'எங்கள் அம்சங்கள்' : 'Our Features'}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {isTA ? 'விவசாயத்தை எளிதாக்கும் கருவிகள்' : 'Everything You Need to Farm Smarter'}
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {isTA
                ? 'விதைப்பு முதல் விற்பனை வரை — AI உங்களோடு ஒவ்வொரு படியிலும்.'
                : 'From planting to selling — AI by your side at every step.'}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const c = isTA ? f.ta : f.en;
              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[f.color]}`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100">
                    {isTA ? 'மேலும் அறிய' : 'Learn more'} <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                {isTA ? 'எப்படி வேலை செய்கிறது' : 'How It Works'}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {isTA ? '4 எளிய படிகளில் தொடங்குங்கள்' : 'Get Started in 4 Simple Steps'}
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                {isTA
                  ? 'பதிவு செய்து, விரிவான AI நுண்ணறிவை உடனடியாக பெறுங்கள். எந்த தொழில்நுட்ப அறிவும் தேவையில்லை.'
                  : 'Sign up and start receiving powerful AI insights instantly. No technical knowledge required.'}
              </p>

              <div className="mt-8 space-y-5">
                {steps.map((s, i) => {
                  const c = isTA ? s.ta : s.en;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white shadow-lg">
                        {s.num}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{c.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-2xl bg-amber-200/60" />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-2xl bg-emerald-200/60" />
              <img
                src={farmerImage}
                alt="Tamil farmer using smart agriculture app"
                loading="lazy"
                width={1024}
                height={1024}
                className="relative rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-xl bg-white p-4 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <Leaf className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">+30% {isTA ? 'விளைச்சல்' : 'Yield'}</p>
                  <p className="text-xs text-muted-foreground">{isTA ? 'சராசரி அதிகரிப்பு' : 'Average increase'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              {isTA ? 'விவசாயிகள் சொல்வது' : 'Trusted by Farmers'}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {isTA ? 'எங்கள் விவசாயிகள் என்ன சொல்கிறார்கள்' : 'What Our Farmers Say'}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  "{isTA ? t.ta : t.en}"
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-emerald-100 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-sm font-bold text-emerald-800">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">📍 {t.location}, Tamil Nadu</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Sprout className="mx-auto h-12 w-12 text-emerald-200" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {isTA ? 'இன்றே உங்கள் விவசாய பயணத்தை தொடங்குங்கள்' : 'Start Your Smart Farming Journey Today'}
          </h2>
          <p className="mt-4 text-lg text-emerald-100">
            {isTA
              ? 'ஆயிரக்கணக்கான விவசாயிகளோடு சேருங்கள். இலவசம், வேகம், எளிமை.'
              : 'Join thousands of farmers. Free, fast, and easy to use.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="h-12 bg-white px-8 text-base font-semibold text-emerald-700 shadow-xl hover:bg-emerald-50"
            >
              {isTA ? 'இலவசமாக பதிவு செய்' : 'Sign Up Free'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="h-12 border-white/40 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              {isTA ? 'உள்நுழைய' : 'Login'}
            </Button>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer id="contact" className="border-t border-emerald-100 bg-emerald-950 py-12 text-emerald-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-xl">🌾</div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">VIVASAI</h3>
                  <p className="text-[10px] leading-none text-emerald-300">Smart Farming AI</p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm text-emerald-200/80">
                {isTA
                  ? 'தமிழ்நாடு விவசாயிகளை AI மூலம் மேம்படுத்துகிறோம். பயிர் கணிப்பு முதல் சந்தை விற்பனை வரை.'
                  : 'Empowering Tamil Nadu farmers with AI. From crop prediction to market sales — we cover it all.'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                {isTA ? 'விரைவு இணைப்புகள்' : 'Quick Links'}
              </h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#features" className="text-emerald-200 hover:text-white">{isTA ? 'அம்சங்கள்' : 'Features'}</a></li>
                <li><a href="#how-it-works" className="text-emerald-200 hover:text-white">{isTA ? 'எப்படி வேலை செய்கிறது' : 'How it Works'}</a></li>
                <li><a href="#testimonials" className="text-emerald-200 hover:text-white">{isTA ? 'மதிப்புரைகள்' : 'Reviews'}</a></li>
                <li>
                  <button onClick={() => navigate('/signup')} className="text-emerald-200 hover:text-white">
                    {isTA ? 'பதிவு செய்' : 'Sign Up'}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                {isTA ? 'தொடர்பு' : 'Contact'}
              </h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2 text-emerald-200">
                  <Mail className="h-4 w-4" /> support@vivasai.com
                </li>
                <li className="flex items-center gap-2 text-emerald-200">
                  <Phone className="h-4 w-4" /> 1800-XXX-XXXX
                </li>
                <li className="flex items-center gap-2 text-emerald-200">
                  <Smartphone className="h-4 w-4" /> {isTA ? 'மொபைல் செயலி விரைவில்' : 'Mobile app coming soon'}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-emerald-800 pt-6 text-center text-xs text-emerald-300">
            © {new Date().getFullYear()} VIVASAI • {isTA ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை' : 'All rights reserved'} • {isTA ? 'அன்புடன் தமிழ்நாட்டில் கட்டப்பட்டது' : 'Built with ❤️ in Tamil Nadu'}
          </div>
        </div>
      </footer>
    </div>
  );
}
