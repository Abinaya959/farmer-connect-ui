import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { calculateSpoilageRisk, CropData, RiskResult } from '@/lib/aiLogic';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function RiskPrediction() {
  const { t, language } = useLanguage();
  const { analysisData, updateAnalysisSession } = useSession();
  const navigate = useNavigate();

  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [cropData, setCropData] = useState<CropData | null>(null);

  useEffect(() => {
    const analyzeRisk = async () => {
      if (!analysisData?.cropId) return;
      const { data: crop } = await supabase.from('crops').select('*').eq('id', analysisData.cropId).single();
      if (!crop) return;
      setCropData(crop as any);
      const result = calculateSpoilageRisk(crop as any, analysisData.temperature || 20, analysisData.humidity || 70, analysisData.storageDays || 5);
      setRiskResult(result);
      await updateAnalysisSession({
        riskLevel: result.level,
        riskScore: result.score,
        spoilageHours: result.spoilageHours,
        riskReasons: result.reasons.map(r => language === 'ta' ? r.ta : r.en),
        recommendations: result.recommendations.map(r => language === 'ta' ? r.ta : r.en),
      });
    };
    analyzeRisk();
  }, [analysisData?.cropId]);

  const getRiskDisplay = () => {
    if (!riskResult) return null;
    switch (riskResult.level) {
      case 'safe': return { icon: <CheckCircle className="h-16 w-16 text-green-600" />, bgClass: 'bg-green-50 border-green-200', textClass: 'text-green-700', label: t('risk.safe') };
      case 'warning': return { icon: <AlertTriangle className="h-16 w-16 text-yellow-600" />, bgClass: 'bg-yellow-50 border-yellow-200', textClass: 'text-yellow-700', label: t('risk.warning') };
      case 'danger': return { icon: <XCircle className="h-16 w-16 text-red-600" />, bgClass: 'bg-red-50 border-red-200', textClass: 'text-red-700', label: t('risk.danger') };
    }
  };

  const formatTimeRemaining = (hours: number) => {
    if (hours >= 48) return `${Math.floor(hours / 24)} ${t('risk.days')}`;
    return `${hours} ${t('risk.hours')}`;
  };

  if (!riskResult || !cropData) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  const riskDisplay = getRiskDisplay()!;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cold-storage')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t('risk.title')}</h1>
            <p className="text-sm text-muted-foreground">{language === 'ta' ? cropData.name_ta : cropData.name_en}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 py-6">
        <Card className={`border-2 p-6 text-center ${riskDisplay.bgClass}`}>
          <div className="mx-auto mb-3 flex justify-center">{riskDisplay.icon}</div>
          <h2 className={`text-2xl font-bold ${riskDisplay.textClass}`}>{riskDisplay.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Risk Score: {riskResult.score}%</p>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-sm text-muted-foreground">{t('risk.timeRemaining')}</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{formatTimeRemaining(riskResult.spoilageHours)}</p>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 font-semibold">Summary</h3>
          {riskResult.reasons.map((reason, index) => (
            <p key={index} className="mb-2 text-sm text-muted-foreground">• {language === 'ta' ? reason.ta : reason.en}</p>
          ))}
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-14" onClick={() => navigate('/explainability')}>{t('risk.whyResult')}</Button>
          <Button className="h-14" onClick={() => navigate('/actions')}>{t('risk.recommendations')}</Button>
        </div>
      </main>
    </div>
  );
}
