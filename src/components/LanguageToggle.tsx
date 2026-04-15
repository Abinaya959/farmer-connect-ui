import { Language } from '@/lib/i18n';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageToggle = ({ language, onLanguageChange }: LanguageToggleProps) => {
  return (
    <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
      <button
        onClick={() => onLanguageChange('en')}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('ta')}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
          language === 'ta'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
};

export default LanguageToggle;
