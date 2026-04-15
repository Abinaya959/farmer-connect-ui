import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Language, t } from '@/lib/i18n';
import Login from '@/components/Login';
import DistrictSelect from '@/components/DistrictSelect';
import CropSelect from '@/components/CropSelect';
import LanguageToggle from '@/components/LanguageToggle';
import type { Session } from '@supabase/supabase-js';

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('vivasai_lang') as Language) || 'en';
  });
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);

      if (session) {
        // Save session to farmer_sessions
        supabase.from('farmer_sessions').insert({
          user_id: session.user.id,
          session_token: session.access_token,
          language,
        }).then(() => {});
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('vivasai_lang', lang);
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedCrop(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setSelectedDistrict(null);
    setSelectedCrop(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <Login
        language={language}
        onLanguageChange={handleLanguageChange}
        onLoginSuccess={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-lg font-bold text-foreground">
              {t(language, 'appName')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle language={language} onLanguageChange={handleLanguageChange} />
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {t(language, 'logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {t(language, 'welcome')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t(language, 'chooseLocation')}
          </p>
        </div>

        <div className="space-y-6">
          <DistrictSelect
            language={language}
            selectedDistrict={selectedDistrict}
            onDistrictChange={handleDistrictChange}
          />

          <CropSelect
            language={language}
            selectedDistrict={selectedDistrict}
            selectedCrop={selectedCrop}
            onCropChange={setSelectedCrop}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
