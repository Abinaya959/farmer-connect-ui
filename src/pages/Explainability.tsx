import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CropData } from '@/lib/aiLogic';
import { ArrowLeft, CheckCircle, XCircle, Thermometer, Droplets, Calendar } from 'lucide-react';

export default function Explainability() {
  const { t, language } = useLanguage();
  const { analysisData } = useSession();
  const navigate = useNavigate();
  const [cropData, setCropData] = useState<CropData | null>(null);

  useEffect(() => {
    const fetchCrop = async () => {
      if (!analysisData?.cropId) return;
      const { data: crop } = await supabase.from('crops').select('*').eq('id', analysisData.cropId).single();
      if (crop) setCropData(crop as any);
    };
    fetchCrop();
  }, [analysisData?.cropId]);

  if (!cropData || !analysisData) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><p>{t('common.loading')}</p></div>;
  }

  const temp = analysisData.temperature || 20;
  const humidity = analysisData.humidity || 70;
  const days = analysisData.storageDays || 5;

  const tempSafe = temp >= cropData.ideal_temp_min && temp <= cropData.ideal_temp_max;
  const humiditySafe = humidity >= cropData.ideal_humidity_min && humidity <= cropData.ideal_humidity_max;
  const durationSafe = days <= cropData.max_storage_days * 0.7;

  const StatusIcon = ({ safe }: { safe: boolean }) => (
    safe ? <CheckCircle className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-red-600" />
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/risk-prediction')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t('explain.title')}</h1>
            <p className="text-sm text-muted-foreground">{language === 'ta' ? cropData.name_ta : cropData.name_en}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Thermometer className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <h3 className="font-semibold">{t('explain.tempStatus')}</h3>
              <p className="text-sm text-muted-foreground">{language === 'ta' ? 'தற்போதைய' : 'Current'}: {temp}°C</p>
              <p className="text-xs text-muted-foreground">{language === 'ta' ? 'பாதுகாப்பான வரம்பு' : 'Safe range'}: {cropData.ideal_temp_min}-{cropData.ideal_temp_max}°C</p>
            </div>
            <StatusIcon safe={tempSafe} />
          </div>
          <p className={`mt-2 text-sm font-medium ${tempSafe ? 'text-green-600' : 'text-red-600'}`}>{tempSafe ? t('explain.safe') : t('explain.exceeded')}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Droplets className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <h3 className="font-semibold">{t('explain.humidityStatus')}</h3>
              <p className="text-sm text-muted-foreground">{language === 'ta' ? 'தற்போதைய' : 'Current'}: {humidity}%</p>
              <p className="text-xs text-muted-foreground">{language === 'ta' ? 'பாதுகாப்பான வரம்பு' : 'Safe range'}: {cropData.ideal_humidity_min}-{cropData.ideal_humidity_max}%</p>
            </div>
            <StatusIcon safe={humiditySafe} />
          </div>
          <p className={`mt-2 text-sm font-medium ${humiditySafe ? 'text-green-600' : 'text-red-600'}`}>{humiditySafe ? t('explain.safe') : t('explain.exceeded')}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <h3 className="font-semibold">{t('explain.durationStatus')}</h3>
              <p className="text-sm text-muted-foreground">{language === 'ta' ? 'தற்போதைய' : 'Current'}: {days} {t('risk.days')}</p>
              <p className="text-xs text-muted-foreground">{language === 'ta' ? 'அதிகபட்சம்' : 'Maximum'}: {cropData.max_storage_days} {t('risk.days')}</p>
            </div>
            <StatusIcon safe={durationSafe} />
          </div>
          <p className={`mt-2 text-sm font-medium ${durationSafe ? 'text-green-600' : 'text-red-600'}`}>{durationSafe ? t('explain.safe') : t('explain.exceeded')}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            🔍 {language === 'ta'
              ? 'இந்த பகுப்பாய்வு உங்களுக்கு வெளிப்படையான தகவல் வழங்க வடிவமைக்கப்பட்டுள்ளது.'
              : 'This analysis is designed to give you transparent information. The AI is not a black box.'}
          </p>
        </Card>

        <Button variant="outline" className="h-14 w-full" onClick={() => navigate('/risk-prediction')}>{t('explain.backToRisk')}</Button>
      </main>
    </div>
  );
}
