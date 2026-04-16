import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  Sprout, Package, Landmark, Globe, Brain, ShieldCheck,
  TrendingUp, ExternalLink, ChevronRight, Snowflake, Zap
} from 'lucide-react';

interface Scheme {
  id: string;
  name_en: string;
  name_ta: string;
  scheme_type: string;
  description_en: string;
  description_ta: string;
  benefits_en: string;
  benefits_ta: string;
  apply_link: string | null;
  cold_storage_support: boolean;
}

const schemeTypeIcons: Record<string, string> = {
  subsidy: '💰',
  loan: '🏦',
  insurance: '🛡️',
  support: '🤝',
};

const schemeTypeBg: Record<string, string> = {
  subsidy: 'bg-emerald-50 border-emerald-200',
  loan: 'bg-blue-50 border-blue-200',
  insurance: 'bg-purple-50 border-purple-200',
  support: 'bg-amber-50 border-amber-200',
};

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  const toggleLanguage = () => {
    setLanguage(language === 'ta' ? 'en' : 'ta');
  };

  useEffect(() => {
    const fetchSchemes = async () => {
      const { data } = await supabase
        .from('schemes')
        .select('id,name_en,name_ta,scheme_type,description_en,description_ta,benefits_en,benefits_ta,apply_link,cold_storage_support')
        .eq('is_active', true)
        .order('cold_storage_support', { ascending: false })
        .limit(6);
      if (data) setSchemes(data as any);
    };
    fetchSchemes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <div>
              <h1 className="text-lg font-bold text-foreground">{t('app.title')}</h1>
              <p className="text-[10px] text-muted-foreground leading-none">Smart Farming AI</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={toggleLanguage} className="gap-1 rounded-full">
            <Globe className="h-4 w-4" />
            {language === 'ta' ? 'EN' : 'த'}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-5 space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-white shadow-lg">
          <h2 className="text-xl font-bold">{t('home.welcome')}</h2>
          <p className="mt-1 text-sm text-emerald-100">{t('home.question')}</p>
        </div>

        {/* Hero Cards - Crop Prediction & Schemes */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="cursor-pointer border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => navigate('/start-fresh')}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                <Brain className="h-7 w-7 text-emerald-700" />
              </div>
              <h3 className="text-sm font-bold text-foreground leading-tight">{t('home.cropPrediction')}</h3>
              <p className="text-[11px] text-muted-foreground leading-tight">{t('home.cropPredictionDesc')}</p>
            </div>
          </Card>

          <Card
            className="cursor-pointer border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => navigate('/schemes')}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
                <Landmark className="h-7 w-7 text-amber-700" />
              </div>
              <h3 className="text-sm font-bold text-foreground leading-tight">{t('home.govSchemes')}</h3>
              <p className="text-[11px] text-muted-foreground leading-tight">{t('home.govSchemesDesc')}</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions Row */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t('home.quickActions')}</h3>
          <div className="grid grid-cols-3 gap-2">
            <Card
              className="cursor-pointer p-3 text-center transition-all hover:shadow-md active:scale-[0.97]"
              onClick={() => navigate('/existing-crop')}
            >
              <Package className="mx-auto h-6 w-6 text-blue-600 mb-1" />
              <p className="text-[11px] font-medium text-foreground leading-tight">{t('home.existingCrop')}</p>
            </Card>
            <Card
              className="cursor-pointer p-3 text-center transition-all hover:shadow-md active:scale-[0.97]"
              onClick={() => navigate('/existing-crop')}
            >
              <ShieldCheck className="mx-auto h-6 w-6 text-red-500 mb-1" />
              <p className="text-[11px] font-medium text-foreground leading-tight">{t('home.riskCheck')}</p>
            </Card>
            <Card
              className="cursor-pointer p-3 text-center transition-all hover:shadow-md active:scale-[0.97]"
              onClick={() => navigate('/schemes')}
            >
              <TrendingUp className="mx-auto h-6 w-6 text-emerald-600 mb-1" />
              <p className="text-[11px] font-medium text-foreground leading-tight">{t('home.marketPrices')}</p>
            </Card>
          </div>
        </div>

        {/* Top Government Schemes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-foreground">{t('home.topSchemes')}</h3>
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-emerald-700" onClick={() => navigate('/schemes')}>
              {t('home.viewAll')} <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-2.5">
            {schemes.map((scheme) => (
              <Card
                key={scheme.id}
                className={`p-4 border transition-all hover:shadow-md ${schemeTypeBg[scheme.scheme_type] || 'bg-card'}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{schemeTypeIcons[scheme.scheme_type] || '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-foreground leading-tight">
                          {language === 'ta' ? scheme.name_ta : scheme.name_en}
                        </h4>
                        {scheme.cold_storage_support && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 mt-0.5">
                            <Snowflake className="h-3 w-3" /> Cold Storage
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {language === 'ta' ? scheme.benefits_ta : scheme.benefits_en}
                    </p>
                    {scheme.apply_link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1.5 h-7 px-2 text-xs gap-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(scheme.apply_link!, '_blank');
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t('schemes.apply')}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
