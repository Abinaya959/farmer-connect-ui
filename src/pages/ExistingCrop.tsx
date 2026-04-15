import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sprout, Package, Check } from 'lucide-react';

type CropStatus = 'crop_in_field' | 'post_harvest';

export default function ExistingCrop() {
  const { t, language } = useLanguage();
  const { createAnalysisSession } = useSession();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CropStatus | null>(null);

  const handleProceed = async () => {
    if (!selected) return;
    await createAnalysisSession({ sessionType: selected });
    navigate('/cold-storage');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/home')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t('existing.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('home.existingCropDesc')}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 py-6">
        <Card
          className={`cursor-pointer border-2 p-5 transition-all ${selected === 'crop_in_field' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
          onClick={() => setSelected('crop_in_field')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sprout className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">🌱 {t('existing.cropInField')}</h3>
                <p className="text-sm text-muted-foreground">{t('existing.cropInFieldDesc')}</p>
              </div>
            </div>
            {selected === 'crop_in_field' && <Check className="h-6 w-6 text-primary" />}
          </div>
        </Card>

        <Card
          className={`cursor-pointer border-2 p-5 transition-all ${selected === 'post_harvest' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
          onClick={() => setSelected('post_harvest')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-accent-foreground" />
              <div>
                <h3 className="text-lg font-semibold">📦 {t('existing.harvested')}</h3>
                <p className="text-sm text-muted-foreground">{t('existing.harvestedDesc')}</p>
              </div>
            </div>
            {selected === 'post_harvest' && <Check className="h-6 w-6 text-primary" />}
          </div>
        </Card>

        <Button onClick={handleProceed} disabled={!selected} className="h-14 w-full text-lg">
          {t('existing.proceed')} →
        </Button>
      </main>
    </div>
  );
}
