import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';

interface MandiPrice {
  id: string;
  crop_name_en: string;
  crop_name_ta: string;
  current_price_per_kg: number;
  prices_last_7_days: number[] | any;
  unit: string;
  location: string;
  updated_at: string;
}

export default function MarketPrices() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPrices = async () => {
      const { data } = await supabase
        .from('mandi_prices')
        .select('*')
        .order('crop_name_en', { ascending: true });
      if (data) setPrices(data as any);
      setLoading(false);
    };
    fetchPrices();
  }, []);

  const getTrend = (history: number[], current: number) => {
    if (!history || history.length < 2) return 'stable';
    const prev = Number(history[history.length - 2]);
    if (current > prev) return 'up';
    if (current < prev) return 'down';
    return 'stable';
  };

  const getCropEmoji = (name: string) => {
    const map: Record<string, string> = {
      Onion: '🧅', Tomato: '🍅', Potato: '🥔', Banana: '🍌',
      Mango: '🥭', Coconut: '🥥', Cotton: '🌾', 'Rice (Paddy)': '🌾',
      Sugarcane: '🎋', 'Groundnut (Peanut)': '🥜',
    };
    return map[name] || '🌱';
  };

  const filtered = prices.filter((p) => {
    const q = search.toLowerCase();
    return p.crop_name_en.toLowerCase().includes(q) || p.crop_name_ta.includes(search);
  });

  const today = new Date().toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-background">
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/home')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">
              {language === 'ta' ? 'சந்தை விலைகள்' : 'Market Prices'}
            </h1>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {language === 'ta' ? 'தமிழ்நாடு' : 'Tamil Nadu'} • {today}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={language === 'ta' ? 'பயிரைத் தேடவும்...' : 'Search crop...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="h-20 animate-pulse bg-secondary" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            {language === 'ta' ? 'தரவு இல்லை' : 'No data found'}
          </Card>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((p) => {
              const history = Array.isArray(p.prices_last_7_days) ? p.prices_last_7_days as number[] : [];
              const trend = getTrend(history, Number(p.current_price_per_kg));
              const prev = history.length >= 2 ? Number(history[history.length - 2]) : Number(p.current_price_per_kg);
              const diff = Number(p.current_price_per_kg) - prev;
              const pct = prev ? ((diff / prev) * 100).toFixed(1) : '0';

              return (
                <Card key={p.id} className="p-4 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCropEmoji(p.crop_name_en)}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground leading-tight">
                        {language === 'ta' ? p.crop_name_ta : p.crop_name_en}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {language === 'ta' ? p.crop_name_en : p.crop_name_ta}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-700">
                        ₹{p.current_price_per_kg}
                        <span className="text-xs font-normal text-muted-foreground">/{p.unit}</span>
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[11px]">
                        {trend === 'up' && (
                          <span className="flex items-center gap-0.5 text-green-600">
                            <TrendingUp className="h-3 w-3" /> +{pct}%
                          </span>
                        )}
                        {trend === 'down' && (
                          <span className="flex items-center gap-0.5 text-red-600">
                            <TrendingDown className="h-3 w-3" /> {pct}%
                          </span>
                        )}
                        {trend === 'stable' && (
                          <span className="flex items-center gap-0.5 text-muted-foreground">
                            <Minus className="h-3 w-3" /> {language === 'ta' ? 'நிலையான' : 'Stable'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {history.length > 0 && (
                    <div className="mt-3 flex h-8 items-end gap-1">
                      {history.map((price, i) => {
                        const max = Math.max(...history);
                        const min = Math.min(...history);
                        const range = max - min || 1;
                        const h = ((Number(price) - min) / range) * 100;
                        return (
                          <div
                            key={i}
                            className="flex-1 rounded-t bg-emerald-500/60"
                            style={{ height: `${Math.max(15, h)}%` }}
                            title={`₹${price}`}
                          />
                        );
                      })}
                    </div>
                  )}
                  <p className="mt-1 text-[10px] text-muted-foreground text-right">
                    {language === 'ta' ? 'கடந்த 7 நாட்கள்' : 'Last 7 days'}
                  </p>
                </Card>
              );
            })}
          </div>
        )}

        <p className="text-[11px] text-center text-muted-foreground pt-2">
          ⚠️ {language === 'ta'
            ? 'விலைகள் குறிப்பிட்ட தரவுகளின் அடிப்படையில் உள்ளது.'
            : 'Prices are indicative based on simulated data.'}
        </p>
      </main>
    </div>
  );
}
