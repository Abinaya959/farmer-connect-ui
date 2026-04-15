import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share, RotateCcw, Home, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import MarketRecommendationCard from '@/components/MarketRecommendationCard';

export default function Summary() {
  const { t, language } = useLanguage();
  const { analysisData, resetSession } = useSession();
  const navigate = useNavigate();

  const handleShare = async () => {
    const shareText = language === 'ta'
      ? `🌾 விவசாய் பகுப்பாய்வு\n\nபயிர்: ${analysisData?.cropName?.ta}\nநிலை: ${analysisData?.riskLevel === 'safe' ? '✅ பாதுகாப்பு' : analysisData?.riskLevel === 'warning' ? '⚠️ எச்சரிக்கை' : '🚨 ஆபத்து'}\n\n#VIVASAI`
      : `🌾 VIVASAI Analysis\n\nCrop: ${analysisData?.cropName?.en}\nStatus: ${analysisData?.riskLevel === 'safe' ? '✅ Safe' : analysisData?.riskLevel === 'warning' ? '⚠️ Warning' : '🚨 Danger'}\n\n#VIVASAI`;

    if (navigator.share) {
      try { await navigator.share({ title: 'VIVASAI', text: shareText }); } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success(language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied to clipboard!');
    }
  };

  const handleNewAnalysis = () => { resetSession(); navigate('/existing-crop'); };
  const handleGoHome = () => { resetSession(); navigate('/home'); };

  const getRiskDisplay = () => {
    switch (analysisData?.riskLevel) {
      case 'safe': return { icon: <CheckCircle className="h-8 w-8 text-green-600" />, bgClass: 'bg-green-50', textClass: 'text-green-700', label: t('risk.safe') };
      case 'warning': return { icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />, bgClass: 'bg-yellow-50', textClass: 'text-yellow-700', label: t('risk.warning') };
      case 'danger': return { icon: <XCircle className="h-8 w-8 text-red-600" />, bgClass: 'bg-red-50', textClass: 'text-red-700', label: t('risk.danger') };
      default: return { icon: <CheckCircle className="h-8 w-8 text-primary" />, bgClass: 'bg-primary/10', textClass: 'text-primary', label: 'Ready' };
    }
  };

  const riskDisplay = getRiskDisplay();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-lg px-4 py-3">
          <h1 className="text-lg font-bold text-foreground">{t('summary.title')}</h1>
          <p className="text-sm text-muted-foreground">📋 {language === 'ta' ? 'அதிகாரிகளுக்கு காட்ட தயார்' : 'Ready to show officers'}</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>🌾</span><span className="font-bold text-foreground">VIVASAI</span><span>விவசாய்</span>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('summary.crop')}</p>
            <h2 className="text-2xl font-bold">{language === 'ta' ? analysisData?.cropName?.ta : analysisData?.cropName?.en}</h2>
            <p className="text-sm text-muted-foreground">{language === 'en' ? analysisData?.cropName?.ta : analysisData?.cropName?.en}</p>
          </div>

          <div className={`mx-auto mt-4 flex items-center justify-center gap-2 rounded-xl p-3 ${riskDisplay.bgClass}`}>
            {riskDisplay.icon}
            <span className={`text-lg font-bold ${riskDisplay.textClass}`}>{riskDisplay.label}</span>
          </div>

          {(analysisData?.temperature || analysisData?.humidity) && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {analysisData?.temperature && (
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{language === 'ta' ? 'வெப்பநிலை' : 'Temperature'}</p>
                  <p className="text-lg font-bold">{analysisData.temperature}°C</p>
                </div>
              )}
              {analysisData?.humidity && (
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{language === 'ta' ? 'ஈரப்பதம்' : 'Humidity'}</p>
                  <p className="text-lg font-bold">{analysisData.humidity}%</p>
                </div>
              )}
            </div>
          )}

          {analysisData?.recommendations && analysisData.recommendations.length > 0 && (
            <div className="mt-4 rounded-lg bg-primary/5 p-3">
              <p className="text-xs font-semibold text-foreground">{t('summary.action')}:</p>
              <p className="mt-1 text-sm text-muted-foreground">💡 {analysisData.recommendations[0]}</p>
            </div>
          )}

          {analysisData?.spoilageHours && (
            <div className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">{t('summary.timeWindow')}</p>
              <p className="text-lg font-bold text-foreground">
                {analysisData.spoilageHours >= 48
                  ? `${Math.floor(analysisData.spoilageHours / 24)} ${t('risk.days')}`
                  : `${analysisData.spoilageHours} ${t('risk.hours')}`}
              </p>
            </div>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {new Date().toLocaleString(language === 'ta' ? 'ta-IN' : 'en-IN')}
          </p>
        </Card>

        <MarketRecommendationCard spoilageRiskLevel={analysisData?.riskLevel} />

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleShare} className="gap-1"><Share className="h-4 w-4" />{t('summary.share')}</Button>
          <Button variant="outline" onClick={() => window.print()}>Print</Button>
        </div>

        <Button variant="outline" onClick={handleNewAnalysis} className="h-12 w-full gap-2"><RotateCcw className="h-4 w-4" />{t('summary.newAnalysis')}</Button>
        <Button onClick={handleGoHome} className="h-12 w-full gap-2"><Home className="h-4 w-4" />{t('summary.home')}</Button>
      </main>
    </div>
  );
}
