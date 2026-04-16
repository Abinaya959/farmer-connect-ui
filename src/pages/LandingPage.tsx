import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, CloudSun, TrendingUp, HeartHandshake, Globe } from 'lucide-react';

const features = [
  {
    icon: Sprout,
    en: { title: 'Crop Guidance', desc: 'AI-powered crop recommendations based on your district and season' },
    ta: { title: 'பயிர் வழிகாட்டுதல்', desc: 'உங்கள் மாவட்டம் மற்றும் பருவத்தின் அடிப்படையில் AI பயிர் பரிந்துரைகள்' },
  },
  {
    icon: CloudSun,
    en: { title: 'Weather Updates', desc: 'Real-time weather and spoilage risk alerts for your stored crops' },
    ta: { title: 'வானிலை புதுப்பிப்புகள்', desc: 'உங்கள் சேமிக்கப்பட்ட பயிர்களுக்கான நேரடி வானிலை மற்றும் அழிவு எச்சரிக்கைகள்' },
  },
  {
    icon: TrendingUp,
    en: { title: 'Market Prices', desc: 'Latest mandi prices and best time-to-sell recommendations' },
    ta: { title: 'சந்தை விலைகள்', desc: 'சமீபத்திய சந்தை விலைகள் மற்றும் சிறந்த விற்பனை நேர பரிந்துரைகள்' },
  },
  {
    icon: HeartHandshake,
    en: { title: 'Farmer Support', desc: 'Government schemes, subsidies, and cold storage guidance' },
    ta: { title: 'விவசாயி ஆதரவு', desc: 'அரசு திட்டங்கள், மானியங்கள் மற்றும் குளிர்சாதன வழிகாட்டுதல்' },
  },
];

export default function LandingPage() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const isTA = language === 'ta';

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar with language selector */}
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-lg font-bold text-foreground">VIVASAI</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'ta' | 'en')}
              className="rounded-md border border-input bg-background px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Hero */}
        <section className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-5xl text-primary-foreground shadow-lg">
            🌾
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            VIVASAI <span className="text-primary">விவசாய்</span>
          </h1>
          <p className="mt-2 text-lg font-medium text-primary">
            {isTA ? 'புத்திசாலி விவசாயத்திற்கான AI உதவியாளர்' : 'AI Assistant for Smart Farming'}
          </p>
          <p className="mt-3 text-muted-foreground">
            {isTA
              ? 'தமிழ்நாடு விவசாயிகளுக்கு பயிர் திட்டமிடல், ஆபத்து மதிப்பீடு மற்றும் சந்தை நுண்ணறிவு.'
              : 'Crop planning, risk assessment, and market intelligence for Tamil Nadu farmers.'}
          </p>
        </section>

        {/* Features */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => {
            const content = isTA ? f.ta : f.en;
            return (
              <div
                key={i}
                className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground">{content.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{content.desc}</p>
              </div>
            );
          })}
        </section>

        {/* CTA Buttons */}
        <section className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => navigate('/login')}
            className="h-14 text-lg sm:min-w-[180px]"
            size="lg"
          >
            {isTA ? 'உள்நுழைய' : 'Login'}
          </Button>
          <Button
            onClick={() => navigate('/signup')}
            variant="outline"
            className="h-14 text-lg sm:min-w-[180px]"
            size="lg"
          >
            {isTA ? 'கணக்கை உருவாக்கு' : 'Sign Up'}
          </Button>
        </section>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          🌱 {isTA ? 'AI மூலம் தமிழ்நாடு விவசாயிகளை மேம்படுத்துதல்' : 'Empowering Tamil Nadu farmers with AI'}
        </p>
      </main>
    </div>
  );
}
