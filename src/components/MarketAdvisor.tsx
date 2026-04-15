import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { getMarketRecommendation, MarketPriceData, SellRecommendation } from '@/lib/aiLogic';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  spoilageRiskLevel?: 'safe' | 'warning' | 'danger';
}

export default function MarketAdvisor({ isOpen, onClose, spoilageRiskLevel = 'safe' }: MarketAdvisorProps) {
  const { language } = useLanguage();
  const { analysisData } = useSession();
  const [priceData, setPriceData] = useState<MarketPriceData | null>(null);
  const [recommendation, setRecommendation] = useState<SellRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!isOpen) return;
      setLoading(true);
      const cropName = analysisData?.cropName?.en || 'Onion';
      const { data } = await supabase.from('mandi_prices').select('*').eq('crop_name_en', cropName).maybeSingle();

      const processData = (d: any) => {
        const marketData: MarketPriceData = {
          cropNameEn: d.crop_name_en, cropNameTa: d.crop_name_ta,
          currentPrice: Number(d.current_price_per_kg),
          pricesLast7Days: (d.prices_last_7_days as number[]) || [],
          unit: d.unit || 'kg', location: d.location || 'Tamil Nadu',
        };
        setPriceData(marketData);
        setRecommendation(getMarketRecommendation(marketData, spoilageRiskLevel));
      };

      if (data) {
        processData(data);
      } else {
        const { data: fallback } = await supabase.from('mandi_prices').select('*').limit(1).single();
        if (fallback) processData(fallback);
      }
      setLoading(false);
    };
    fetchMarketData();
  }, [isOpen, analysisData?.cropName?.en, spoilageRiskLevel]);

  const getTrendIcon = () => {
    if (!recommendation) return <Minus className="h-5 w-5" />;
    switch (recommendation.trend) {
      case 'increasing': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'falling': return <TrendingDown className="h-5 w-5 text-red-600" />;
      default: return <Minus className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getDisplay = () => {
    if (!recommendation) return null;
    const displays = {
      sell_now: { bgClass: 'bg-green-50', textClass: 'text-green-700', icon: '🟢', label: { en: 'Sell Now – Good Profit Opportunity', ta: 'இப்போதே விற்கவும் – நல்ல லாப வாய்ப்பு' } },
      wait: { bgClass: 'bg-yellow-50', textClass: 'text-yellow-700', icon: '🟡', label: { en: 'Wait 2–3 days – Price likely to increase', ta: '2-3 நாள் காத்திருக்கவும் – விலை உயர வாய்ப்பு' } },
      sell_immediately: { bgClass: 'bg-red-50', textClass: 'text-red-700', icon: '🔴', label: { en: 'Sell Immediately – Price falling / Spoilage risk high', ta: 'உடனடியாக விற்கவும் – விலை குறைகிறது / கெட்டுப்போகும் ஆபத்து' } },
    };
    return displays[recommendation.decision];
  };

  const display = getDisplay();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{language === 'ta' ? 'சந்தை விலை ஆலோசகர்' : 'Market Price Advisor'}</DialogTitle>
          <DialogDescription>{language === 'ta' ? '📊 உருவகப்படுத்தப்பட்ட சந்தை ஆலோசனை' : '📊 Simulated market advisory'}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
        ) : priceData && recommendation ? (
          <div className="space-y-4">
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">{language === 'ta' ? 'தற்போதைய சந்தை விலை' : 'Current Market Price'}</p>
              <p className="text-lg font-semibold">🧺 {language === 'ta' ? priceData.cropNameTa : priceData.cropNameEn}</p>
              <p className="text-3xl font-bold text-primary">₹{priceData.currentPrice}<span className="text-base font-normal text-muted-foreground">/ {priceData.unit}</span></p>
              <p className="text-xs text-muted-foreground">📍 {priceData.location}</p>
            </Card>

            <Card className="p-4">
              <p className="mb-2 text-sm font-semibold">{language === 'ta' ? 'விலை போக்கு (7 நாள்)' : 'Price Trend (7 days)'}</p>
              <div className="flex items-center gap-2">{getTrendIcon()}</div>
              <div className="mt-3 flex h-16 items-end gap-1">
                {priceData.pricesLast7Days.map((price, i) => {
                  const max = Math.max(...priceData.pricesLast7Days);
                  const min = Math.min(...priceData.pricesLast7Days);
                  const range = max - min || 1;
                  const height = ((price - min) / range) * 100;
                  return <div key={i} className="flex-1 rounded-t bg-primary/60" style={{ height: `${Math.max(10, height)}%` }} />;
                })}
              </div>
            </Card>

            {display && (
              <Card className={`p-4 ${display.bgClass}`}>
                <p className="mb-2 text-sm font-semibold">{language === 'ta' ? '🧠 AI விற்பனை பரிந்துரை' : '🧠 AI Sell Recommendation'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{display.icon}</span>
                  <span className={`font-semibold ${display.textClass}`}>{display.label[language]}</span>
                </div>
                {recommendation.reason && (
                  <p className="mt-2 text-sm text-muted-foreground">💡 {recommendation.reason[language]}</p>
                )}
              </Card>
            )}

            <p className="text-xs text-muted-foreground">
              ⚠️ {language === 'ta' ? 'இது உருவகப்படுத்தப்பட்ட ஆலோசனை மட்டுமே.' : 'This is simulated advisory only.'}
            </p>
          </div>
        ) : (
          <p className="py-8 text-center text-muted-foreground">{language === 'ta' ? 'சந்தை தரவு கிடைக்கவில்லை' : 'Market data not available'}</p>
        )}

        <Button variant="outline" onClick={onClose} className="w-full">{language === 'ta' ? 'மூடு' : 'Close'}</Button>
      </DialogContent>
    </Dialog>
  );
}
