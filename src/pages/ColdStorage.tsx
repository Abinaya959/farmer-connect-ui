import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { simulateSensorData, CropData } from '@/lib/aiLogic';
import { ArrowLeft } from 'lucide-react';

type TemperatureCondition = 'hot' | 'normal' | 'cool';
type HumidityLevel = 'low' | 'medium' | 'high';

const TEMPERATURE_MAP: Record<TemperatureCondition, number> = { hot: 35, normal: 25, cool: 15 };
const HUMIDITY_MAP: Record<HumidityLevel, number> = { low: 30, medium: 60, high: 90 };

export default function ColdStorage() {
  const { t, language } = useLanguage();
  const { updateAnalysisSession, setAnalysisData, analysisData } = useSession();
  const navigate = useNavigate();

  const [crops, setCrops] = useState<CropData[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [tempCondition, setTempCondition] = useState<TemperatureCondition>('normal');
  const [humidityLevel, setHumidityLevel] = useState<HumidityLevel>('medium');
  const [storageDays, setStorageDays] = useState(5);
  const [isSimulated, setIsSimulated] = useState(false);

  useEffect(() => {
    const fetchCrops = async () => {
      const { data } = await supabase.from('crops').select('*').order('name_en');
      if (data) setCrops(data as any);
    };
    fetchCrops();
  }, []);

  const handleSimulate = () => {
    const simData = simulateSensorData();
    if (simData.temperature >= 30) setTempCondition('hot');
    else if (simData.temperature >= 20) setTempCondition('normal');
    else setTempCondition('cool');
    if (simData.humidity >= 75) setHumidityLevel('high');
    else if (simData.humidity >= 45) setHumidityLevel('medium');
    else setHumidityLevel('low');
    setStorageDays(simData.storageDays);
    setIsSimulated(true);
  };

  const handleAnalyze = async () => {
    const crop = crops.find(c => c.id === selectedCrop);
    if (!crop) return;
    const temperature = TEMPERATURE_MAP[tempCondition];
    const humidity = HUMIDITY_MAP[humidityLevel];
    await updateAnalysisSession({ cropId: selectedCrop, temperature, humidity, storageDays });
    setAnalysisData({
      ...analysisData!,
      cropId: selectedCrop,
      cropName: { en: crop.name_en, ta: crop.name_ta },
      temperature,
      humidity,
      storageDays,
    });
    navigate('/risk-prediction');
  };

  const ConditionButton = ({ active, onClick, emoji, label }: { active: boolean; onClick: () => void; emoji: string; label: string }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center rounded-xl border-2 p-4 transition-all ${active ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="mt-1 text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/existing-crop')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t('storage.title')}</h1>
            <p className="text-sm text-muted-foreground">📊 Enter storage conditions</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 py-6">
        {/* Crop Selection */}
        <div>
          <label className="mb-2 block text-sm font-semibold">{t('storage.selectCrop')}</label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="h-14 text-base"><SelectValue placeholder={t('storage.selectCrop')} /></SelectTrigger>
            <SelectContent>
              {crops.map(crop => (
                <SelectItem key={crop.id} value={crop.id}>{language === 'ta' ? crop.name_ta : crop.name_en}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="space-y-6 p-5">
          {isSimulated && (
            <div className="flex justify-end">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{t('storage.simulated')}</span>
            </div>
          )}

          {/* Temperature */}
          <div>
            <label className="mb-3 block text-sm font-semibold">{language === 'ta' ? 'வெப்பநிலை நிலை' : 'Temperature Condition'}</label>
            <div className="grid grid-cols-3 gap-3">
              <ConditionButton active={tempCondition === 'hot'} onClick={() => { setTempCondition('hot'); setIsSimulated(false); }} emoji="☀️" label={language === 'ta' ? 'வெப்பம்' : 'Hot'} />
              <ConditionButton active={tempCondition === 'normal'} onClick={() => { setTempCondition('normal'); setIsSimulated(false); }} emoji="🌤" label={language === 'ta' ? 'சாதாரண' : 'Normal'} />
              <ConditionButton active={tempCondition === 'cool'} onClick={() => { setTempCondition('cool'); setIsSimulated(false); }} emoji="🌧" label={language === 'ta' ? 'குளிர்' : 'Cool'} />
            </div>
          </div>

          {/* Humidity */}
          <div>
            <label className="mb-3 block text-sm font-semibold">{language === 'ta' ? 'ஈரப்பதம் அளவு' : 'Humidity Level'}</label>
            <div className="grid grid-cols-3 gap-3">
              <ConditionButton active={humidityLevel === 'low'} onClick={() => { setHumidityLevel('low'); setIsSimulated(false); }} emoji="💧" label={language === 'ta' ? 'குறைவு' : 'Low'} />
              <ConditionButton active={humidityLevel === 'medium'} onClick={() => { setHumidityLevel('medium'); setIsSimulated(false); }} emoji="💧💧" label={language === 'ta' ? 'நடுத்தர' : 'Medium'} />
              <ConditionButton active={humidityLevel === 'high'} onClick={() => { setHumidityLevel('high'); setIsSimulated(false); }} emoji="💧💧💧" label={language === 'ta' ? 'அதிகம்' : 'High'} />
            </div>
          </div>

          {/* Storage Days */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold">{t('storage.storageDays')}</label>
              <span className="text-lg font-bold text-primary">{storageDays} {t('risk.days')}</span>
            </div>
            <Slider value={[storageDays]} onValueChange={(val) => { setStorageDays(val[0]); setIsSimulated(false); }} min={1} max={60} step={1} className="py-4" />
            <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>30</span><span>60</span></div>
          </div>

          <Button variant="outline" onClick={handleSimulate} className="h-12 w-full">{t('storage.simulateData')}</Button>
          <p className="text-center text-xs text-muted-foreground">ℹ️ {t('storage.sensorNote')}</p>
        </Card>

        <Button onClick={handleAnalyze} disabled={!selectedCrop} className="h-14 w-full text-lg">{t('storage.analyzeRisk')}</Button>
      </main>
    </div>
  );
}
