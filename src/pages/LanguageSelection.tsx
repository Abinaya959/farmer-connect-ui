import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LanguageSelection() {
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageSelect = (lang: 'ta' | 'en') => {
    setLanguage(lang);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div>
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-5xl text-primary-foreground">
            🌾
          </div>
          <h1 className="text-4xl font-bold text-foreground">VIVASAI</h1>
          <h2 className="mt-1 text-2xl font-semibold text-primary">விவசாய்</h2>
          <p className="mt-3 text-sm text-muted-foreground">Tamil-first AI Assistant for Smart Farming</p>
          <p className="text-sm text-muted-foreground">புத்திசாலி விவசாயத்திற்கான தமிழ் AI உதவியாளர்</p>
        </div>

        <div className="mx-auto h-px w-16 bg-border" />

        <p className="text-base font-medium text-foreground">Select Language / மொழி</p>

        <div className="space-y-3">
          <Button
            onClick={() => handleLanguageSelect('ta')}
            className="h-14 w-full text-xl"
            size="lg"
          >
            தமிழ்
          </Button>
          <Button
            onClick={() => handleLanguageSelect('en')}
            variant="secondary"
            className="h-14 w-full text-xl"
            size="lg"
          >
            English
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">🌱 Empowering Tamil Nadu farmers with AI</p>
      </div>
    </div>
  );
}
