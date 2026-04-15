import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Search, ExternalLink, Snowflake } from 'lucide-react';

interface Scheme {
  id: string;
  name_en: string;
  name_ta: string;
  scheme_type: string;
  description_en: string;
  description_ta: string;
  benefits_en: string;
  benefits_ta: string;
  eligibility_en: string;
  eligibility_ta: string;
  cold_storage_support: boolean;
  apply_link: string;
  contact_info: string;
}

const schemeTypeColors: Record<string, string> = {
  subsidy: 'bg-green-100 text-green-700',
  loan: 'bg-blue-100 text-blue-700',
  insurance: 'bg-purple-100 text-purple-700',
  support: 'bg-yellow-100 text-yellow-700',
};

export default function Schemes() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      const { data } = await supabase.from('schemes').select('*').eq('is_active', true).order('cold_storage_support', { ascending: false });
      if (data) {
        setSchemes(data as any);
        setFilteredSchemes(data as any);
      }
      setLoading(false);
    };
    fetchSchemes();
  }, []);

  useEffect(() => {
    let filtered = schemes;
    if (selectedType !== 'all') filtered = filtered.filter(s => s.scheme_type === selectedType);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.name_en.toLowerCase().includes(query) || s.name_ta.includes(query) || s.description_en.toLowerCase().includes(query));
    }
    setFilteredSchemes(filtered);
  }, [searchQuery, selectedType, schemes]);

  const filterButtons = [
    { value: 'all', label: t('schemes.all') },
    { value: 'subsidy', label: t('schemes.subsidy') },
    { value: 'loan', label: t('schemes.loan') },
    { value: 'insurance', label: t('schemes.insurance') },
    { value: 'support', label: t('schemes.support') },
  ];

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/home')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t('schemes.title')}</h1>
            <p className="text-sm text-muted-foreground">🏛️ Tamil Nadu Agriculture</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t('schemes.search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-14 pl-12 text-lg" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterButtons.map(btn => (
            <Button key={btn.value} variant={selectedType === btn.value ? 'default' : 'outline'} size="sm" onClick={() => setSelectedType(btn.value)}>
              {btn.label}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{language === 'ta' ? scheme.name_ta : scheme.name_en}</h3>
                  <p className="text-sm text-muted-foreground">{language === 'en' ? scheme.name_ta : scheme.name_en}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${schemeTypeColors[scheme.scheme_type] || ''}`}>
                  {t(`schemes.${scheme.scheme_type}`)}
                </span>
              </div>

              {scheme.cold_storage_support && (
                <div className="mt-2 flex items-center gap-1 text-sm text-blue-600">
                  <Snowflake className="h-4 w-4" />
                  {t('schemes.coldStorageSupport')}
                </div>
              )}

              <p className="mt-3 text-sm text-muted-foreground">{language === 'ta' ? scheme.description_ta : scheme.description_en}</p>

              <div className="mt-3 space-y-2">
                <div>
                  <span className="text-xs font-semibold text-foreground">{t('schemes.benefits')}:</span>
                  <p className="text-sm text-muted-foreground">{language === 'ta' ? scheme.benefits_ta : scheme.benefits_en}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-foreground">{t('schemes.eligibility')}:</span>
                  <p className="text-sm text-muted-foreground">{language === 'ta' ? scheme.eligibility_ta : scheme.eligibility_en}</p>
                </div>
              </div>

              {scheme.apply_link && (
                <Button variant="outline" size="sm" className="mt-3 gap-1" onClick={() => window.open(scheme.apply_link, '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                  {t('schemes.apply')}
                </Button>
              )}
            </Card>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">{language === 'ta' ? 'திட்டங்கள் எதுவும் கிடைக்கவில்லை' : 'No schemes found'}</p>
        )}
      </main>
    </div>
  );
}
