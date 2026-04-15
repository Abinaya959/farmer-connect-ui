import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { getCropRecommendations, CropData, CropRecommendation } from '@/lib/aiLogic';
import { ArrowLeft, Minus, Plus, Loader2 } from 'lucide-react';

interface District {
  id: string;
  name_en: string;
  name_ta: string;
  climate_zone: string;
}

export default function StartFromScratch() {
  const { t, language } = useLanguage();
  const { createAnalysisSession, setAnalysisData } = useSession();
  const navigate = useNavigate();

  const [districts, setDistricts] = useState<District[]>([]);
  const [crops, setCrops] = useState<CropData[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [landSize, setLandSize] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [districtsRes, cropsRes] = await Promise.all([
        supabase.from('districts').select('*').order('name_en'),
        supabase.from('crops').select('*'),
      ]);
      if (districtsRes.data) setDistricts(districtsRes.data as any);
      if (cropsRes.data) setCrops(cropsRes.data as any);
    };
    fetchData();
  }, []);

  const seasons = [
    { value: 'kharif', label: t('season.kharif') },
    { value: 'rabi', label: t('season.rabi') },
    { value: 'summer', label: t('season.summer') },
    { value: 'zaid', label: t('season.zaid') },
  ];

  const handleGetRecommendation = async () => {
    if (!selectedDistrict || !selectedSeason) return;
    setLoading(true);
    const district = districts.find(d => d.id === selectedDistrict);
    const recs = getCropRecommendations(crops, selectedSeason, district?.climate_zone || 'Semi-Arid', landSize);
    setRecommendations(recs);
    await createAnalysisSession({ sessionType: 'new_planning', districtId: selectedDistrict, season: selectedSeason, landSize });
    setLoading(false);
  };

  const handleSelectCrop = (rec: CropRecommendation) => {
    setAnalysisData({
      sessionType: 'new_planning',
      districtId: selectedDistrict,
      cropId: rec.crop.id,
      cropName: { en: rec.crop.name_en, ta: rec.crop.name_ta },
      season: selectedSeason,
      landSize,
      riskLevel: rec.riskLevel === 'low' ? 'safe' : rec.riskLevel === 'medium' ? 'warning' : 'danger',
      recommendations: [language === 'ta' ? `${rec.crop.name_ta} பயிரிடுவது பரிந்துரைக்கப்படுகிறது` : `Planting ${rec.crop.name_en} is recommended`],
    });
    navigate('/summary');
  };

  const getRiskBadge = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">{t('riskLevel.low')}</span>;
      case 'medium': return <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">{t('riskLevel.medium')}</span>;
      case 'high': return <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">{t('riskLevel.high')}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/home')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t('scratch.title')}</h1>
            <p className="text-sm text-muted-foreground">🌱 {t('home.startFreshDesc')}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 py-6">
        {/* District */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">{t('scratch.district')}</label>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="h-14 text-base"><SelectValue placeholder={t('scratch.selectDistrict')} /></SelectTrigger>
            <SelectContent>
              {districts.map(district => (
                <SelectItem key={district.id} value={district.id}>
                  {language === 'ta' ? district.name_ta : district.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Season */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">{t('scratch.season')}</label>
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="h-14 text-base"><SelectValue placeholder={t('scratch.selectSeason')} /></SelectTrigger>
            <SelectContent>
              {seasons.map(season => (
                <SelectItem key={season.value} value={season.value}>{season.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Land Size */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">{t('scratch.landSize')}</label>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-14 w-14" onClick={() => setLandSize(Math.max(0.5, landSize - 0.5))}><Minus className="h-5 w-5" /></Button>
            <Input type="number" value={landSize} onChange={(e) => setLandSize(Math.max(0.5, parseFloat(e.target.value) || 0.5))} className="h-14 text-center text-2xl font-bold" step="0.5" min="0.5" />
            <Button variant="outline" size="icon" className="h-14 w-14" onClick={() => setLandSize(landSize + 0.5)}><Plus className="h-5 w-5" /></Button>
          </div>
        </div>

        {/* Get Recommendation */}
        <Button onClick={handleGetRecommendation} disabled={!selectedDistrict || !selectedSeason || loading} className="h-14 w-full text-lg">
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : '🤖 '}
          {t('scratch.getRecommendation')}
        </Button>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">{t('scratch.recommendedCrops')}</h2>
            {recommendations.map((rec, index) => (
              <Card key={rec.crop.id} className="cursor-pointer p-4 transition-all hover:border-primary active:scale-[0.98]" onClick={() => handleSelectCrop(rec)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{language === 'ta' ? rec.crop.name_ta : rec.crop.name_en}</h3>
                    <p className="text-sm text-muted-foreground">{language === 'en' ? rec.crop.name_ta : rec.crop.name_en}</p>
                  </div>
                  {getRiskBadge(rec.riskLevel)}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {t('scratch.expectedYield')}: <span className="font-medium text-foreground">{rec.expectedYield.toLocaleString()} {t('common.kg')}</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Suitability</span><span>{rec.suitabilityScore}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${rec.suitabilityScore}%` }} />
                  </div>
                </div>
                {rec.riskWarning && (
                  <p className="mt-2 text-xs text-destructive">⚠️ {language === 'ta' ? rec.riskWarning.ta : rec.riskWarning.en}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
