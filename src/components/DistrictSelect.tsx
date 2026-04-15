import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Language, t } from '@/lib/i18n';

interface District {
  id: string;
  name_en: string;
  name_ta: string;
}

interface DistrictSelectProps {
  language: Language;
  selectedDistrict: string | null;
  onDistrictChange: (districtId: string) => void;
}

const DistrictSelect = ({ language, selectedDistrict, onDistrictChange }: DistrictSelectProps) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('districts')
        .select('id, name_en, name_ta')
        .order('name_en');

      if (fetchError) {
        setError(t(language, 'error'));
      } else {
        setDistricts(data || []);
      }
      setLoading(false);
    };

    fetchDistricts();
  }, []);

  const selectedName = districts.find(d => d.id === selectedDistrict);
  const displayName = selectedName
    ? language === 'ta' ? selectedName.name_ta : selectedName.name_en
    : null;

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-foreground">
        {t(language, 'districtLabel')}
      </label>
      <div className="relative">
        <button
          onClick={() => !loading && setIsOpen(!isOpen)}
          disabled={loading}
          className="farmer-select-trigger"
        >
          <span className={displayName ? 'text-foreground' : 'text-muted-foreground'}>
            {loading ? t(language, 'loading') : displayName || t(language, 'selectDistrict')}
          </span>
          <svg className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && !loading && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="farmer-select-content absolute left-0 right-0 top-full z-50 mt-1 overflow-y-auto">
              {error ? (
                <div className="p-4 text-center text-sm text-destructive">{error}</div>
              ) : (
                districts.map((district) => (
                  <button
                    key={district.id}
                    className={`farmer-select-item w-full text-left ${
                      selectedDistrict === district.id ? 'bg-primary/10 font-semibold text-primary' : ''
                    }`}
                    onClick={() => {
                      onDistrictChange(district.id);
                      setIsOpen(false);
                    }}
                  >
                    {language === 'ta' ? district.name_ta : district.name_en}
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

export default DistrictSelect;
