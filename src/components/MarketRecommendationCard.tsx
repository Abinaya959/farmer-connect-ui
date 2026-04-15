import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { getMarketRecommendation, MarketPriceData, SellRecommendation } from '@/lib/aiLogic';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketRecommendationCardProps {
  spoilageRiskLevel?: 'safe' | 'warning' | 'danger';
}

export default function MarketRecommendationCard({ spoilageRiskLevel = 'safe' }: MarketRecommendationCardProps) {
  const { language } = useLanguage();
  const { analysisData } = useSession();
  const [priceData, setPriceData] = useState<MarketPriceData | null>(null);
  const [recommendation, setRecommendation] = useState<SellRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
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
  }, [analysisData?.cropName?.en, spoilageRiskLevel]);

  if (loading) return <Card className="animate-pulse p-4"><div className="h-20 rounded bg-secondary" /></Card>;
  if (!priceData || !recommendation) return null;

  const getTrendIcon = () => {
    switch (recommendation.trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'falling': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-yellow-600" />;
    }
  };

  const displays = {
    sell_now: { bgClass: 'bg-green-50', textClass: 'text-green-700', icon: '🟢', shortLabel: { en: 'Sell Now', ta: 'இப்போதே விற்கவும்' } },
    wait: { bgClass: 'bg-yellow-50', textClass: 'text-yellow-700', icon: '🟡', shortLabel: { en: 'Wait 2-3 days', ta: '2-3 நாள் காத்திருக்கவும்' } },
    sell_immediately: { bgClass: 'bg-red-50', textClass: 'text-red-700', icon: '🔴', shortLabel: { en: 'Sell Immediately', ta: 'உடனடியாக விற்கவும்' } },
  };
  const display = displays[recommendation.decision];

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">💰</span>
        <h3 className="font-semibold">{language === 'ta' ? 'சந்தை பரிந்துரை' : 'Market Recommendation'}</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-muted-foreground">{language === 'ta' ? 'தற்போதைய விலை' : 'Current Price'}</p>
          <p className="text-lg font-bold">₹{priceData.currentPrice}/{priceData.unit}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{language === 'ta' ? 'போக்கு' : 'Trend'}</p>
          <div className="flex justify-center">{getTrendIcon()}</div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{language === 'ta' ? 'ஆலோசனை' : 'Advice'}</p>
          <p className={`text-sm font-semibold ${display.textClass}`}>{display.icon} {display.shortLabel[language]}</p>
        </div>
      </div>
    </Card>
  );
}
