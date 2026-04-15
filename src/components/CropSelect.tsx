import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Language, t } from '@/lib/i18n';

interface Crop {
  id: string;
  name_en: string;
  name_ta: string;
}

interface CropSelectProps {
  language: Language;
  selectedDistrict: string | null;
  selectedCrop: string | null;
  onCropChange: (cropId: string) => void;
}

const CropSelect = ({ language, selectedDistrict, selectedCrop, onCropChange }: CropSelectProps) => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!selectedDistrict) {
      setCrops([]);
      return;
    }

    const fetchCrops = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('district_crops')
        .select('crop_id, crops(id, name_en, name_ta)')
        .eq('district_id', selectedDistrict);

      if (fetchError) {
        setError(t(language, 'error'));
        setCrops([]);
      } else {
        const cropsData = (data || [])
          .map((dc: any) => dc.crops)
          .filter(Boolean) as Crop[];
        setCrops(cropsData);
      }
      setLoading(false);
    };

    fetchCrops();
  }, [selectedDistrict]);

  const selectedName = crops.find(c => c.id === selectedCrop);
  const displayName = selectedName
    ? language === 'ta' ? selectedName.name_ta : selectedName.name_en
    : null;

  const disabled = !selectedDistrict || loading;

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-foreground">
        {t(language, 'cropLabel')}
      </label>
      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="farmer-select-trigger"
        >
          <span className={displayName ? 'text-foreground' : 'text-muted-foreground'}>
            {!selectedDistrict
              ? t(language, 'selectDistrictFirst')
              : loading
              ? t(language, 'loading')
              : displayName || t(language, 'selectCrop')}
          </span>
          <svg className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && !disabled && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="farmer-select-content absolute left-0 right-0 top-full z-50 mt-1 overflow-y-auto">
              {error ? (
                <div className="p-4 text-center text-sm text-destructive">{error}</div>
              ) : crops.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t(language, 'noCropsAvailable')}
                </div>
              ) : (
                crops.map((crop) => (
                  <button
                    key={crop.id}
                    className={`farmer-select-item w-full text-left ${
                      selectedCrop === crop.id ? 'bg-primary/10 font-semibold text-primary' : ''
                    }`}
                    onClick={() => {
                      onCropChange(crop.id);
                      setIsOpen(false);
                    }}
                  >
                    {language === 'ta' ? crop.name_ta : crop.name_en}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CropSelect;
