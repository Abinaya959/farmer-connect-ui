import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sprout, Package, Landmark, Globe } from 'lucide-react';

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'ta' ? 'en' : 'ta');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <h1 className="text-lg font-bold text-foreground">{t('app.title')}</h1>
            <span className="text-xs text-muted-foreground">விவசாய்</span>
          </div>
          <Button variant="outline" size="sm" onClick={toggleLanguage} className="gap-1">
            <Globe className="h-4 w-4" />
            {language === 'ta' ? 'EN' : 'த'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{t('home.welcome')}</h2>
          <p className="mt-1 text-muted-foreground">{t('home.question')}</p>
        </div>

        {/* Main Action Cards */}
        <div className="space-y-4">
          {/* Start From Scratch */}
          <Card
            className="cursor-pointer border-2 p-5 transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
            onClick={() => navigate('/start-fresh')}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{t('home.startFresh')}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t('home.startFreshDesc')}</p>
              </div>
              <span className="text-xl text-muted-foreground">→</span>
            </div>
          </Card>

          {/* Existing Crop */}
          <Card
            className="cursor-pointer border-2 p-5 transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
            onClick={() => navigate('/existing-crop')}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                <Package className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{t('home.existingCrop')}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t('home.existingCropDesc')}</p>
              </div>
              <span className="text-xl text-muted-foreground">→</span>
            </div>
          </Card>

          {/* Quick Actions */}
          <Button
            variant="outline"
            className="h-14 w-full gap-2 text-base"
            onClick={() => navigate('/schemes')}
          >
            <Landmark className="h-5 w-5" />
            {t('home.schemes')}
          </Button>
        </div>
      </main>
    </div>
  );
}
