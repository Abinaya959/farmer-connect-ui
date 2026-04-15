import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { calculateSpoilageRisk, CropData, RiskResult } from '@/lib/aiLogic';
import { ArrowLeft, Snowflake, Wind, Truck, Factory, Phone, TrendingUp } from 'lucide-react';
import MarketAdvisor from '@/components/MarketAdvisor';

const actionIcons: Record<string, React.ReactNode> = {
  '❄️': <Snowflake className="h-6 w-6" />,
  '💨': <Wind className="h-6 w-6" />,
  '🚚': <Truck className="h-6 w-6" />,
  '🏭': <Factory className="h-6 w-6" />,
  '📞': <Phone className="h-6 w-6" />,
};

export default function Actions() {
  const { t, language } = useLanguage();
  const { analysisData } = useSession();
  const navigate = useNavigate();

  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [showMarketAdvisor, setShowMarketAdvisor] = useState(false);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      if (!analysisData?.cropId) return;
      const { data: crop } = await supabase.from('crops').select('*').eq('id', analysisData.cropId).single();
      if (!crop) return;
      const result = calculateSpoilageRisk(crop as any, analysisData.temperature || 20, analysisData.humidity || 70, analysisData.storageDays || 5);
      setRiskResult(result);
    };
    fetchAndAnalyze();
  }, [analysisData]);

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">{t('actions.doFirst')}</span>;
      case 'medium': return <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">{t('actions.canWait')}</span>;
      default: return null;
    }
  };

  if (!riskResult) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/risk-prediction')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t('actions.title')}</h1>
            <p className="text-sm text-muted-foreground">💡 Prioritized for you</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
        {riskResult.recommendations.map((rec, index) => (
          <Card key={index} className="flex items-start gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {actionIcons[rec.icon] || <TrendingUp className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              {getPriorityBadge(rec.priority)}
              <p className="mt-1 text-sm text-foreground">{language === 'ta' ? rec.ta : rec.en}</p>
            </div>
          </Card>
        ))}

        <Card className="cursor-pointer p-4 transition-all hover:border-primary" onClick={() => setShowMarketAdvisor(true)}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <span className="font-semibold text-foreground">{language === 'ta' ? 'சந்தை' : 'Market'}</span>
              <p className="text-sm text-muted-foreground">
                {language === 'ta' ? 'சந்தை விலை & சிறந்த விற்பனை நேரத்தை சரிபார்க்கவும்' : 'Check Market Price & Best Time to Sell'}
              </p>
            </div>
          </div>
        </Card>

        <Button className="h-14 w-full text-lg" onClick={() => navigate('/summary')}>{t('actions.viewSummary')}</Button>

        <MarketAdvisor isOpen={showMarketAdvisor} onClose={() => setShowMarketAdvisor(false)} spoilageRiskLevel={riskResult?.level} />
      </main>
    </div>
  );
}
